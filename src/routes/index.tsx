import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import {
  palette,
  fonts,
  card,
  inputStyle,
  labelStyle,
  buttonStyle,
  sectionTitle,
} from "@/components/planner/styles";
import {
  usePlannerData,
  uid,
  type PlannerData,
} from "@/components/planner/usePlannerData";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Academic Compass — Student Planner" },
      {
        name: "description",
        content:
          "A beautiful all-in-one student planner: classes, schedule, assignments, grades, study, reading, notes and calendar.",
      },
    ],
  }),
  component: PlannerPage,
});

const TABS = [
  "Dashboard",
  "Monthly Overview",
  "Class Info",
  "Schedule",
  "Assignments",
  "Grades",
  "Study",
  "Reading",
  "Notes",
  "Calendar",
  "Planner",
] as const;
type Tab = (typeof TABS)[number];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const CLASS_COLORS = [palette.pink, palette.salmon, palette.lavender, palette.mint, palette.sky, palette.cream];

/* -------------------------- shared helpers -------------------------- */

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} style={{ ...inputStyle, ...(props.style || {}) }} />;
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={4}
      {...props}
      style={{
        ...inputStyle,
        resize: "vertical",
        minHeight: 90,
        fontFamily: fonts.body,
        ...(props.style || {}),
      }}
    />
  );
}

function Pill({ children, color }: { children: ReactNode; color: string }) {
  return (
    <span
      style={{
        background: color,
        color: palette.dark,
        padding: "3px 10px",
        borderRadius: 999,
        fontSize: "0.72rem",
        fontWeight: 700,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div
      style={{
        color: palette.ink,
        opacity: 0.6,
        fontStyle: "italic",
        padding: "12px 0",
      }}
    >
      {text}
    </div>
  );
}

/* -------------------------- main page -------------------------- */

function PlannerPage() {
  const { data, setData } = usePlannerData();
  const [tab, setTab] = useState<Tab>("Dashboard");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${palette.cream} 0%, #fff7ee 50%, ${palette.lavender}33 100%)`,
        fontFamily: fonts.body,
        color: palette.dark,
        padding: "32px 24px 64px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Header />
        <TabBar tab={tab} setTab={setTab} />
        <main style={{ marginTop: 24 }}>
          {tab === "Dashboard" && <Dashboard data={data} setTab={setTab} />}
          {tab === "Monthly Overview" && <MonthlyOverview data={data} setData={setData} />}
          {tab === "Class Info" && <ClassInfoTab data={data} setData={setData} />}
          {tab === "Schedule" && <ScheduleTab data={data} setData={setData} />}
          {tab === "Assignments" && <AssignmentsTab data={data} setData={setData} />}
          {tab === "Grades" && <GradesTab data={data} setData={setData} />}
          {tab === "Study" && <StudyTab data={data} setData={setData} />}
          {tab === "Reading" && <ReadingTab data={data} setData={setData} />}
          {tab === "Notes" && <NotesTab data={data} setData={setData} />}
          {tab === "Calendar" && <CalendarTab data={data} />}
          {tab === "Planner" && <PlannerTab data={data} setData={setData} />}
        </main>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header style={{ textAlign: "center", marginBottom: 28 }}>
      <div
        style={{
          fontFamily: fonts.script,
          fontSize: "1.4rem",
          color: palette.salmon,
        }}
      >
        my little
      </div>
      <h1
        style={{
          fontFamily: fonts.display,
          fontSize: "3rem",
          margin: "4px 0 8px",
          color: palette.dark,
          letterSpacing: "0.02em",
        }}
      >
        Academic Compass
      </h1>
      <div
        style={{
          fontSize: "0.85rem",
          color: palette.ink,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}
      >
        plan · study · thrive
      </div>
    </header>
  );
}

function TabBar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  return (
    <nav
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        justifyContent: "center",
        padding: 10,
        background: palette.paper,
        border: `1px solid ${palette.line}`,
        borderRadius: 999,
        boxShadow: "0 4px 14px rgba(93,74,90,0.05)",
      }}
    >
      {TABS.map((t) => {
        const active = t === tab;
        return (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              border: "none",
              cursor: "pointer",
              padding: "8px 16px",
              borderRadius: 999,
              fontFamily: fonts.body,
              fontSize: "0.85rem",
              fontWeight: 600,
              background: active ? palette.pink : "transparent",
              color: active ? palette.dark : palette.ink,
              transition: "background 0.2s",
            }}
          >
            {t}
          </button>
        );
      })}
    </nav>
  );
}

/* -------------------------- Dashboard -------------------------- */

function Dashboard({
  data,
  setTab,
}: {
  data: PlannerData;
  setTab: (t: Tab) => void;
}) {
  const today = new Date();
  const todayKey = DAYS[(today.getDay() + 6) % 7];
  const todaySchedule = data.schedule.filter((s) => s.day === todayKey);

  const upcoming = [...data.assignments]
    .filter((a) => a.status !== "done")
    .sort((a, b) => (a.due || "").localeCompare(b.due || ""))
    .slice(0, 5);

  const totalStudyMin = data.study.reduce((acc, s) => acc + (s.minutes || 0), 0);
  const booksDone = data.reading.filter((b) => b.done).length;

  const stats = [
    { label: "Classes", value: data.classes.length, color: palette.pink },
    { label: "Assignments", value: data.assignments.length, color: palette.salmon },
    { label: "Study min", value: totalStudyMin, color: palette.lavender },
    { label: "Books read", value: booksDone, color: palette.mint },
  ];

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 14,
        }}
      >
        {stats.map((s) => (
          <div key={s.label} style={{ ...card, background: s.color, textAlign: "center" }}>
            <div style={{ fontFamily: fonts.display, fontSize: "2.4rem", fontWeight: 700 }}>
              {s.value}
            </div>
            <div style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={card}>
          <h2 style={sectionTitle}>Today · {todayKey}</h2>
          {todaySchedule.length === 0 ? (
            <EmptyHint text="No classes scheduled for today." />
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {todaySchedule.map((s) => (
                <li
                  key={s.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: `1px dashed ${palette.line}`,
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{s.subject}</span>
                  <span style={{ color: palette.ink }}>{s.time}</span>
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={() => setTab("Schedule")}
            style={{ ...buttonStyle(palette.cream), marginTop: 12 }}
          >
            Edit schedule
          </button>
        </div>

        <div style={card}>
          <h2 style={sectionTitle}>Upcoming</h2>
          {upcoming.length === 0 ? (
            <EmptyHint text="Nothing due. Enjoy the calm." />
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {upcoming.map((a) => (
                <li
                  key={a.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: `1px dashed ${palette.line}`,
                  }}
                >
                  <span>
                    <strong>{a.name}</strong>
                    <span style={{ color: palette.ink, marginLeft: 8, fontSize: "0.85rem" }}>
                      {a.subject}
                    </span>
                  </span>
                  <span style={{ color: palette.salmon, fontWeight: 600 }}>{a.due}</span>
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={() => setTab("Assignments")}
            style={{ ...buttonStyle(palette.pink), marginTop: 12 }}
          >
            Manage assignments
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------- Monthly Overview -------------------------- */

function MonthlyOverview({
  data,
  setData,
}: {
  data: PlannerData;
  setData: React.Dispatch<React.SetStateAction<PlannerData>>;
}) {
  return (
    <div style={card}>
      <h2 style={sectionTitle}>Monthly Overview</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: 14,
        }}
      >
        {MONTHS.map((m, i) => (
          <div
            key={m}
            style={{
              background: i % 2 ? palette.cream : "#fffaf0",
              border: `1px solid ${palette.line}`,
              borderRadius: 14,
              padding: 14,
            }}
          >
            <div
              style={{
                fontFamily: fonts.display,
                fontSize: "1.1rem",
                fontWeight: 700,
                marginBottom: 8,
                color: palette.dark,
              }}
            >
              {m}
            </div>
            <TextArea
              rows={3}
              value={data.semesterOverview[m] || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  semesterOverview: { ...data.semesterOverview, [m]: e.target.value },
                })
              }
              placeholder="Goals, exams, milestones…"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------- Class Info -------------------------- */

function ClassInfoTab({
  data,
  setData,
}: {
  data: PlannerData;
  setData: React.Dispatch<React.SetStateAction<PlannerData>>;
}) {
  const [form, setForm] = useState({ name: "", teacher: "", room: "" });

  const add = () => {
    if (!form.name.trim()) return;
    setData({
      ...data,
      classes: [
        ...data.classes,
        {
          id: uid(),
          ...form,
          color: CLASS_COLORS[data.classes.length % CLASS_COLORS.length],
        },
      ],
    });
    setForm({ name: "", teacher: "", room: "" });
  };

  const remove = (id: string) =>
    setData({ ...data, classes: data.classes.filter((c) => c.id !== id) });

  return (
    <div style={{ display: "grid", gap: 20, gridTemplateColumns: "1fr 2fr" }}>
      <div style={card}>
        <h2 style={sectionTitle}>Add a class</h2>
        <Field label="Subject"><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
        <Field label="Teacher"><TextInput value={form.teacher} onChange={(e) => setForm({ ...form, teacher: e.target.value })} /></Field>
        <Field label="Room"><TextInput value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} /></Field>
        <button style={buttonStyle()} onClick={add}>Add class</button>
      </div>

      <div style={card}>
        <h2 style={sectionTitle}>Your classes</h2>
        {data.classes.length === 0 && <EmptyHint text="No classes yet." />}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: 12 }}>
          {data.classes.map((c) => (
            <div key={c.id} style={{ background: c.color, borderRadius: 14, padding: 14 }}>
              <div style={{ fontFamily: fonts.display, fontSize: "1.15rem", fontWeight: 700 }}>{c.name}</div>
              <div style={{ fontSize: "0.85rem", color: palette.ink }}>{c.teacher || "—"}</div>
              <div style={{ fontSize: "0.85rem", color: palette.ink }}>Room {c.room || "—"}</div>
              <button onClick={() => remove(c.id)} style={{ ...buttonStyle("#fff"), marginTop: 10, padding: "4px 12px", fontSize: "0.75rem" }}>
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------- Schedule -------------------------- */

function ScheduleTab({
  data,
  setData,
}: {
  data: PlannerData;
  setData: React.Dispatch<React.SetStateAction<PlannerData>>;
}) {
  const [form, setForm] = useState({ day: "Mon", time: "", subject: "" });

  const add = () => {
    if (!form.subject.trim() || !form.time.trim()) return;
    setData({ ...data, schedule: [...data.schedule, { id: uid(), ...form }] });
    setForm({ day: "Mon", time: "", subject: "" });
  };
  const remove = (id: string) =>
    setData({ ...data, schedule: data.schedule.filter((s) => s.id !== id) });

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={card}>
        <h2 style={sectionTitle}>Add slot</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr auto", gap: 12, alignItems: "end" }}>
          <Field label="Day">
            <select
              value={form.day}
              onChange={(e) => setForm({ ...form, day: e.target.value })}
              style={inputStyle as CSSProperties}
            >
              {DAYS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </Field>
          <Field label="Time"><TextInput placeholder="9:00–10:00" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} /></Field>
          <Field label="Subject"><TextInput value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></Field>
          <button style={buttonStyle()} onClick={add}>Add</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: `repeat(${DAYS.length}, 1fr)`, gap: 12 }}>
        {DAYS.map((d) => {
          const slots = data.schedule.filter((s) => s.day === d);
          return (
            <div key={d} style={{ ...card, padding: 12 }}>
              <div style={{ fontFamily: fonts.display, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>{d}</div>
              {slots.length === 0 && <div style={{ fontSize: "0.75rem", color: palette.ink, opacity: 0.5, textAlign: "center" }}>—</div>}
              {slots.map((s) => (
                <div key={s.id} style={{ background: palette.cream, borderRadius: 10, padding: 8, marginBottom: 6, fontSize: "0.8rem" }}>
                  <div style={{ fontWeight: 700 }}>{s.subject}</div>
                  <div style={{ color: palette.ink }}>{s.time}</div>
                  <button onClick={() => remove(s.id)} style={{ background: "none", border: "none", color: palette.salmon, fontSize: "0.7rem", cursor: "pointer", padding: 0, marginTop: 2 }}>
                    remove
                  </button>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------- Assignments -------------------------- */

function AssignmentsTab({
  data,
  setData,
}: {
  data: PlannerData;
  setData: React.Dispatch<React.SetStateAction<PlannerData>>;
}) {
  const [form, setForm] = useState({ name: "", subject: "", due: "" });

  const add = () => {
    if (!form.name.trim()) return;
    setData({ ...data, assignments: [...data.assignments, { id: uid(), ...form, status: "todo" }] });
    setForm({ name: "", subject: "", due: "" });
  };
  const cycle = (id: string) =>
    setData({
      ...data,
      assignments: data.assignments.map((a) =>
        a.id === id
          ? { ...a, status: a.status === "todo" ? "doing" : a.status === "doing" ? "done" : "todo" }
          : a,
      ),
    });
  const remove = (id: string) =>
    setData({ ...data, assignments: data.assignments.filter((a) => a.id !== id) });

  const statusColor = (s: string) =>
    s === "done" ? palette.mint : s === "doing" ? palette.sky : palette.pink;

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={card}>
        <h2 style={sectionTitle}>Add assignment</h2>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: 12, alignItems: "end" }}>
          <Field label="Name"><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Subject"><TextInput value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></Field>
          <Field label="Due"><TextInput type="date" value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} /></Field>
          <button style={buttonStyle()} onClick={add}>Add</button>
        </div>
      </div>

      <div style={card}>
        <h2 style={sectionTitle}>Your assignments</h2>
        {data.assignments.length === 0 && <EmptyHint text="Nothing here yet." />}
        {data.assignments.map((a) => (
          <div key={a.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: `1px dashed ${palette.line}` }}>
            <div>
              <div style={{ fontWeight: 700, textDecoration: a.status === "done" ? "line-through" : "none" }}>{a.name}</div>
              <div style={{ fontSize: "0.8rem", color: palette.ink }}>{a.subject} {a.due && `· due ${a.due}`}</div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button onClick={() => cycle(a.id)} style={{ border: "none", cursor: "pointer", background: "transparent", padding: 0 }}>
                <Pill color={statusColor(a.status)}>{a.status}</Pill>
              </button>
              <button onClick={() => remove(a.id)} style={{ background: "none", border: "none", color: palette.salmon, cursor: "pointer", fontSize: "0.8rem" }}>
                remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------- Grades -------------------------- */

function GradesTab({
  data,
  setData,
}: {
  data: PlannerData;
  setData: React.Dispatch<React.SetStateAction<PlannerData>>;
}) {
  const [form, setForm] = useState({ subject: "", title: "", score: "", weight: "" });

  const add = () => {
    if (!form.title.trim()) return;
    setData({ ...data, grades: [...data.grades, { id: uid(), ...form }] });
    setForm({ subject: "", title: "", score: "", weight: "" });
  };
  const remove = (id: string) =>
    setData({ ...data, grades: data.grades.filter((g) => g.id !== id) });

  const bySubject = useMemo(() => {
    const map: Record<string, typeof data.grades> = {};
    data.grades.forEach((g) => {
      const k = g.subject || "Other";
      (map[k] ||= []).push(g);
    });
    return map;
  }, [data.grades]);

  const avg = (gs: typeof data.grades) => {
    let n = 0, d = 0;
    gs.forEach((g) => {
      const s = parseFloat(g.score);
      const w = parseFloat(g.weight) || 1;
      if (!isNaN(s)) { n += s * w; d += w; }
    });
    return d ? (n / d).toFixed(1) : "—";
  };

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={card}>
        <h2 style={sectionTitle}>Add grade</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr 1fr auto", gap: 12, alignItems: "end" }}>
          <Field label="Subject"><TextInput value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></Field>
          <Field label="Title"><TextInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
          <Field label="Score"><TextInput value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} /></Field>
          <Field label="Weight"><TextInput value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} /></Field>
          <button style={buttonStyle()} onClick={add}>Add</button>
        </div>
      </div>

      {Object.keys(bySubject).length === 0 && <div style={card}><EmptyHint text="No grades yet." /></div>}

      {Object.entries(bySubject).map(([sub, gs]) => (
        <div key={sub} style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
            <h3 style={{ ...sectionTitle, marginBottom: 0 }}>{sub}</h3>
            <div style={{ fontFamily: fonts.display, fontSize: "1.5rem", color: palette.salmon }}>{avg(gs)}</div>
          </div>
          {gs.map((g) => (
            <div key={g.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px dashed ${palette.line}` }}>
              <span>{g.title}</span>
              <span style={{ display: "flex", gap: 12 }}>
                <span style={{ color: palette.ink, fontSize: "0.85rem" }}>w {g.weight || 1}</span>
                <strong>{g.score || "—"}</strong>
                <button onClick={() => remove(g.id)} style={{ background: "none", border: "none", color: palette.salmon, cursor: "pointer" }}>×</button>
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* -------------------------- Study -------------------------- */

function StudyTab({
  data,
  setData,
}: {
  data: PlannerData;
  setData: React.Dispatch<React.SetStateAction<PlannerData>>;
}) {
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    subject: "",
    minutes: "",
    topic: "",
  });

  const add = () => {
    if (!form.subject.trim()) return;
    setData({
      ...data,
      study: [...data.study, { id: uid(), ...form, minutes: parseInt(form.minutes) || 0 }],
    });
    setForm({ ...form, subject: "", minutes: "", topic: "" });
  };
  const remove = (id: string) =>
    setData({ ...data, study: data.study.filter((s) => s.id !== id) });

  const total = data.study.reduce((a, s) => a + s.minutes, 0);

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={card}>
        <h2 style={sectionTitle}>Log a session ({total} min total)</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 2fr auto", gap: 12, alignItems: "end" }}>
          <Field label="Date"><TextInput type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field>
          <Field label="Subject"><TextInput value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></Field>
          <Field label="Minutes"><TextInput type="number" value={form.minutes} onChange={(e) => setForm({ ...form, minutes: e.target.value })} /></Field>
          <Field label="Topic"><TextInput value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} /></Field>
          <button style={buttonStyle()} onClick={add}>Log</button>
        </div>
      </div>

      <div style={card}>
        <h2 style={sectionTitle}>Recent sessions</h2>
        {data.study.length === 0 && <EmptyHint text="No study sessions yet." />}
        {[...data.study].reverse().map((s) => (
          <div key={s.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px dashed ${palette.line}` }}>
            <span>
              <strong>{s.subject}</strong>
              <span style={{ color: palette.ink, marginLeft: 8 }}>{s.topic}</span>
            </span>
            <span style={{ display: "flex", gap: 12 }}>
              <span style={{ color: palette.ink, fontSize: "0.85rem" }}>{s.date}</span>
              <strong>{s.minutes}m</strong>
              <button onClick={() => remove(s.id)} style={{ background: "none", border: "none", color: palette.salmon, cursor: "pointer" }}>×</button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------- Reading -------------------------- */

function ReadingTab({
  data,
  setData,
}: {
  data: PlannerData;
  setData: React.Dispatch<React.SetStateAction<PlannerData>>;
}) {
  const [form, setForm] = useState({ title: "", author: "", pages: "" });

  const add = () => {
    if (!form.title.trim()) return;
    setData({
      ...data,
      reading: [...data.reading, { id: uid(), ...form, pages: parseInt(form.pages) || 0, done: false }],
    });
    setForm({ title: "", author: "", pages: "" });
  };
  const toggle = (id: string) =>
    setData({ ...data, reading: data.reading.map((b) => (b.id === id ? { ...b, done: !b.done } : b)) });
  const remove = (id: string) =>
    setData({ ...data, reading: data.reading.filter((b) => b.id !== id) });

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={card}>
        <h2 style={sectionTitle}>Add book</h2>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: 12, alignItems: "end" }}>
          <Field label="Title"><TextInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
          <Field label="Author"><TextInput value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /></Field>
          <Field label="Pages"><TextInput type="number" value={form.pages} onChange={(e) => setForm({ ...form, pages: e.target.value })} /></Field>
          <button style={buttonStyle()} onClick={add}>Add</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: 14 }}>
        {data.reading.map((b) => (
          <div key={b.id} style={{ ...card, background: b.done ? palette.mint : palette.cream }}>
            <div style={{ fontFamily: fonts.display, fontSize: "1.05rem", fontWeight: 700 }}>{b.title}</div>
            <div style={{ fontSize: "0.85rem", color: palette.ink }}>{b.author}</div>
            <div style={{ fontSize: "0.75rem", color: palette.ink, marginTop: 4 }}>{b.pages} pages</div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button onClick={() => toggle(b.id)} style={{ ...buttonStyle("#fff"), padding: "4px 12px", fontSize: "0.75rem" }}>
                {b.done ? "Mark unread" : "Mark read"}
              </button>
              <button onClick={() => remove(b.id)} style={{ background: "none", border: "none", color: palette.salmon, cursor: "pointer" }}>×</button>
            </div>
          </div>
        ))}
        {data.reading.length === 0 && <div style={card}><EmptyHint text="Your reading list is empty." /></div>}
      </div>
    </div>
  );
}

/* -------------------------- Notes -------------------------- */

function NotesTab({
  data,
  setData,
}: {
  data: PlannerData;
  setData: React.Dispatch<React.SetStateAction<PlannerData>>;
}) {
  const [form, setForm] = useState({ title: "", subject: "", body: "" });

  const add = () => {
    if (!form.title.trim()) return;
    setData({
      ...data,
      notes: [
        { id: uid(), ...form, updated: new Date().toLocaleDateString() },
        ...data.notes,
      ],
    });
    setForm({ title: "", subject: "", body: "" });
  };
  const remove = (id: string) =>
    setData({ ...data, notes: data.notes.filter((n) => n.id !== id) });

  return (
    <div style={{ display: "grid", gap: 20, gridTemplateColumns: "1fr 2fr" }}>
      <div style={card}>
        <h2 style={sectionTitle}>New note</h2>
        <Field label="Title"><TextInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
        <Field label="Subject"><TextInput value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></Field>
        <Field label="Body"><TextArea rows={6} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></Field>
        <button style={buttonStyle()} onClick={add}>Save</button>
      </div>

      <div style={{ display: "grid", gap: 14 }}>
        {data.notes.length === 0 && <div style={card}><EmptyHint text="No notes yet." /></div>}
        {data.notes.map((n) => (
          <div key={n.id} style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <h3 style={{ fontFamily: fonts.display, fontSize: "1.15rem", margin: 0 }}>{n.title}</h3>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Pill color={palette.lavender}>{n.subject || "general"}</Pill>
                <span style={{ fontSize: "0.75rem", color: palette.ink }}>{n.updated}</span>
                <button onClick={() => remove(n.id)} style={{ background: "none", border: "none", color: palette.salmon, cursor: "pointer" }}>×</button>
              </div>
            </div>
            <div style={{ whiteSpace: "pre-wrap", marginTop: 8, color: palette.ink, lineHeight: 1.55 }}>{n.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------- Calendar -------------------------- */

function CalendarTab({ data }: { data: PlannerData }) {
  const today = new Date();
  const [cursor, setCursor] = useState({ y: today.getFullYear(), m: today.getMonth() });

  const first = new Date(cursor.y, cursor.m, 1);
  const daysInMonth = new Date(cursor.y, cursor.m + 1, 0).getDate();
  const startWeekday = (first.getDay() + 6) % 7; // Mon=0

  const deadlines: Record<number, string[]> = {};
  data.assignments.forEach((a) => {
    if (!a.due) return;
    const d = new Date(a.due);
    if (d.getMonth() === cursor.m && d.getFullYear() === cursor.y) {
      (deadlines[d.getDate()] ||= []).push(a.name);
    }
  });

  const cells: ReactNode[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(<div key={`b${i}`} />);
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday =
      d === today.getDate() && cursor.m === today.getMonth() && cursor.y === today.getFullYear();
    const events = deadlines[d] || [];
    cells.push(
      <div
        key={d}
        style={{
          minHeight: 80,
          padding: 8,
          background: isToday ? palette.pink : "#fffaf0",
          border: `1px solid ${palette.line}`,
          borderRadius: 10,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>{d}</div>
        {events.map((e, i) => (
          <div key={i} style={{ fontSize: "0.7rem", color: palette.dark, background: palette.cream, borderRadius: 6, padding: "2px 6px", marginTop: 4 }}>
            {e}
          </div>
        ))}
      </div>,
    );
  }

  const go = (delta: number) => {
    let m = cursor.m + delta;
    let y = cursor.y;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setCursor({ y, m });
  };

  return (
    <div style={card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <button style={buttonStyle(palette.cream)} onClick={() => go(-1)}>‹</button>
        <h2 style={{ ...sectionTitle, marginBottom: 0, borderBottom: "none" }}>
          {MONTHS[cursor.m]} {cursor.y}
        </h2>
        <button style={buttonStyle(palette.cream)} onClick={() => go(1)}>›</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginBottom: 6 }}>
        {DAYS.map((d) => (
          <div key={d} style={{ textAlign: "center", fontSize: "0.75rem", color: palette.ink, fontWeight: 700, textTransform: "uppercase" }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>{cells}</div>
    </div>
  );
}

/* -------------------------- Planner -------------------------- */

function PlannerTab({
  data,
  setData,
}: {
  data: PlannerData;
  setData: React.Dispatch<React.SetStateAction<PlannerData>>;
}) {
  const today = new Date();
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date(today);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const key = (d: Date) => d.toISOString().slice(0, 10);
  const shift = (delta: number) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + delta * 7);
    setWeekStart(d);
  };

  return (
    <div style={card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <button style={buttonStyle(palette.cream)} onClick={() => shift(-1)}>‹ Prev week</button>
        <h2 style={{ ...sectionTitle, marginBottom: 0, borderBottom: "none" }}>Weekly Planner</h2>
        <button style={buttonStyle(palette.cream)} onClick={() => shift(1)}>Next week ›</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 10 }}>
        {days.map((d, i) => {
          const k = key(d);
          return (
            <div key={k} style={{ background: i % 2 ? palette.cream : "#fffaf0", borderRadius: 12, padding: 10 }}>
              <div style={{ fontFamily: fonts.display, fontWeight: 700, marginBottom: 6 }}>
                {DAYS[i]} <span style={{ fontSize: "0.8rem", color: palette.ink, fontWeight: 400 }}>{d.getDate()}/{d.getMonth() + 1}</span>
              </div>
              <TextArea
                rows={6}
                value={data.planner[k] || ""}
                onChange={(e) => setData({ ...data, planner: { ...data.planner, [k]: e.target.value } })}
                placeholder="Tasks, goals, reminders…"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
