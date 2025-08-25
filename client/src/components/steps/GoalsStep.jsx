const GOALS = ["Improve grades", "Build confidence", "Test preparation"];

export default function GoalsStep({ value = [], onBack, onValid }) {
  function toggle(goal){
    const has = value.includes(goal);
    const next = has ? value.filter(g=>g!==goal) : [...value, goal];
    onValid(next);
  }

  return (
    <>
      <h1 className="wizard-title">Tutoring Goals</h1>

      <div className="pills" style={{ marginTop: 12 }}>
        {GOALS.map(g => (
          <button
            key={g}
            type="button"
            className={`pill ${value.includes(g)?'active':''}`}
            onClick={()=> toggle(g)}
          >
            {g==="Improve grades" ? "📈" : g==="Build confidence" ? "💪" : "📝"} {g}
          </button>
        ))}
      </div>

      <div className="btnbar">
        <button className="btn" onClick={onBack}>Back</button>
        <button className="btn primary" onClick={()=> onValid(value)}>Next</button>
      </div>
    </>
  );
}
