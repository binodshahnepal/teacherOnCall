import { FormEvent, lazy, ReactNode, Suspense, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  Clock3,
  CreditCard,
  Filter,
  FileCheck2,
  Globe2,
  GraduationCap,
  Heart,
  LayoutDashboard,
  MapPin,
  MessageSquare,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  UserCheck,
  UserPlus,
  Video,
  Users
} from "lucide-react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const LandingScene3D = lazy(() =>
  import("./LandingScene3D").then((module) => ({ default: module.LandingScene3D }))
);
const SectionScene3D = lazy(() =>
  import("./SectionScene3D").then((module) => ({ default: module.SectionScene3D }))
);
const SignupScene3D = lazy(() =>
  import("./SignupScene3D").then((module) => ({ default: module.SignupScene3D }))
);

type Tutor = {
  id: string;
  fullName: string;
  city: string;
  subjects: string[];
  teachingModes: string[];
  hourlyRate: number;
  bio: string;
  verificationStatus: "Pending" | "Verified" | "Rejected";
  rating: number;
  reviewCount: number;
  availability: string[];
  accent: string;
  photo: string;
  headline: string;
  lessons: number;
  activeStudents: number;
  languages: string[];
  nextSlot: string;
};

type Booking = {
  id: string;
  tutorName: string;
  studentName: string;
  learnerName: string;
  subject: string;
  startTime: string;
  durationMinutes: number;
  learningGoal: string;
  status: "Requested" | "Accepted" | "Declined" | "Completed" | "Cancelled";
  paymentStatus: "Pending" | "Recorded" | "PayoutDue" | "PayoutComplete";
  amount: number;
};

const tutors: Tutor[] = [
  {
    id: "06f450f6-5ca2-45f8-a41d-bc8a65ca18ab",
    fullName: "Anita Sharma",
    city: "Kathmandu",
    subjects: ["Mathematics", "Physics"],
    teachingModes: ["Online", "Home tuition"],
    hourlyRate: 1400,
    bio: "Exam-focused tutor for SEE and +2 students with practical weekly plans.",
    verificationStatus: "Verified",
    rating: 4.8,
    reviewCount: 36,
    availability: ["Mon 5-8 PM", "Wed 5-8 PM", "Sat 10 AM-1 PM"],
    accent: "mint",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=85",
    headline: "SEE and +2 exam coach for confident problem solving",
    lessons: 214,
    activeStudents: 18,
    languages: ["Nepali", "English"],
    nextSlot: "Today 5:00 PM"
  },
  {
    id: "d8597cc0-96c7-4987-aec7-323a7abff17c",
    fullName: "Rahul Adhikari",
    city: "Lalitpur",
    subjects: ["English", "IELTS"],
    teachingModes: ["Online"],
    hourlyRate: 1200,
    bio: "Language coach for school support, IELTS preparation, and speaking confidence.",
    verificationStatus: "Verified",
    rating: 4.7,
    reviewCount: 22,
    availability: ["Tue 6-9 PM", "Sat 10 AM-1 PM"],
    accent: "blue",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=85",
    headline: "IELTS speaking and school English mentor",
    lessons: 148,
    activeStudents: 11,
    languages: ["English", "Nepali"],
    nextSlot: "Tomorrow 6:30 PM"
  },
  {
    id: "11fe376c-96a8-48d3-9da6-dc96b674a15a",
    fullName: "Mina Karki",
    city: "Bhaktapur",
    subjects: ["Chemistry", "Biology"],
    teachingModes: ["Online", "Home tuition"],
    hourlyRate: 1300,
    bio: "Science tutor with practical lesson planning and parent-friendly progress notes.",
    verificationStatus: "Pending",
    rating: 0,
    reviewCount: 0,
    availability: ["Verification pending"],
    accent: "amber",
    photo: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=600&q=85",
    headline: "Science tutor with practical plans and parent updates",
    lessons: 0,
    activeStudents: 0,
    languages: ["Nepali", "English"],
    nextSlot: "After verification"
  }
];

const bookings: Booking[] = [
  {
    id: "B-1024",
    tutorName: "Anita Sharma",
    studentName: "Suman Tamang",
    learnerName: "Aarav Tamang",
    subject: "Mathematics",
    startTime: "May 8, 5:00 PM",
    durationMinutes: 60,
    learningGoal: "Improve algebra problem solving before exams.",
    status: "Accepted",
    paymentStatus: "Recorded",
    amount: 1400
  },
  {
    id: "B-1025",
    tutorName: "Rahul Adhikari",
    studentName: "Nisha Gurung",
    learnerName: "Pranav Gurung",
    subject: "IELTS Speaking",
    startTime: "May 10, 6:30 PM",
    durationMinutes: 45,
    learningGoal: "Build fluency for interview-style speaking.",
    status: "Requested",
    paymentStatus: "Pending",
    amount: 900
  }
];

const money = new Intl.NumberFormat("en-NP", {
  style: "currency",
  currency: "NPR",
  maximumFractionDigits: 0
});

function App() {
  const [view, setView] = useState("landing");
  const [signupRole, setSignupRole] = useState<"student" | "tutor">("student");
  const [subject, setSubject] = useState("");
  const [mode, setMode] = useState("All");
  const [selectedTutor, setSelectedTutor] = useState(tutors[0]);
  const [bookingSent, setBookingSent] = useState(false);

  const filteredTutors = useMemo(() => {
    return tutors.filter((tutor) => {
      const matchesSubject =
        !subject || tutor.subjects.some((item) => item.toLowerCase().includes(subject.toLowerCase()));
      const matchesMode = mode === "All" || tutor.teachingModes.includes(mode);
      return matchesSubject && matchesMode;
    });
  }, [mode, subject]);

  function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBookingSent(true);
  }

  if (view === "landing") {
    return (
      <main className="public-site">
        <PublicHeader
          onFind={() => setView("marketplace")}
          onStudentSignup={() => {
            setSignupRole("student");
            setView("signup");
          }}
          onTutorSignup={() => {
            setSignupRole("tutor");
            setView("signup");
          }}
        />
        <Landing
          onStart={() => setView("marketplace")}
          onStudentSignup={() => {
            setSignupRole("student");
            setView("signup");
          }}
          onTutorSignup={() => {
            setSignupRole("tutor");
            setView("signup");
          }}
        />
      </main>
    );
  }

  if (view === "marketplace") {
    return (
      <main className="public-site">
        <PublicHeader
          onFind={() => setView("marketplace")}
          onStudentSignup={() => {
            setSignupRole("student");
            setView("signup");
          }}
          onTutorSignup={() => {
            setSignupRole("tutor");
            setView("signup");
          }}
        />
        <section className="public-marketplace">
          <Marketplace
            subject={subject}
            setSubject={setSubject}
            mode={mode}
            setMode={setMode}
            filteredTutors={filteredTutors}
            selectedTutor={selectedTutor}
            setSelectedTutor={setSelectedTutor}
            bookingSent={bookingSent}
            setBookingSent={setBookingSent}
            submitBooking={submitBooking}
          />
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <span className="brand-mark">TC</span>
          <div>
            <p className="eyebrow">Teacher on Call</p>
            <h1>Tutor marketplace</h1>
          </div>
        </div>
        <nav>
          <button className={view === "landing" ? "active" : ""} onClick={() => setView("landing")}>
            <GraduationCap size={18} /> Landing
          </button>
          <button className={view === "marketplace" ? "active" : ""} onClick={() => setView("marketplace")}>
            <Search size={18} /> Marketplace
          </button>
          <button className={view === "signup" ? "active" : ""} onClick={() => setView("signup")}>
            <UserPlus size={18} /> Sign up
          </button>
          <button className={view === "student" ? "active" : ""} onClick={() => setView("student")}>
            <Users size={18} /> Student
          </button>
          <button className={view === "tutor" ? "active" : ""} onClick={() => setView("tutor")}>
            <UserCheck size={18} /> Tutor
          </button>
          <button className={view === "admin" ? "active" : ""} onClick={() => setView("admin")}>
            <ShieldCheck size={18} /> Admin
          </button>
        </nav>
        {view === "signup" && (
          <div className="sidebar-signup-scene">
            <Suspense fallback={null}>
              <SignupScene3D />
            </Suspense>
            <span><ShieldCheck size={15} /> Live matching</span>
          </div>
        )}
        <div className="sidebar-card">
          <span>Live MVP</span>
          <strong>3 tutors, 2 bookings, 1 payment recorded</strong>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Marketplace operations</p>
            <h2>{viewTitles[view]}</h2>
          </div>
          <button className="ghost-action">
            <SlidersHorizontal size={18} /> Control center
          </button>
          <div className="metrics">
            <Metric icon={<Users size={18} />} label="Tutors" value="3" />
            <Metric icon={<CalendarCheck size={18} />} label="Bookings" value="2" />
            <Metric icon={<CreditCard size={18} />} label="Revenue" value={money.format(1400)} />
          </div>
        </header>

        {view === "signup" && <SignupPage signupRole={signupRole} setSignupRole={setSignupRole} />}
        {view === "marketplace" && (
          <Marketplace
            subject={subject}
            setSubject={setSubject}
            mode={mode}
            setMode={setMode}
            filteredTutors={filteredTutors}
            selectedTutor={selectedTutor}
            setSelectedTutor={setSelectedTutor}
            bookingSent={bookingSent}
            setBookingSent={setBookingSent}
            submitBooking={submitBooking}
          />
        )}
        {view === "student" && <StudentDashboard />}
        {view === "tutor" && <TutorDashboard />}
        {view === "admin" && <AdminDashboard />}
      </section>
    </main>
  );
}

const viewTitles: Record<string, string> = {
  landing: "Public landing and conversion",
  signup: "Student and tutor registration",
  marketplace: "Find, book, and message tutors",
  student: "Student dashboard",
  tutor: "Tutor dashboard",
  admin: "Admin dashboard"
};

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <span>
      {icon}
      <small>{label}</small>
      {value}
    </span>
  );
}

function PublicHeader({
  onFind,
  onStudentSignup,
  onTutorSignup
}: {
  onFind: () => void;
  onStudentSignup: () => void;
  onTutorSignup: () => void;
}) {
  return (
    <header className="public-header">
      <button className="public-brand" onClick={onFind}>
        <span>TC</span>
        Teacher on Call
      </button>
      <nav className="public-nav">
        <button onClick={onFind}>Find tutors</button>
        <button onClick={onTutorSignup}>Teach</button>
        <button onClick={onStudentSignup}>Sign up</button>
      </nav>
      <button className="public-cta" onClick={onFind}>Find your tutor</button>
    </header>
  );
}

function Landing({
  onStart,
  onStudentSignup,
  onTutorSignup
}: {
  onStart: () => void;
  onStudentSignup: () => void;
  onTutorSignup: () => void;
}) {
  return (
    <>
      <section className="standard-hero">
        <div className="hero-intent">
          <p className="eyebrow">Trusted online and home tutors</p>
          <h3>Find the right tutor for school, exams, and confidence.</h3>
          <p>
            Browse verified tutor profiles, compare price and availability, then request a lesson
            or interview before you book.
          </p>
          <div className="hero-actions">
            <button className="primary" onClick={onStart}><Search size={18} /> Find a tutor</button>
            <button className="secondary" onClick={onTutorSignup}>Become a tutor</button>
          </div>
        </div>
        <Suspense fallback={<div className="landing-scene-canvas scene-loading" aria-hidden="true" />}>
          <LandingScene3D />
        </Suspense>
      </section>

      <section className="landing-search-panel" aria-label="Tutor search filters">
        <label>
          Subject
          <div className="input-with-icon">
            <Search size={18} />
            <input placeholder="Math, IELTS, Biology" />
          </div>
        </label>
        <label>
          Level
          <CustomSelect value="SEE / +2" options={["SEE / +2", "Primary", "Secondary", "IELTS", "Adult learner"]} />
        </label>
        <label>
          Mode
          <CustomSelect value="Online or home" options={["Online or home", "Online", "Home tuition"]} />
        </label>
        <label>
          Budget
          <CustomSelect value="Any budget" options={["Any budget", "Up to NPR 1,200", "NPR 1,200-1,800", "NPR 1,800+"]} />
        </label>
        <button className="primary" onClick={onStart}>Show tutors</button>
      </section>

      <section className="trust-row">
        <span><strong>Verified</strong> tutor profiles</span>
        <span><strong>Online + home</strong> lesson options</span>
        <span><strong>Request</strong> a lesson or interview</span>
        <span><strong>Track</strong> bookings and payments</span>
      </section>

      <section className="landing-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Popular subjects</p>
            <h3>Start with the learner's goal.</h3>
          </div>
          <button className="text-link compact" onClick={onStart}>View all tutors</button>
        </div>
        <div className="category-grid">
          {[
            ["Mathematics", "SEE algebra, +2 calculus", "18 tutors", "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=700&q=82"],
            ["Science", "Chemistry, biology, physics", "12 tutors", "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=700&q=82"],
            ["English", "School support, IELTS", "9 tutors", "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=700&q=82"],
            ["Home tuition", "Kathmandu valley tutors", "Online or home", "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=700&q=82"]
          ].map(([title, detail, meta, image]) => (
            <button key={title} className="category-card rich-category" onClick={onStart}>
              <img src={image} alt="" />
              <span>{title[0]}</span>
              <strong>{title}</strong>
              <small>{detail}</small>
              <em>{meta}</em>
            </button>
          ))}
        </div>
      </section>

      <section className="landing-section featured-tutors standard-featured">
        <Suspense fallback={null}>
          <SectionScene3D />
        </Suspense>
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Recommended tutors</p>
            <h3>Compare tutors by rating, price, lessons, and next slot.</h3>
          </div>
          <button className="text-link compact" onClick={onStart}>Explore marketplace</button>
        </div>
        <div className="featured-tutor-grid">
          {tutors.map((tutor) => (
            <article className="featured-tutor" key={tutor.id}>
              <div className="featured-photo">
                <img src={tutor.photo} alt="" />
                <span><Star size={15} /> {tutor.rating || "New"} ({tutor.reviewCount})</span>
              </div>
              <div className="featured-profile-copy">
                <span className="verified-line">
                  {tutor.verificationStatus === "Verified" ? <BadgeCheck size={17} /> : <Clock3 size={17} />}
                  {tutor.verificationStatus} tutor
                </span>
                <h4>{tutor.fullName}</h4>
                <p>{tutor.headline}</p>
                <div className="tutor-tags">
                  {tutor.subjects.map((item) => <span key={item}>{item}</span>)}
                  {tutor.teachingModes.map((item) => <span key={item}>{item}</span>)}
                </div>
                <div className="featured-card-meta">
                  <span>{tutor.activeStudents} active students</span>
                  <span>{tutor.lessons} lessons</span>
                  <span>{tutor.languages.join(", ")}</span>
                </div>
              </div>
              <aside className="featured-booking-panel">
                <strong>{money.format(tutor.hourlyRate)}/hr</strong>
                <span>{tutor.nextSlot}</span>
                <button className="primary" onClick={onStart}>Book trial</button>
                <button className="secondary" onClick={onStart}>View profile</button>
              </aside>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section proof-stories">
        <div className="section-heading">
          <p className="eyebrow">What families look for</p>
          <h3>Simple proof before the first lesson.</h3>
        </div>
        <div className="testimonial-grid">
          {[
            ["Easy to compare", "Subject, price, schedule, and reviews sit together so parents can make a quick decision."],
            ["Interview first", "Students can request a class with a clear learning goal before committing to regular lessons."],
            ["Built for tutors too", "Tutors manage profile details, availability, booking requests, and earnings in one place."]
          ].map(([title, text]) => (
            <article key={title}>
              <h4>{title}</h4>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section how-it-works standard-steps">
        <div>
          <span>01</span>
          <Search size={24} />
          <h3>Search</h3>
          <p>Filter by subject, city, home tuition, online lessons, schedule, and price.</p>
        </div>
        <div>
          <span>02</span>
          <UserCheck size={24} />
          <h3>Choose</h3>
          <p>Review tutor qualifications, experience, ratings, and availability in one profile.</p>
        </div>
        <div>
          <span>03</span>
          <CalendarCheck size={24} />
          <h3>Connect</h3>
          <p>Request an interview or lesson with the learner goal so the tutor can prepare.</p>
        </div>
        <div>
          <span>04</span>
          <GraduationCap size={24} />
          <h3>Learn</h3>
          <p>Use an external meeting link or home tuition, then track payment and progress.</p>
        </div>
      </section>

      <section className="landing-section audience-grid">
        <InfoCard icon={<Users />} title="For students" text="Save tutors, request lessons, view session links, and track payment status." />
        <InfoCard icon={<UserCheck />} title="For tutors" text="Manage profile, booking requests, upcoming sessions, and earnings." />
        <InfoCard icon={<LayoutDashboard />} title="For admins" text="Verify tutors, monitor booking flow, and review revenue operations." />
      </section>

      <section className="final-cta standard-final">
        <div>
          <p className="eyebrow">Ready to start?</p>
          <h3>Find a tutor, meet first, then book with confidence.</h3>
          <p>Search verified profiles or create your account to manage lessons, messages, and payments.</p>
          <div className="final-proof">
            <span><BadgeCheck size={16} /> Verified tutors</span>
            <span><CalendarCheck size={16} /> Trial requests</span>
            <span><CreditCard size={16} /> Payment tracking</span>
          </div>
        </div>
        <div className="final-actions">
          <button className="hero-cta" onClick={onStart}>Find your tutor <ArrowUpRight size={20} /></button>
          <button className="secondary" onClick={onTutorSignup}>Apply as tutor</button>
          <button className="secondary" onClick={onStudentSignup}>Create student profile</button>
        </div>
      </section>
    </>
  );
}

function SignupPage({
  signupRole,
  setSignupRole
}: {
  signupRole: "student" | "tutor";
  setSignupRole: (role: "student" | "tutor") => void;
}) {
  const [submitted, setSubmitted] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="signup-shell">
      <div className="signup-intro">
        <div className="signup-visual" aria-hidden="true">
          <img
            src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=900&q=84"
            alt=""
          />
          <span><ShieldCheck size={16} /> Safe matching</span>
        </div>
        <div>
          <p className="eyebrow">Registration</p>
          <h3>{signupRole === "student" ? "Create a learner profile that tutors can act on." : "Apply to teach with a profile parents can trust."}</h3>
          <p>
            {signupRole === "student"
              ? "Tell tutors who is learning, what they need, and how they prefer to study so the first request is useful."
              : "Share your subjects, rate, schedule, and verification details so students can compare you confidently."}
          </p>
        </div>
        <div className="role-switch">
          <button className={signupRole === "student" ? "active" : ""} onClick={() => { setSignupRole("student"); setSubmitted(false); }}>
            <Users size={18} />
            <span>
              <strong>Student / parent</strong>
              <small>Find tutors and request lessons</small>
            </span>
          </button>
          <button className={signupRole === "tutor" ? "active" : ""} onClick={() => { setSignupRole("tutor"); setSubmitted(false); }}>
            <UserCheck size={18} />
            <span>
              <strong>Tutor</strong>
              <small>Apply, verify, and receive bookings</small>
            </span>
          </button>
        </div>
        <div className="signup-proof">
          <span><FileCheck2 size={18} /> Verification-ready</span>
          <span><CalendarCheck size={18} /> Booking-ready</span>
          <span><MessageSquare size={18} /> Messaging-ready</span>
        </div>
        <div className="signup-steps">
          <span className="active">Profile</span>
          <span>Match</span>
          <span>Book</span>
        </div>
      </div>

      <form className="signup-form" onSubmit={submit}>
        <div className="signup-form-head">
          <div>
            <p className="eyebrow">{signupRole === "student" ? "Student onboarding" : "Tutor onboarding"}</p>
            <h3>{signupRole === "student" ? "Learner and contact details" : "Teaching and verification details"}</h3>
          </div>
          <span>{signupRole === "student" ? "Takes 2 minutes" : "Verification-ready"}</span>
        </div>
        {signupRole === "student" ? <StudentSignupFields /> : <TutorSignupFields />}
        <button className="primary" type="submit">
          {signupRole === "student" ? "Create student profile" : "Submit tutor application"}
        </button>
        {submitted && (
          <p className="success">
            {signupRole === "student"
              ? "Student profile drafted. Next step: connect this form to POST /api/students/register."
              : "Tutor application drafted. Next step: connect this form to POST /api/tutors/register and admin verification."}
          </p>
        )}
      </form>
    </section>
  );
}

function StudentSignupFields() {
  return (
    <>
      <div className="form-section">
        <h4>Parent or student details</h4>
        <div className="form-row two">
          <label>
            Full name
            <input placeholder="Suman Tamang" />
          </label>
          <label>
            Email
            <input type="email" placeholder="suman@example.com" />
          </label>
        </div>
        <div className="form-row two">
          <label>
            Phone
            <input placeholder="+977-9811111111" />
          </label>
          <label>
            City
            <input placeholder="Kathmandu" />
          </label>
        </div>
      </div>

      <div className="form-section">
        <h4>Learner profile</h4>
        <div className="form-row two">
          <label>
            Learner name
            <input placeholder="Aarav Tamang" />
          </label>
          <label>
            Grade level
            <select defaultValue="">
              <option value="" disabled>Select grade</option>
              <option>Grade 6</option>
              <option>Grade 7</option>
              <option>Grade 8</option>
              <option>Grade 9</option>
              <option>SEE</option>
              <option>+2</option>
              <option>IELTS / Test prep</option>
            </select>
          </label>
        </div>
        <div className="form-row two">
          <label>
            Subject needed
            <input placeholder="Mathematics, Science, IELTS" />
          </label>
          <label>
            Preferred mode
            <select defaultValue="Online">
              <option>Online</option>
              <option>Home tuition</option>
              <option>Either</option>
            </select>
          </label>
        </div>
        <label>
          Learning goal
          <textarea placeholder="Describe the learner's current challenge, exam target, schedule constraints, or preferred tutor style." />
        </label>
      </div>
    </>
  );
}

function TutorSignupFields() {
  return (
    <>
      <div className="form-section">
        <h4>Personal and contact details</h4>
        <div className="form-row two">
          <label>
            Full name
            <input placeholder="Anita Sharma" />
          </label>
          <label>
            Email
            <input type="email" placeholder="anita@example.com" />
          </label>
        </div>
        <div className="form-row two">
          <label>
            Phone
            <input placeholder="+977-9800000001" />
          </label>
          <label>
            City
            <input placeholder="Kathmandu" />
          </label>
        </div>
      </div>

      <div className="form-section">
        <h4>Teaching profile</h4>
        <div className="form-row two">
          <label>
            Subjects
            <input placeholder="Mathematics, Physics" />
          </label>
          <label>
            Hourly rate
            <input type="number" min="0" placeholder="1400" />
          </label>
        </div>
        <div className="form-row two">
          <label>
            Teaching modes
            <select defaultValue="Online and home tuition">
              <option>Online</option>
              <option>Home tuition</option>
              <option>Online and home tuition</option>
            </select>
          </label>
          <label>
            Experience
            <input placeholder="5 years, SEE and +2" />
          </label>
        </div>
        <label>
          Tutor bio
          <textarea placeholder="Summarize your teaching approach, exam focus, achievements, and student outcomes." />
        </label>
      </div>

      <div className="form-section">
        <h4>Verification and availability</h4>
        <div className="form-row two">
          <label>
            Qualification
            <input placeholder="BSc Physics, TU" />
          </label>
          <label>
            ID / certificate reference
            <input placeholder="Citizenship, teaching certificate, transcript" />
          </label>
        </div>
        <label>
          Available slots
          <input placeholder="Mon/Wed 5-8 PM, Sat 10 AM-1 PM" />
        </label>
      </div>
    </>
  );
}

function Marketplace(props: {
  subject: string;
  setSubject: (value: string) => void;
  mode: string;
  setMode: (value: string) => void;
  filteredTutors: Tutor[];
  selectedTutor: Tutor;
  setSelectedTutor: (tutor: Tutor) => void;
  bookingSent: boolean;
  setBookingSent: (value: boolean) => void;
  submitBooking: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <>
      <section className="market-command">
        <div>
          <p className="eyebrow">Tutor discovery</p>
          <h3>Explore verified tutors ready for your next class.</h3>
        </div>
        <button className="ghost-action"><Filter size={18} /> Advanced filters</button>
      </section>

      <section className="marketplace-board">
        <aside className="filter-panel">
          <div>
            <p className="eyebrow">Search</p>
            <h3>Find the right fit</h3>
          </div>
          <label>
            Subject or keyword
            <div className="input-with-icon">
              <Search size={18} />
              <input value={props.subject} onChange={(event) => props.setSubject(event.target.value)} placeholder="Math, IELTS, Biology" />
            </div>
          </label>
          <label>
            Teaching mode
            <CustomSelect value={props.mode} options={["All", "Online", "Home tuition"]} onChange={props.setMode} />
          </label>
          <label>
            Maximum hourly rate
            <CustomSelect value="NPR 2,000" options={["NPR 1,000", "NPR 1,500", "NPR 2,000", "NPR 3,000+"]} />
          </label>
          <div className="quick-filters">
            <button>Verified only</button>
            <button>Available this week</button>
            <button>Exam prep</button>
            <button>Home tuition</button>
          </div>
        </aside>

        <section className="results-panel">
          <div className="results-head">
            <div>
              <p className="eyebrow">Best matches</p>
              <h3>{props.filteredTutors.length} tutors available</h3>
            </div>
            <span>Sorted by rating</span>
          </div>
          <div className="tutor-list">
            {props.filteredTutors.map((tutor) => (
              <button
                className={props.selectedTutor.id === tutor.id ? "tutor-card selected" : "tutor-card"}
                key={tutor.id}
                onClick={() => {
                  props.setSelectedTutor(tutor);
                  props.setBookingSent(false);
                }}
              >
                <span className="tutor-photo-wrap">
                  <img src={tutor.photo} alt="" />
                  <span><Video size={15} /> Intro ready</span>
                </span>
                <span className="card-header">
                  <span className={`avatar ${tutor.accent}`}>{initials(tutor.fullName)}</span>
                  <span className="tutor-title">
                    <strong>{tutor.fullName}</strong>
                    <small>{tutor.headline}</small>
                  </span>
                  {tutor.verificationStatus === "Verified" ? <BadgeCheck size={18} /> : <Clock3 size={18} />}
                </span>
                <span className="muted-line"><MapPin size={15} /> {tutor.city} · {tutor.teachingModes.join(", ")}</span>
                <span className="result-meta">
                  <b>{money.format(tutor.hourlyRate)}/hr</b>
                  <span><Star size={15} /> {tutor.rating || "New"} · {tutor.reviewCount} reviews</span>
                </span>
                <span className="market-stats">
                  <span>{tutor.activeStudents} active students</span>
                  <span>{tutor.lessons} lessons</span>
                  <span><Globe2 size={14} /> {tutor.languages.join(", ")}</span>
                </span>
                <span className="availability mini">
                  {tutor.availability.slice(0, 2).map((slot) => <span key={slot}>{slot}</span>)}
                </span>
                <span className="card-actions">
                  <b>{tutor.nextSlot}</b>
                  <em>View profile</em>
                </span>
              </button>
            ))}
          </div>
        </section>

        <article className="detail-panel marketplace-detail">
          <div className="profile-head">
            <div>
              <p className="eyebrow">{props.selectedTutor.verificationStatus} tutor</p>
              <h3>{props.selectedTutor.fullName}</h3>
            </div>
            <button className="icon-button" aria-label="Save tutor"><Heart size={18} /></button>
          </div>
          <div className="profile-hero-card">
            <img src={props.selectedTutor.photo} alt="" />
            <div>
              <span className="rating"><Star size={18} /> {props.selectedTutor.rating || "New"} ({props.selectedTutor.reviewCount})</span>
              <strong>{props.selectedTutor.headline}</strong>
            </div>
          </div>
          <div className="profile-metrics">
            <span><strong>{money.format(props.selectedTutor.hourlyRate)}</strong> hourly rate</span>
            <span><strong>{props.selectedTutor.reviewCount || "New"}</strong> reviews</span>
            <span><strong>{props.selectedTutor.city}</strong> service area</span>
          </div>
          <p>{props.selectedTutor.bio}</p>
          <div className="chips">
            {props.selectedTutor.subjects.map((item) => <span key={item}>{item}</span>)}
            {props.selectedTutor.teachingModes.map((item) => <span key={item}>{item}</span>)}
          </div>
          <div className="availability">
            {props.selectedTutor.availability.map((slot) => <span key={slot}>{slot}</span>)}
          </div>

          <form id="booking" className="booking-form" onSubmit={props.submitBooking}>
            <label>
              Session goal
              <textarea defaultValue="Improve exam confidence with a focused trial class." />
            </label>
            <div className="form-row">
              <label>
                Date
                <input type="date" defaultValue="2026-05-08" />
              </label>
              <label>
                Duration
                <select defaultValue="60">
                  <option value="45">45 min</option>
                  <option value="60">60 min</option>
                  <option value="90">90 min</option>
                </select>
              </label>
            </div>
            <button className="primary" type="submit">Request booking</button>
            {props.bookingSent && <p className="success">Booking request queued for tutor acceptance.</p>}
          </form>
        </article>
      </section>
    </>
  );
}

function StudentDashboard() {
  return (
    <section className="dashboard-grid">
      <InfoCard icon={<CalendarCheck />} title="My bookings" text="Accepted mathematics session, one IELTS request pending tutor response." />
      <InfoCard icon={<MessageSquare />} title="Messages" text="Latest thread asks the tutor to focus on quadratic equations." />
      <InfoCard icon={<CreditCard />} title="Payments" text="One payment recorded, one payment pending after tutor acceptance." />
      <article className="table-panel wide">
        <h3>Session timeline</h3>
        <p className="panel-note">Track the complete student path from request to session and payment.</p>
        <StatusCards
          rows={bookings.map((booking) => ({
            title: booking.subject,
            subtitle: `${booking.tutorName} with ${booking.learnerName}`,
            meta: booking.startTime,
            status: booking.status,
            detail: booking.paymentStatus
          }))}
        />
      </article>
    </section>
  );
}

function TutorDashboard() {
  const tutorBookings = bookings.filter((booking) => booking.tutorName === "Anita Sharma");
  const gross = tutorBookings.reduce((sum, booking) => sum + (booking.paymentStatus === "Recorded" ? booking.amount : 0), 0);
  const fee = Math.round(gross * 0.15);

  return (
    <section className="dashboard-grid">
      <InfoCard icon={<CheckCircle2 />} title="Verification" text="Profile verified and visible in tutor discovery." />
      <InfoCard icon={<CalendarCheck />} title="Requests" text="Accept, decline, or convert booking requests into scheduled sessions." />
      <InfoCard icon={<Banknote />} title="Earnings" text={`${money.format(gross - fee)} net after ${money.format(fee)} platform fee.`} />
      <article className="table-panel wide">
        <h3>Upcoming work</h3>
        <p className="panel-note">Tutor control center for session commitments and earning visibility.</p>
        <StatusCards
          rows={tutorBookings.map((booking) => ({
            title: booking.learnerName,
            subtitle: booking.learningGoal,
            meta: booking.startTime,
            status: booking.status,
            detail: money.format(booking.amount)
          }))}
        />
      </article>
    </section>
  );
}

function AdminDashboard() {
  return (
    <section className="dashboard-grid">
      <InfoCard icon={<ShieldCheck />} title="Tutor verification" text="1 tutor profile is pending document and profile review." />
      <InfoCard icon={<Clock3 />} title="Booking operations" text="1 requested booking needs tutor action; 1 accepted session is scheduled." />
      <InfoCard icon={<CreditCard />} title="Payment status" text="Recorded revenue is NPR 1,400 with one pending payment." />
      <article className="table-panel wide">
        <h3>Admin queue</h3>
        <p className="panel-note">Operational queue for verification, booking risk, and payment follow-up.</p>
        <StatusCards
          rows={[
            { title: "Mina Karki", subtitle: "Tutor verification", meta: "Science · Bhaktapur", status: "Pending", detail: "Review profile" },
            { title: "B-1025", subtitle: "Tutor action needed", meta: "IELTS Speaking", status: "Requested", detail: "Follow up" },
            { title: "B-1025 payment", subtitle: "Student payment confirmation", meta: "NPR 900", status: "Pending", detail: "Await confirmation" }
          ]}
        />
      </article>
    </section>
  );
}

function InfoCard({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <article className="info-card">
      <span>{icon}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function CustomSelect({
  value,
  options,
  onChange
}: {
  value: string;
  options: string[];
  onChange?: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  function choose(option: string) {
    onChange?.(option);
    setOpen(false);
  }

  return (
    <div className="custom-select">
      <button type="button" className={open ? "open" : ""} onClick={() => setOpen((current) => !current)}>
        <span>{value}</span>
        <ChevronDown size={18} />
      </button>
      {open && (
        <div className="select-menu">
          {options.map((option) => (
            <button
              type="button"
              key={option}
              className={option === value ? "selected" : ""}
              onClick={() => choose(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusCards({
  rows
}: {
  rows: Array<{ title: string; subtitle: string; meta: string; status: string; detail: string }>;
}) {
  return (
    <div className="status-cards">
      {rows.map((row) => (
        <div key={`${row.title}-${row.status}-${row.detail}`} className="status-card">
          <div>
            <strong>{row.title}</strong>
            <span>{row.subtitle}</span>
            <small>{row.meta}</small>
          </div>
          <aside>
            <b>{row.status}</b>
            <em>{row.detail}</em>
          </aside>
        </div>
      ))}
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);

