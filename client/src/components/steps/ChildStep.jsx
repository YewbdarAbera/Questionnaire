import { useMemo, useState } from "react";

const GRADES = ["Elementary", "Middle School", "High School"];
const SUBJECTS = ["Math", "Reading/Writing", "Science", "Other"];

export default function ChildStep({ index,  value, onBack, onValid }) {
  const [name, setName] = useState(value?.name || "");
  const [grade, setGrade] = useState(value?.grade || "");
  const [subjects, setSubjects] = useState(value?.subjects || []);
  const isValid = useMemo(() => name.trim().length>0 && !!grade, [name, grade]);

  function toggleSubject(s){
    setSubjects(prev => prev.includes(s) ? prev.filter(x=>x!==s) : [...prev, s]);
  }

  return (
    <>
      <h1 className="wizard-title">Child {index+1} Info</h1>

      <div className="field">
        <label>Child's name</label>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="First name" />
      </div>

      <div className="field">
        <label>Grade/Category</label>
        <div className="pills">
          {GRADES.map(g => (
            <button
              key={g}
              type="button"
              className={`pill ${grade===g?'active':''}`}
              onClick={()=> setGrade(g)}
            >
              {g === "Elementary" ? "📚" : g === "Middle School" ? "🏫" : "🎓"} {g}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label>Subjects</label>
        <div className="pills">
          {SUBJECTS.map(s => (
            <button
              key={s}
              type="button"
              className={`pill ${subjects.includes(s)?'active':''}`}
              onClick={()=> toggleSubject(s)}
            >
              {s === "Math" ? "📊" : s==="Reading/Writing" ? "📖" : s==="Science" ? "🔬" : "🎨"} {s}
            </button>
          ))}
        </div>
      </div>

      <div className="btnbar">
        <button className="btn" onClick={onBack}>Back</button>
        <button className="btn primary" onClick={()=> isValid && onValid({ name: name.trim(), grade, subjects })} disabled={!isValid}>Next</button>
      </div>
    </>
  );
}
