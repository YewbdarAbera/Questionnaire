import { useState } from "react";
import { useI18n } from "../i18n";
import MultiStepForm from "../components/MultiStepForm";

export default function Home() {
  const { t, lang, setLang } = useI18n();
  const [started, setStarted] = useState(false);

  return (
    <div className="wizard">
      <div className="wizard-card">
        {/* top strip (progress placeholder so the header spacing matches later steps) */}
        <div className="wizard-progress" aria-hidden="true">
          <span style={{ "--p": started ? "0%" : "0%" }} />
        </div>

        <div className="wizard-header">
          <div className="lang-pill">
            <button
              className={lang === "EN" ? "active" : ""}
              onClick={() => setLang("EN")}
              type="button"
            >
              EN
            </button>
            <button
              className={lang === "AM" ? "active" : ""}
              onClick={() => setLang("AM")}
              type="button"
            >
              AM
            </button>
          </div>
          <div className="wizard-hint">
            {!started ? "Welcome!" : "Let's get started!"}
          </div>
        </div>

        {!started ? (
          <>
            <h1 className="wizard-title" style={{ textAlign: "center" }}>
              Tutoring Services Questionnaire
            </h1>

            <p className="hero-copy">
              We are a group of Ethiopians with tertiary‑level teaching
              experience, preparing to offer affordable, high‑quality tutoring
              services aligned with the Texas state standardized curriculum.
              Please take a few minutes to complete this brief needs‑assessment
              survey.
            </p>

            <div className="hero-actions">
              <div className="lang-pill hide-mobile">
                <button
                  className={lang === "EN" ? "active" : ""}
                  onClick={() => setLang("EN")}
                  type="button"
                >
                  EN
                </button>
                <button
                  className={lang === "AM" ? "active" : ""}
                  onClick={() => setLang("AM")}
                  type="button"
                >
                  AM
                </button>
              </div>

              <button className="btn primary hero-start" onClick={() => setStarted(true)}>
                Start
              </button>
            </div>
          </>
        ) : (
          <>
            {/* when started, we render your multi‑step form exactly inside this card */}
            <h1 className="wizard-title">{t.homeTitle}</h1>
            <MultiStepForm />
          </>
        )}
      </div>
    </div>
  );
}
