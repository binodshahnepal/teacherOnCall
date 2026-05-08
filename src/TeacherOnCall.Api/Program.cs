using Npgsql;
using TeacherOnCall.Api;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyHeader()
            .AllowAnyMethod()
            .AllowAnyOrigin());
});

builder.Services.AddSingleton<TeacherOnCallStore>();

var app = builder.Build();

app.UseCors();

app.MapGet("/", () => Results.Ok(new
{
    app = "Teacher on Call API",
    status = "ready",
    endpoints = new[]
    {
        "/api/tutors",
        "/api/bookings",
        "/api/messages/{threadId}",
        "/api/admin/dashboard"
    }
}));

app.MapGet("/api/health/database", async (IConfiguration configuration) =>
{
    var connectionString = configuration.GetConnectionString("DefaultConnection");
    if (string.IsNullOrWhiteSpace(connectionString))
    {
        return Results.Problem("DefaultConnection is not configured.", statusCode: StatusCodes.Status503ServiceUnavailable);
    }

    try
    {
        await using var connection = new NpgsqlConnection(connectionString);
        await connection.OpenAsync();
        await using var command = new NpgsqlCommand("select current_database(), current_user, version()", connection);
        await using var reader = await command.ExecuteReaderAsync();
        await reader.ReadAsync();

        return Results.Ok(new
        {
            status = "ready",
            database = reader.GetString(0),
            user = reader.GetString(1),
            version = reader.GetString(2)
        });
    }
    catch (Exception exception)
    {
        return Results.Problem(exception.Message, statusCode: StatusCodes.Status503ServiceUnavailable);
    }
});

app.MapGet("/api/tutors", (
    TeacherOnCallStore store,
    string? subject,
    string? location,
    decimal? maxHourlyRate,
    bool verifiedOnly = true) =>
{
    var tutors = store.Tutors.AsEnumerable();

    if (verifiedOnly)
    {
        tutors = tutors.Where(tutor => tutor.VerificationStatus == VerificationStatus.Verified);
    }

    if (!string.IsNullOrWhiteSpace(subject))
    {
        tutors = tutors.Where(tutor =>
            tutor.Subjects.Any(item => item.Contains(subject, StringComparison.OrdinalIgnoreCase)));
    }

    if (!string.IsNullOrWhiteSpace(location))
    {
        tutors = tutors.Where(tutor =>
            tutor.City.Contains(location, StringComparison.OrdinalIgnoreCase) ||
            tutor.TeachingModes.Any(item => item.Contains(location, StringComparison.OrdinalIgnoreCase)));
    }

    if (maxHourlyRate is not null)
    {
        tutors = tutors.Where(tutor => tutor.HourlyRate <= maxHourlyRate);
    }

    return Results.Ok(tutors.OrderByDescending(tutor => tutor.Rating));
});

app.MapGet("/api/tutors/{id:guid}", (TeacherOnCallStore store, Guid id) =>
    store.Tutors.FirstOrDefault(tutor => tutor.Id == id) is { } tutor
        ? Results.Ok(tutor)
        : Results.NotFound());

app.MapGet("/api/tutors/{id:guid}/dashboard", (TeacherOnCallStore store, Guid id) =>
{
    var tutor = store.Tutors.FirstOrDefault(item => item.Id == id);
    if (tutor is null)
    {
        return Results.NotFound();
    }

    var bookingIds = store.Bookings
        .Where(booking => booking.TutorId == id)
        .Select(booking => booking.Id)
        .ToHashSet();

    var totalPaid = store.Payments
        .Where(payment => bookingIds.Contains(payment.BookingId) && payment.Status == PaymentStatus.Recorded)
        .Sum(payment => payment.Amount);

    var platformFee = Math.Round(totalPaid * 0.15m, 2);
    var earnings = new TutorEarnings(id, totalPaid, platformFee, totalPaid - platformFee);

    return Results.Ok(new TutorDashboard(
        tutor,
        store.Bookings.Where(booking => booking.TutorId == id).OrderByDescending(booking => booking.CreatedAt),
        store.Sessions.Where(session => bookingIds.Contains(session.BookingId)).OrderBy(session => session.StartTime),
        earnings,
        store.Availability.Where(slot => slot.TutorId == id),
        store.Reviews.Where(review => review.TutorId == id).OrderByDescending(review => review.CreatedAt)));
});

app.MapPost("/api/tutors/register", (TeacherOnCallStore store, TutorRegistrationRequest request) =>
{
    var tutor = new TutorProfile(
        Guid.NewGuid(),
        request.FullName,
        request.Email,
        request.Phone,
        request.City,
        request.Subjects,
        request.TeachingModes,
        request.HourlyRate,
        request.Bio,
        VerificationStatus.Pending,
        0,
        0);

    store.Tutors.Add(tutor);
    return Results.Created($"/api/tutors/{tutor.Id}", tutor);
});

app.MapPost("/api/students/register", (TeacherOnCallStore store, StudentRegistrationRequest request) =>
{
    var student = new StudentProfile(
        Guid.NewGuid(),
        request.FullName,
        request.Email,
        request.Phone,
        request.City,
        request.LearnerName,
        request.GradeLevel);

    store.Students.Add(student);
    return Results.Created($"/api/students/{student.Id}", student);
});

app.MapGet("/api/students/{id:guid}/dashboard", (TeacherOnCallStore store, Guid id) =>
{
    var student = store.Students.FirstOrDefault(item => item.Id == id);
    if (student is null)
    {
        return Results.NotFound();
    }

    var bookingIds = store.Bookings
        .Where(booking => booking.StudentId == id)
        .Select(booking => booking.Id)
        .ToHashSet();

    return Results.Ok(new StudentDashboard(
        student,
        store.Bookings.Where(booking => booking.StudentId == id).OrderByDescending(booking => booking.CreatedAt),
        store.Sessions.Where(session => bookingIds.Contains(session.BookingId)).OrderBy(session => session.StartTime),
        store.Payments.Where(payment => bookingIds.Contains(payment.BookingId)).OrderByDescending(payment => payment.RecordedAt),
        store.Messages.Where(message => bookingIds.Contains(message.ThreadId)).OrderByDescending(message => message.SentAt)));
});

app.MapGet("/api/bookings", (TeacherOnCallStore store, BookingStatus? status) =>
{
    var bookings = store.Bookings.AsEnumerable();

    if (status is not null)
    {
        bookings = bookings.Where(booking => booking.Status == status);
    }

    return Results.Ok(bookings.OrderByDescending(booking => booking.CreatedAt));
});

app.MapPost("/api/bookings", (TeacherOnCallStore store, BookingRequest request) =>
{
    if (store.Tutors.All(tutor => tutor.Id != request.TutorId))
    {
        return Results.BadRequest(new { message = "Tutor does not exist." });
    }

    if (store.Students.All(student => student.Id != request.StudentId))
    {
        return Results.BadRequest(new { message = "Student does not exist." });
    }

    var booking = new Booking(
        Guid.NewGuid(),
        request.TutorId,
        request.StudentId,
        request.Subject,
        request.StartTime,
        request.DurationMinutes,
        request.LearningGoal,
        BookingStatus.Requested,
        DateTimeOffset.UtcNow);

    store.Bookings.Add(booking);
    return Results.Created($"/api/bookings/{booking.Id}", booking);
});

app.MapPost("/api/bookings/{id:guid}/accept", (TeacherOnCallStore store, Guid id, AcceptBookingRequest request) =>
{
    var index = store.Bookings.FindIndex(booking => booking.Id == id);
    if (index < 0)
    {
        return Results.NotFound();
    }

    var booking = store.Bookings[index] with { Status = BookingStatus.Accepted };
    store.Bookings[index] = booking;

    var session = new SessionRecord(
        Guid.NewGuid(),
        booking.Id,
        request.MeetingLink,
        booking.StartTime,
        SessionStatus.Scheduled,
        null);

    store.Sessions.Add(session);
    return Results.Ok(new { booking, session });
});

app.MapGet("/api/sessions", (TeacherOnCallStore store) =>
    Results.Ok(store.Sessions.OrderBy(session => session.StartTime)));

app.MapGet("/api/payments", (TeacherOnCallStore store, PaymentStatus? status) =>
{
    var payments = store.Payments.AsEnumerable();

    if (status is not null)
    {
        payments = payments.Where(payment => payment.Status == status);
    }

    return Results.Ok(payments.OrderByDescending(payment => payment.RecordedAt));
});

app.MapPost("/api/payments/manual", (TeacherOnCallStore store, ManualPaymentRequest request) =>
{
    if (store.Bookings.All(booking => booking.Id != request.BookingId))
    {
        return Results.BadRequest(new { message = "Booking does not exist." });
    }

    var payment = new PaymentRecord(
        Guid.NewGuid(),
        request.BookingId,
        request.Amount,
        request.Method,
        request.Reference,
        PaymentStatus.Recorded,
        DateTimeOffset.UtcNow);

    store.Payments.Add(payment);
    return Results.Created($"/api/payments/{payment.Id}", payment);
});

app.MapGet("/api/tutors/{id:guid}/earnings", (TeacherOnCallStore store, Guid id) =>
{
    var bookingIds = store.Bookings
        .Where(booking => booking.TutorId == id)
        .Select(booking => booking.Id)
        .ToHashSet();

    var totalPaid = store.Payments
        .Where(payment => bookingIds.Contains(payment.BookingId))
        .Sum(payment => payment.Amount);

    var platformFee = Math.Round(totalPaid * 0.15m, 2);
    return Results.Ok(new TutorEarnings(id, totalPaid, platformFee, totalPaid - platformFee));
});

app.MapGet("/api/messages/{threadId:guid}", (TeacherOnCallStore store, Guid threadId) =>
    Results.Ok(store.Messages
        .Where(message => message.ThreadId == threadId)
        .OrderBy(message => message.SentAt)));

app.MapPost("/api/messages/{threadId:guid}", (TeacherOnCallStore store, Guid threadId, SendMessageRequest request) =>
{
    var message = new Message(
        Guid.NewGuid(),
        threadId,
        request.SenderId,
        request.Body,
        DateTimeOffset.UtcNow);

    store.Messages.Add(message);
    return Results.Created($"/api/messages/{threadId}/{message.Id}", message);
});

app.MapGet("/api/admin/dashboard", (TeacherOnCallStore store) => Results.Ok(new AdminDashboard(
    store.Tutors.Count,
    store.Tutors.Count(tutor => tutor.VerificationStatus == VerificationStatus.Pending),
    store.Students.Count,
    store.Bookings.Count,
    store.Bookings.Count(booking => booking.Status == BookingStatus.Requested),
    store.Sessions.Count(session => session.Status == SessionStatus.Scheduled),
    store.Payments.Sum(payment => payment.Amount))));

app.MapGet("/api/admin/tutors/pending", (TeacherOnCallStore store) =>
    Results.Ok(store.Tutors
        .Where(tutor => tutor.VerificationStatus == VerificationStatus.Pending)
        .OrderBy(tutor => tutor.FullName)));

app.MapPost("/api/admin/tutors/{id:guid}/verify", (TeacherOnCallStore store, Guid id) =>
{
    var index = store.Tutors.FindIndex(tutor => tutor.Id == id);
    if (index < 0)
    {
        return Results.NotFound();
    }

    var tutor = store.Tutors[index] with { VerificationStatus = VerificationStatus.Verified };
    store.Tutors[index] = tutor;
    return Results.Ok(tutor);
});

app.Run();
