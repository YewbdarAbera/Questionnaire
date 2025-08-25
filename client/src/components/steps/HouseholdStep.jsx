export default function HouseholdStep({ value, onBack, onValid }) {
  const options = [1,2,3];

  return (
    <>
      <h1 className="wizard-title">How many children are we tutoring?</h1>

      <div className="pills" style={{ marginTop: 12, marginBottom: 18 }}>
        {options.map(n => (
          <button
            key={n}
            className={`pill circle ${value===n ? 'active' : ''}`}
            onClick={() => onValid(n)}
            type="button"
            aria-label={`${n} child${n>1?'ren':''}`}
          >
            {n}
          </button>
        ))}
      </div>

      <div className="btnbar">
        <button className="btn" onClick={onBack}>Back</button>
        <button className="btn primary" onClick={()=> onValid(value || 1)}>Next</button>
      </div>
    </>
  );
}
