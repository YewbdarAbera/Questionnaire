export default function ReviewStep({ parent, children, meta, onBack, onSubmit }) {
  return (
    <>
      <h1 className="wizard-title">Wrap‑up</h1>

      <div className="review-card">
        <p style={{ marginTop: 0, fontSize: 18 }}>
          Great job! Here's a quick overview of what you shared:
        </p>

        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li><b>Parent:</b> {parent.name} — {parent.email} — {parent.phone} ({parent.preferredComm})</li>
          {children.map((c, i) => (
            <li key={i}>👧 Child {i+1}: {c.name || "—"} — {c.grade || "—"} — {c.subjects?.join(", ") || "—"}</li>
          ))}
          <li><b>Format:</b> {meta.format || "—"}</li>
          <li><b>Schedule:</b> {meta.schedule || "—"}</li>
          <li><b>Days:</b> {meta.days || "—"}</li>
          <li><b>Hours:</b> {meta.hours || "—"}</li>
          <li><b>Goals:</b> {meta.goals?.join(", ") || "—"}</li>
        </ul>
      </div>

      <div className="btnbar">
        <button className="btn" onClick={onBack}>Back</button>
        <button className="btn primary" onClick={onSubmit}>Submit</button>
      </div>
    </>
  );
}
