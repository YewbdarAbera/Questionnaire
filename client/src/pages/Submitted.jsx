import { Link } from "react-router-dom";

export default function Submitted() {
  return (
    <div className="hero">
      <div className="card step-card" style={{ position: "relative" }}>
        {/* small language pill only if your i18n context needs it; safe to remove */}
        <div className="lang-pill hidden" />

        <div className="progress" aria-hidden>
          <div className="bar" style={{ width: "100%" }} />
        </div>

        <h1>Thanks for submitting!</h1>
        <p className="helper" style={{ marginTop: 8 }}>
          We’ve received your responses. We’ll be in touch soon.
        </p>

        <div className="buttonbar" style={{ marginTop: 20 }}>
          <Link className="btn outline" to="/">Back to start</Link>
          <a className="btn primary" href="/" onClick={(e)=>{ e.preventDefault(); window.location.href = "/"; }}>
            Submit another response
          </a>
        </div>
      </div>
    </div>
  );
}
