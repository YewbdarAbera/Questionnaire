const OPTS = ["1","2","3+"];

export default function DaysPerWeekStep({ value, onBack, onValid }) {
  return (
    <>
      <h1 className="wizard-title">Days per Week</h1>

      <div className="pills" style={{ marginTop: 12, marginBottom: 18 }}>
        {OPTS.map(o => (
          <button
            key={o}
            type="button"
            className={`pill circle ${value===o?'active':''}`}
            onClick={()=> onValid(o)}
          >
            {o}
          </button>
        ))}
      </div>

      <div className="btnbar">
        <button className="btn" onClick={onBack}>Back</button>
        <button className="btn primary" onClick={()=> onValid(value || OPTS[0])}>Next</button>
      </div>
    </>
  );
}
