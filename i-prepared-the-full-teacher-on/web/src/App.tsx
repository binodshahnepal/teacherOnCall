import { FormEvent, useMemo, useState } from "react";
import { BadgeCheck, CalendarCheck, CreditCard, MessageSquare, Search, ShieldCheck, Star, Users } from "lucide-react";
import { createRoot } from "react-dom/client";
import "./styles.css";

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
};

const tutors: Tutor[] = [
  {
    id: "06f450f6-5ca2-45f8-a41d-bc8a65ca18ab",
    fullName: "Anita Sharma",
    city: "Kathmandu",
    subjects: ["Mathematics", "Physics"],
    teachingModes: ["Online", "Home tuition"],
    hourlyRate: 1400,
    bio: "Exam-focused tutor for SEE and +2 students.",
    verificationStatus: "Verified",
    rating: 4.8,
    reviewCount: 36
  },
  {
    id: "d8597cc0-96c7-4987-aec7-323a7abff17c",
    fullName: "Rahul Adhikari",
    city: "Lalitpur",
    subjects: ["English", "IELTS"],
    teachingModes: ["Online"],
    hourlyRate: 1200,
    bio: "Language coach for school support and IELTS preparation.",
    verificationStatus: "Verified",
    rating: 4.7,
    reviewCount: 22
  },
  {
    id: "11fe376c-96a8-48d3-9da6-dc96b674a15a",
    fullName: "Mina Karki",
    city: "Bhaktapur",
    subjects: ["Chemistry", "Biology"],
    teachingModes: ["Online", "Home tuition"],
    hourlyRate: 1300,
    bio: "Science tutor with practical lesson planning.",
    verificationStatus: "Pending",
    rating: 0,
    reviewCount: 0
  }
];

function App() {
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

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Teacher on Call</p>
          <h1>Tutor marketplace MVP</h1>
        </div>
        <nav>
          <a className="active" href="#search"><Search size={18} /> Discovery</a>
          <a href="#booking"><CalendarCheck size={18} /> Booking</a>
          <a href="#messages"><MessageSquare size={18} /> Messages</a>
          <a href="#admin"><ShieldCheck size={18} /> Admin</a>
        </nav>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Marketplace operations</p>
            <h2>Find, book, track, and verify tutors</h2>
          </div>
          <div className="metrics">
            <span><Users size={18} /> 3 tutors</span>
            <span><CalendarCheck size={18} /> 1 request</span>
            <span><CreditCard size={18} /> NPR 0 recorded</span>
          </div>
        </header>

        <section id="search" className="search-row">
          <label>
            Subject
            <input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Math, IELTS, Biology" />
          </label>
          <label>
            Mode
            <select value={mode} onChange={(event) => setMode(event.target.value)}>
              <option>All</option>
              <option>Online</option>
              <option>Home tuition</option>
            </select>
          </label>
        </section>

        <section className="content-grid">
          <div className="tutor-list">
            {filteredTutors.map((tutor) => (
              <button
                className={selectedTutor.id === tutor.id ? "tutor-card selected" : "tutor-card"}
                key={tutor.id}
                onClick={() => {
                  setSelectedTutor(tutor);
                  setBookingSent(false);
                }}
              >
                <span className="card-header">
                  <strong>{tutor.fullName}</strong>
                  {tutor.verificationStatus === "Verified" ? <BadgeCheck size={18} /> : <ShieldCheck size={18} />}
                </span>
                <span>{tutor.city} · {tutor.teachingModes.join(", ")}</span>
                <span>{tutor.subjects.join(", ")}</span>
                <span className="price">NPR {tutor.hourlyRate}/hr</span>
              </button>
            ))}
          </div>

          <article className="detail-panel">
            <div className="profile-head">
              <div>
                <p className="eyebrow">{selectedTutor.verificationStatus} tutor</p>
                <h3>{selectedTutor.fullName}</h3>
              </div>
              <span className="rating"><Star size={18} /> {selectedTutor.rating || "New"} ({selectedTutor.reviewCount})</span>
            </div>
            <p>{selectedTutor.bio}</p>
            <div className="chips">
              {selectedTutor.subjects.map((item) => <span key={item}>{item}</span>)}
              {selectedTutor.teachingModes.map((item) => <span key={item}>{item}</span>)}
            </div>

            <form id="booking" className="booking-form" onSubmit={submitBooking}>
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
              {bookingSent && <p className="success">Booking request queued for tutor acceptance.</p>}
            </form>
          </article>
        </section>

        <section className="ops-grid">
          <article id="messages">
            <h3>Message thread</h3>
            <p className="message">Can we focus on quadratic equations in the first class?</p>
            <p className="message tutor">Yes, I’ll prepare a short diagnostic and practice set.</p>
          </article>
          <article id="admin">
            <h3>Admin dashboard</h3>
            <dl>
              <div><dt>Pending verification</dt><dd>1</dd></div>
              <div><dt>Booking requests</dt><dd>1</dd></div>
              <div><dt>Scheduled sessions</dt><dd>0</dd></div>
              <div><dt>Manual payments</dt><dd>NPR 0</dd></div>
            </dl>
          </article>
        </section>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
