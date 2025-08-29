import React, { useMemo, useState,useEffect } from "react";
import { I18nProvider, useI18n } from "./i18n";
import AdminLoginModal from "./components/AdminLoginModal.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import { getAdminToken } from "./admin/auth";
import { Routes, Route, Navigate } from "react-router-dom";


/* ------------- small presentational helpers ------------- */
// src/App.jsx (or wherever Progress lives)
function AdminLoginPage({ onSuccess }) {
  return (
    <div style={{ padding: "40px 16px" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        {/* Reuse the modal internals as a page */}
        <AdminLoginModal open={true} onClose={()=>{}} onSuccess={onSuccess} />
      </div>
    </div>
  );
}
const Progress = ({ pct }) => (
  <div className="progress-wrap">
    <div className="progress">
      <span style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />
    </div>
  </div>
);

const Pill = ({ active, children, onClick }) => (
  <button className={`pill ${active ? "active": ""}`} type="button" onClick={onClick}>
    {children}
  </button>
);
const Chip = ({ active, children, onClick }) => (
  <button className={`chip ${active ? "active": ""}`} type="button" onClick={onClick}>
    {children}
  </button>
);
const ButtonRow = ({ onBack, onNext, canNext = true, nextText }) => (
  <div className="nav-row">
    <button type="button" className="btn btn-outline" onClick={onBack}>Back</button>
    <button type="button" className="btn btn-primary" onClick={onNext} disabled={!canNext}>
      {nextText || "Next"}
    </button>
  </div>
);

/* ------------- steps ------------- */
function Landing({ onStart }) {
  const { lang, setLang, t } = useI18n();
  return (
    <div className="card center">
      <div className="lead" style={{marginTop:0}}></div>
      <h1>{t.landing.title}</h1>
      <p className="lead">{t.landing.blurb}</p>

      <div className="lang-pill" style={{position:"static", display:"inline-flex", marginTop:6}}>
        <button className={lang==="EN"?"active":""} onClick={()=>setLang("EN")}>EN</button>
        <button className={lang==="AM"?"active":""} onClick={()=>setLang("AM")}>AM</button>
      </div>

      <div style={{marginTop:18}}>
        <button className="btn btn-primary" onClick={onStart}>{t.landing.start}</button>
      </div>
    </div>
  );
}

function Contact({ data, setData, onBack, onNext, pct }) {
  const { t } = useI18n();
  const valid = data.guardian && (data.email || data.phone) && data.preferred;
  return (
    <div className="card">
      <Progress pct={pct} />
      <div className="caption">{t.common.letsGo}</div>
      <h1>{t.contact.title}</h1>

      <div className="grid">
        <label>{t.contact.guardianName}
          <input className="input" value={data.guardian} onChange={e=>setData({...data, guardian:e.target.value})}/>
        </label>
        <label>{t.contact.email}
          <input className="input" value={data.email} onChange={e=>setData({...data, email:e.target.value})}/>
        </label>
        <label>{t.contact.phone}
          <input className="input" value={data.phone} onChange={e=>setData({...data, phone:e.target.value})}/>
        </label>

        <div>
          <div style={{fontWeight:700, marginBottom:6}}>{t.contact.preferred}</div>
          <div className="chips">
            <Chip active={data.preferred==="email"} onClick={()=>setData({...data, preferred:"email"})}>📧 {t.contact.preferredEmail}</Chip>
            <Chip active={data.preferred==="phone"} onClick={()=>setData({...data, preferred:"phone"})}>📞 {t.contact.preferredPhone}</Chip>
            <Chip active={data.preferred==="text"} onClick={()=>setData({...data, preferred:"text"})}>💬 {t.contact.preferredText}</Chip>
          </div>
        </div>
      </div>

      <ButtonRow onBack={onBack} onNext={onNext} canNext={valid} nextText={t.common.next}/>
    </div>
  );
}

function ChildrenCount({ count, setCount, onBack, onNext, pct }) {
  const { t } = useI18n();
  return (
    <div className="card">
      <Progress pct={pct} />
      <div className="caption">{t.common.greatStart}</div>
      <h1>{t.children.title}</h1>

      <div className="pills">
        {[1,2,3].map(n=>(
          <Pill key={n} active={count===n} onClick={()=>setCount(n)}>{n}</Pill>
        ))}
      </div>

      <ButtonRow onBack={onBack} onNext={onNext} canNext={!!count} nextText={t.common.next}/>
    </div>
  );
}

function ChildInfo({ index, total, child, setChild, onBack, onNext, pct }) {
  const { t } = useI18n();
  const valid = child.name && child.grade && child.subjects.length>0;

  const togSubject = (key) => {
    const s = new Set(child.subjects);
    s.has(key) ? s.delete(key) : s.add(key);
    setChild({...child, subjects:[...s]});
  };

  return (
    <div className="card">
      <Progress pct={pct} />
      <div className="caption">{t.common.greatStart}</div>
      <h1>{t.child.title.replace("{{n}}", String(index))}</h1>

      <div className="grid">
        <label>{t.child.name}
          <input className="input" value={child.name} onChange={e=>setChild({...child, name:e.target.value})}/>
        </label>

        <div>
          <div style={{fontWeight:700, marginBottom:6}}>{t.child.grade}</div>
          <div className="pills">
            <Pill active={child.grade==="Elementary"} onClick={()=>setChild({...child, grade:"Elementary"})}>🏫 {t.child.gElementary}</Pill>
            <Pill active={child.grade==="Middle"} onClick={()=>setChild({...child, grade:"Middle"})}>🏫 {t.child.gMiddle}</Pill>
            <Pill active={child.grade==="High"} onClick={()=>setChild({...child, grade:"High"})}>🎓 {t.child.gHigh}</Pill>
          </div>
        </div>

        <div>
          <div style={{fontWeight:700, marginBottom:6}}>{t.child.subjects}</div>
          <div className="chips">
            <Chip active={child.subjects.includes("Math")}          onClick={()=>togSubject("Math")}>📚 {t.child.sMath}</Chip>
            <Chip active={child.subjects.includes("Reading/Writing")} onClick={()=>togSubject("Reading/Writing")}>📖 {t.child.sReadWrite}</Chip>
            <Chip active={child.subjects.includes("Science")}       onClick={()=>togSubject("Science")}>🔬 {t.child.sScience}</Chip>
            <Chip active={child.subjects.includes("Other")}         onClick={()=>togSubject("Other")}>🎨 {t.child.sOther}</Chip>
          </div>
        </div>
      </div>

      <ButtonRow
        onBack={onBack}
        onNext={onNext}
        canNext={valid}
        nextText={index < total ? "Next" : "Next"}
      />
    </div>
  );
}

function Format({ value, setValue, onBack, onNext, pct }) {
  const { t } = useI18n();
  return (
    <div className="card">
      <Progress pct={pct} />
      <div className="caption">{t.common.greatStart}</div>
      <h1>{t.format.title}</h1>
      <div className="pills">
        <Pill active={value==="in-person"} onClick={()=>setValue("in-person")}>🏫 {t.format.inPerson}</Pill>
        <Pill active={value==="online"} onClick={()=>setValue("online")}>💻 {t.format.online}</Pill>
        <Pill active={value==="either"} onClick={()=>setValue("either")}>✨ {t.format.either}</Pill>
      </div>
      <ButtonRow onBack={onBack} onNext={onNext} canNext={!!value} nextText={t.common.next}/>
    </div>
  );
}

function Schedule({ value, setValue, onBack, onNext, pct }) {
  const { t } = useI18n();
  return (
    <div className="card">
      <Progress pct={pct} />
      <div className="caption">{t.common.keepItUp}</div>
      <h1>{t.schedule.title}</h1>
      <div className="pills">
        <Pill active={value==="weekday"} onClick={()=>setValue("weekday")}>📅 {t.schedule.weekday}</Pill>
        <Pill active={value==="weekend"} onClick={()=>setValue("weekend")}>🗓️ {t.schedule.weekend}</Pill>
      </div>
      <ButtonRow onBack={onBack} onNext={onNext} canNext={!!value} nextText={t.common.next}/>
    </div>
  );
}

function DaysPerWeek({ value, setValue, onBack, onNext, pct }) {
  const { t } = useI18n();
  return (
    <div className="card">
      <Progress pct={pct} />
      <div className="caption">{t.common.keepItUp}</div>
      <h1>{t.days.title}</h1>
      <div className="pills">
        {[1,2,3].map(n=>(
          <Pill key={n} active={value===n} onClick={()=>setValue(n)}>{n===3?"3+":n}</Pill>
        ))}
      </div>
      <ButtonRow onBack={onBack} onNext={onNext} canNext={!!value} nextText={t.common.next}/>
    </div>
  );
}

function HoursPerWeek({ value, setValue, onBack, onNext, pct }) {
  const { t } = useI18n();
  return (
    <div className="card">
      <Progress pct={pct} />
      <div className="caption">{t.common.almost}</div>
      <h1>{t.hours.title}</h1>
      <div className="pills">
        {[1,2,3].map(n=>(
          <Pill key={n} active={value===n} onClick={()=>setValue(n)}>{n===3?"3+":n}</Pill>
        ))}
      </div>
      <ButtonRow onBack={onBack} onNext={onNext} canNext={!!value} nextText={t.common.next}/>
    </div>
  );
}

function Goals({ values, setValues, onBack, onNext, pct }) {
  const { t } = useI18n();
  const tog = (k) => {
    const s = new Set(values);
    s.has(k) ? s.delete(k) : s.add(k);
    setValues([...s]);
  };
  return (
    <div className="card">
      <Progress pct={pct} />
      <div className="caption">{t.common.almost}</div>
      <h1>{t.goals.title}</h1>
      <div className="chips">
        <Chip active={values.includes("improve")}   onClick={()=>tog("improve")}>📈 {t.goals.improve}</Chip>
        <Chip active={values.includes("confidence")} onClick={()=>tog("confidence")}>💪 {t.goals.confidence}</Chip>
        <Chip active={values.includes("test")}       onClick={()=>tog("test")}>📝 {t.goals.test}</Chip>
      </div>
      <ButtonRow onBack={onBack} onNext={onNext} canNext={values.length>0} nextText={t.common.next}/>
    </div>
  );
}

function Review({ all, onBack, onSubmit, pct }) {
  const { t } = useI18n();
  return (
    <div className="card">
      <Progress pct={pct} />
      <div className="caption">{t.common.finished}</div>
      <h1>{t.review.title}</h1>

      <div className="summary" style={{marginTop:8}}>
        <div style={{marginBottom:10}}>{t.review.summaryLead}</div>
        <div>👤 <b>{all.contact.guardian || "-"}</b> — {all.contact.email || "—"} — {all.contact.phone || "—"}</div>
        <div style={{marginTop:8}}>📣 {all.contact.preferred}</div>
        <div style={{marginTop:8, lineHeight:1.7}}>
          {all.children.map((c, i)=>(
            <div key={i}>🧒 <b>{`Child ${i+1}`}</b>: {c.name || "—"} · {c.grade || "—"} · {c.subjects.join(", ") || "—"}</div>
          ))}
        </div>
        <div style={{marginTop:8}}>🏫 {all.format}</div>
        <div style={{marginTop:8}}>🗓️ {all.schedule} · {all.days} days/week · {all.hours} hrs/week</div>
        <div style={{marginTop:8}}>🎯 {all.goals.join(", ")}</div>
      </div>

      <div className="nav-row">
        <button type="button" className="btn btn-outline" onClick={onBack}>Back</button>
        <button type="button" className="btn btn-primary" onClick={onSubmit}>Submit</button>
      </div>
    </div>
  );
}

function Submitted() {
  const { t } = useI18n();
  return (
    <div className="card center">
      <h1>{t.submitted.title}</h1>
      <p className="lead">{t.submitted.desc}</p>
    </div>
  );
}

/* ------------- main flow orchestrator (no routes) ------------- */
function Flow() {
  const TOTAL_STEPS = 9; // contact, count, child(s), format, schedule, days, hours, goals, review
  const pctFor = (i) => Math.round((i / (TOTAL_STEPS - 1)) * 100);

  const [step, setStep] = useState(0); // 0 landing
  const [contact, setContact] = useState({ guardian:"", email:"", phone:"", preferred:"" });
  const [count, setCount] = useState(null);
  const [children, setChildren] = useState([]); // array of {name,grade,subjects[]}
  const [format, setFormat] = useState("");
  const [schedule, setSchedule] = useState("");
  const [days, setDays] = useState(null);
  const [hours, setHours] = useState(null);
  const [goals, setGoals] = useState([]);

  const startChildren = () => {
    const arr = Array.from({length: count||0}, (_,i)=> children[i] ?? ({ name:"", grade:"", subjects:[] }));
    setChildren(arr);
  };

  const all = useMemo(()=>({
    contact, count, children, format, schedule, days, hours, goals
  }), [contact, count, children, format, schedule, days, hours, goals]);

 async function submit() {
  const payload = {
    contact,
    count: count || 0,
    children: children.map(c => ({
      name: c.name,
      grade: c.grade, // "Elementary" | "Middle" | "High"
      subjects: c.subjects // ["Math","Reading/Writing","Science","Other"]
    })),
    format,             // "in-person" | "online" | "either"
    schedule,           // "weekday" | "weekend"
    days: days || 0,    // 1|2|3
    hours: hours || 0,  // 1|2|3
    goals               // ["improve","confidence","test"]
  };

  try {
    const res = await fetch("/api/surveys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(()=>({error:"Failed"}));
      throw new Error(err.error || "Failed");
    }
    // success → show Thank You
    setStep(999);
  } catch (e) {
    alert("Submit failed: " + e.message);
  }
}


  // Render by step
  if (step === 0) return <Landing onStart={()=>setStep(1)} />;
  if (step === 1) return (
    <Contact
      data={contact}
      setData={setContact}
      pct={pctFor(1)}
      onBack={()=>setStep(0)}
      onNext={()=>setStep(2)}
    />
  );
  if (step === 2) return (
    <ChildrenCount
      count={count}
      setCount={(n)=>{ setCount(n); }}
      pct={pctFor(2)}
      onBack={()=>setStep(1)}
      onNext={()=>{
        startChildren();
        setStep(3);
      }}
    />
  );
  // children pages (3..3+count-1)
  if (step >= 3 && step < 3 + (count||0)) {
    const idx = step - 2;               // 1-based for display
    const i = idx - 1;                  // 0-based
    const c = children[i];
    const setChild = (next) => setChildren(children.map((x,ii)=> ii===i?next:x));
    const next = () => setStep(step + 1);
    const back = () => setStep(step - 1);
    return (
      <ChildInfo
        index={idx}
        total={count}
        child={c}
        setChild={setChild}
        onBack={back}
        onNext={next}
        pct={pctFor(step)}
      />
    );
  }
  const afterChildren = 3 + (count||0);
  if (step === afterChildren) return (
    <Format value={format} setValue={setFormat} pct={pctFor(step)} onBack={()=>setStep(step-1)} onNext={()=>setStep(step+1)} />
  );
  if (step === afterChildren+1) return (
    <Schedule value={schedule} setValue={setSchedule} pct={pctFor(step)} onBack={()=>setStep(step-1)} onNext={()=>setStep(step+1)} />
  );
  if (step === afterChildren+2) return (
    <DaysPerWeek value={days} setValue={setDays} pct={pctFor(step)} onBack={()=>setStep(step-1)} onNext={()=>setStep(step+1)} />
  );
  if (step === afterChildren+3) return (
    <HoursPerWeek value={hours} setValue={setHours} pct={pctFor(step)} onBack={()=>setStep(step-1)} onNext={()=>setStep(step+1)} />
  );
  if (step === afterChildren+4) return (
    <Goals values={goals} setValues={setGoals} pct={pctFor(step)} onBack={()=>setStep(step-1)} onNext={()=>setStep(step+1)} />
  );
  if (step === afterChildren+5) return (
    <Review all={all} pct={pctFor(step)} onBack={()=>setStep(step-1)} onSubmit={submit} />
  );

  return <Submitted />;
}


  

/* ------------- App shell ------------- */
export default function App() {
    const [authed, setAuthed] = useState(!!getAdminToken());

  // if token changes in another tab, you could re-check on focus:
  useEffect(() => {
    const onFocus = () => setAuthed(!!getAdminToken());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);
  return (
    <I18nProvider>
      <Routes>
        {/* Public questionnaire (no URL changes within it) */}
        <Route path="/" element={<Flow />} />

        {/* Admin route: if authed show dashboard; else show Google login page */}
        <Route
          path="/admin"
          element={
            authed ? (
              <div style={{ padding: "40px 16px" }}>
                <div style={{ maxWidth: 1000, margin: "0 auto" }}>
                  <AdminDashboard />
                </div>
              </div>
            ) : (
              <AdminLoginPage onSuccess={() => setAuthed(true)} />
            )
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </I18nProvider>
  );
}
