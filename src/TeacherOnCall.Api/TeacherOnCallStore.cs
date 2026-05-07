namespace TeacherOnCall.Api;

public sealed class TeacherOnCallStore
{
    public List<TutorProfile> Tutors { get; } =
    [
        new(
            Guid.Parse("06f450f6-5ca2-45f8-a41d-bc8a65ca18ab"),
            "Anita Sharma",
            "anita.sharma@example.com",
            "+977-9800000001",
            "Kathmandu",
            ["Mathematics", "Physics"],
            ["Online", "Home tuition"],
            1400,
            "Exam-focused tutor for SEE and +2 students.",
            VerificationStatus.Verified,
            4.8,
            36),
        new(
            Guid.Parse("d8597cc0-96c7-4987-aec7-323a7abff17c"),
            "Rahul Adhikari",
            "rahul.adhikari@example.com",
            "+977-9800000002",
            "Lalitpur",
            ["English", "IELTS"],
            ["Online"],
            1200,
            "Language coach for school support and IELTS preparation.",
            VerificationStatus.Verified,
            4.7,
            22),
        new(
            Guid.Parse("11fe376c-96a8-48d3-9da6-dc96b674a15a"),
            "Mina Karki",
            "mina.karki@example.com",
            "+977-9800000003",
            "Bhaktapur",
            ["Chemistry", "Biology"],
            ["Online", "Home tuition"],
            1300,
            "Science tutor with practical lesson planning.",
            VerificationStatus.Pending,
            0,
            0)
    ];

    public List<StudentProfile> Students { get; } =
    [
        new(
            Guid.Parse("c7006ff6-dff8-44fa-aad8-e3ff1c39ecae"),
            "Suman Tamang",
            "suman.tamang@example.com",
            "+977-9811111111",
            "Kathmandu",
            "Aarav Tamang",
            "Grade 9")
    ];

    public List<Booking> Bookings { get; } =
    [
        new(
            Guid.Parse("3021de1e-172c-4ebf-ad5a-b5fd1480749a"),
            Guid.Parse("06f450f6-5ca2-45f8-a41d-bc8a65ca18ab"),
            Guid.Parse("c7006ff6-dff8-44fa-aad8-e3ff1c39ecae"),
            "Mathematics",
            DateTimeOffset.UtcNow.AddDays(1),
            60,
            "Improve algebra problem solving before exams.",
            BookingStatus.Requested,
            DateTimeOffset.UtcNow.AddHours(-2))
    ];

    public List<SessionRecord> Sessions { get; } =
    [
        new(
            Guid.Parse("c64091bf-799d-48bd-a1c6-dfe1f054e7c1"),
            Guid.Parse("3021de1e-172c-4ebf-ad5a-b5fd1480749a"),
            "https://meet.google.com/teacher-on-call-demo",
            DateTimeOffset.UtcNow.AddDays(1),
            SessionStatus.Scheduled,
            "Trial class: algebra diagnostic and practice plan.")
    ];

    public List<PaymentRecord> Payments { get; } =
    [
        new(
            Guid.Parse("36aa871a-5f50-48d6-9b13-8733494869d1"),
            Guid.Parse("3021de1e-172c-4ebf-ad5a-b5fd1480749a"),
            1400,
            "eSewa manual",
            "ESEWA-DEMO-001",
            PaymentStatus.Recorded,
            DateTimeOffset.UtcNow.AddMinutes(-40))
    ];

    public List<Message> Messages { get; } =
    [
        new(
            Guid.Parse("f8e3ce1b-1634-48f0-a71b-950a4e2d4e70"),
            Guid.Parse("3021de1e-172c-4ebf-ad5a-b5fd1480749a"),
            Guid.Parse("c7006ff6-dff8-44fa-aad8-e3ff1c39ecae"),
            "Can we focus on quadratic equations in the first class?",
            DateTimeOffset.UtcNow.AddHours(-1))
    ];

    public List<TutorAvailability> Availability { get; } =
    [
        new(Guid.Parse("06f450f6-5ca2-45f8-a41d-bc8a65ca18ab"), DayOfWeek.Monday, "17:00", "20:00"),
        new(Guid.Parse("06f450f6-5ca2-45f8-a41d-bc8a65ca18ab"), DayOfWeek.Wednesday, "17:00", "20:00"),
        new(Guid.Parse("d8597cc0-96c7-4987-aec7-323a7abff17c"), DayOfWeek.Tuesday, "18:00", "21:00"),
        new(Guid.Parse("d8597cc0-96c7-4987-aec7-323a7abff17c"), DayOfWeek.Saturday, "10:00", "13:00")
    ];

    public List<ReviewRecord> Reviews { get; } =
    [
        new(
            Guid.Parse("06f450f6-5ca2-45f8-a41d-bc8a65ca18ab"),
            Guid.Parse("c7006ff6-dff8-44fa-aad8-e3ff1c39ecae"),
            5,
            "Clear explanations and a practical exam plan.",
            true,
            DateTimeOffset.UtcNow.AddDays(-14))
    ];
}

public enum VerificationStatus
{
    Pending,
    Verified,
    Rejected
}

public enum BookingStatus
{
    Requested,
    Accepted,
    Declined,
    Completed,
    Cancelled
}

public enum SessionStatus
{
    Scheduled,
    Completed,
    Cancelled
}

public enum PaymentStatus
{
    Pending,
    Recorded,
    Failed,
    Refunded,
    PayoutDue,
    PayoutComplete
}

public sealed record TutorProfile(
    Guid Id,
    string FullName,
    string Email,
    string Phone,
    string City,
    IReadOnlyList<string> Subjects,
    IReadOnlyList<string> TeachingModes,
    decimal HourlyRate,
    string Bio,
    VerificationStatus VerificationStatus,
    double Rating,
    int ReviewCount);

public sealed record StudentProfile(
    Guid Id,
    string FullName,
    string Email,
    string Phone,
    string City,
    string LearnerName,
    string GradeLevel);

public sealed record Booking(
    Guid Id,
    Guid TutorId,
    Guid StudentId,
    string Subject,
    DateTimeOffset StartTime,
    int DurationMinutes,
    string LearningGoal,
    BookingStatus Status,
    DateTimeOffset CreatedAt);

public sealed record SessionRecord(
    Guid Id,
    Guid BookingId,
    string MeetingLink,
    DateTimeOffset StartTime,
    SessionStatus Status,
    string? Notes);

public sealed record PaymentRecord(
    Guid Id,
    Guid BookingId,
    decimal Amount,
    string Method,
    string Reference,
    PaymentStatus Status,
    DateTimeOffset RecordedAt);

public sealed record Message(
    Guid Id,
    Guid ThreadId,
    Guid SenderId,
    string Body,
    DateTimeOffset SentAt);

public sealed record TutorRegistrationRequest(
    string FullName,
    string Email,
    string Phone,
    string City,
    IReadOnlyList<string> Subjects,
    IReadOnlyList<string> TeachingModes,
    decimal HourlyRate,
    string Bio);

public sealed record StudentRegistrationRequest(
    string FullName,
    string Email,
    string Phone,
    string City,
    string LearnerName,
    string GradeLevel);

public sealed record BookingRequest(
    Guid TutorId,
    Guid StudentId,
    string Subject,
    DateTimeOffset StartTime,
    int DurationMinutes,
    string LearningGoal);

public sealed record AcceptBookingRequest(string MeetingLink);

public sealed record ManualPaymentRequest(
    Guid BookingId,
    decimal Amount,
    string Method,
    string Reference);

public sealed record SendMessageRequest(Guid SenderId, string Body);

public sealed record TutorEarnings(
    Guid TutorId,
    decimal GrossEarnings,
    decimal PlatformFee,
    decimal NetEarnings);

public sealed record TutorAvailability(
    Guid TutorId,
    DayOfWeek Day,
    string StartTime,
    string EndTime);

public sealed record ReviewRecord(
    Guid TutorId,
    Guid StudentId,
    int Rating,
    string Comment,
    bool PaymentVerified,
    DateTimeOffset CreatedAt);

public sealed record StudentDashboard(
    StudentProfile Student,
    IEnumerable<Booking> Bookings,
    IEnumerable<SessionRecord> Sessions,
    IEnumerable<PaymentRecord> Payments,
    IEnumerable<Message> Messages);

public sealed record TutorDashboard(
    TutorProfile Tutor,
    IEnumerable<Booking> BookingRequests,
    IEnumerable<SessionRecord> UpcomingSessions,
    TutorEarnings Earnings,
    IEnumerable<TutorAvailability> Availability,
    IEnumerable<ReviewRecord> Reviews);

public sealed record AdminDashboard(
    int TutorCount,
    int PendingTutorVerifications,
    int StudentCount,
    int BookingCount,
    int PendingBookingRequests,
    int ScheduledSessions,
    decimal RecordedRevenue);
