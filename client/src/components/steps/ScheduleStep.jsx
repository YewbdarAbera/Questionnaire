const OPTIONS = ["Monday–Friday after school", "Saturday and Sunday"];

export default function ScheduleStep({ value, onBack, onValid }) {
  return (
    <>
      <h1 className="wizard-title">Preferred Schedule</h1>

      <div className="pills" style={{ marginTop: 12 }}>
        {OPTIONS.map(o => (
          <button
            key={o}
            type="button"
            className={`pill ${value===o?'active':''}`}
            onClick={()=> onValid(o)}
          >
            📅 {o}
          </button>
        ))}
      </div>

      <div className="btnbar">
        <button className="btn" onClick={onBack}>Back</button>
        <button className="btn primary" onClick={()=> onValid(value || OPTIONS[0])}>Next</button>
      </div>
    </>
  );
}
