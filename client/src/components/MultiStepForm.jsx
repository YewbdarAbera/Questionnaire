import { useMemo, useState } from "react";
import ParentInfoStep from "./steps/ParentInfoStep";
import HouseholdStep from "./steps/HouseholdStep";
import ChildStep from "./steps/ChildStep";
import FormatStep from "./steps/FormatStep";
import ScheduleStep from "./steps/ScheduleStep";
import DaysPerWeekStep from "./steps/DaysPerWeekStep";
import HoursPerWeekStep from "./steps/HoursPerWeekStep";
import GoalsStep from "./steps/GoalsStep";
import ReviewStep from "./steps/ReviewStep";
import { submitSurvey } from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function MultiStepForm() {
  const nav = useNavigate();

  // survey state
  const [step, setStep] = useState(0);
  const [parent, setParent] = useState({
    name: "", email: "", phone: "", preferredComm: "email",
  });
  const [childrenCount, setChildrenCount] = useState(0);
  const [children, setChildren] = useState([]); // [{ name, grade, subjects:[] }]
  const [meta, setMeta] = useState({
    format: "", schedule: "", days: "", hours: "", goals: []
  });

  // steps order to mirror your screenshots:
  // 0 parent, 1 household, 2..(1+N) each child, next: format, schedule, days, hours, goals, review
  const base = 2 + childrenCount;                // parent + household + N children
  const indexFormat   = base;
  const indexSchedule = base + 1;
  const indexDays     = base + 2;
  const indexHours    = base + 3;
  const indexGoals    = base + 4;
  const indexReview   = base + 5;
  const totalSteps = indexReview + 1;

  const progress = useMemo(() => {
    return Math.round(((step) / (totalSteps - 1)) * 100);
  }, [step, totalSteps]);

  function next() { setStep(s => Math.min(s + 1, totalSteps - 1)); }
  function back() { setStep(s => Math.max(s - 1, 0)); }

  function upsertChild(index, child) {
    setChildren(prev => {
      const copy = [...prev];
      copy[index] = child;
      return copy;
    });
  }

  async function onSubmitFinal() {
    try {
      await submitSurvey({ parent, children, meta });
      // reset and route to "submitted"
      setStep(0);
      setParent({ name:"", email:"", phone:"", preferredComm:"email" });
      setChildrenCount(0); setChildren([]); setMeta({ format:"", schedule:"", days:"", hours:"", goals:[] });
      nav("/submitted");
    } catch (e) {
      alert("Failed to submit: " + e.message);
    }
  }

  return (
    <div>
      {/* top header inside the glass card */}
      <div className="wizard-progress" aria-hidden="true">
        <span style={{ "--p": `${progress}%` }} />
      </div>

      <div className="wizard-header">
        {/* language pill is rendered in Home.jsx header; if you want one here too, add it */}
        <div />
        <div className="wizard-hint">
          {step < indexHours ? "Great start!" : step < indexReview ? "Almost done!" : "Finished!"}
        </div>
      </div>

      {/* PARENT */}
      {step === 0 && (
        <ParentInfoStep
          value={parent}
          onValid={(v) => { setParent(v); next(); }}
        />
      )}

      {/* HOUSEHOLD: how many children */}
      {step === 1 && (
        <HouseholdStep
          value={childrenCount}
          onBack={back}
          onValid={(count) => {
            setChildrenCount(count);
            if (count === 0) setChildren([]);
            next();
          }}
        />
      )}

      {/* CHILDREN STEPS */}
      {step >= 2 && step <= 1 + childrenCount && (
        <ChildStep
          index={step - 2}
          total={childrenCount}
          value={children[step - 2]}
          onBack={back}
          onValid={(child) => { upsertChild(step - 2, child); next(); }}
        />
      )}

      {/* FORMAT */}
      {step === indexFormat && (
        <FormatStep
          value={meta.format}
          onBack={back}
          onValid={(format) => { setMeta(m => ({ ...m, format })); next(); }}
        />
      )}

      {/* SCHEDULE */}
      {step === indexSchedule && (
        <ScheduleStep
          value={meta.schedule}
          onBack={back}
          onValid={(schedule) => { setMeta(m => ({ ...m, schedule })); next(); }}
        />
      )}

      {/* DAYS */}
      {step === indexDays && (
        <DaysPerWeekStep
          value={meta.days}
          onBack={back}
          onValid={(days) => { setMeta(m => ({ ...m, days })); next(); }}
        />
      )}

      {/* HOURS */}
      {step === indexHours && (
        <HoursPerWeekStep
          value={meta.hours}
          onBack={back}
          onValid={(hours) => { setMeta(m => ({ ...m, hours })); next(); }}
        />
      )}

      {/* GOALS */}
      {step === indexGoals && (
        <GoalsStep
          value={meta.goals}
          onBack={back}
          onValid={(goals) => { setMeta(m => ({ ...m, goals })); next(); }}
        />
      )}

      {/* REVIEW */}
      {step === indexReview && (
        <ReviewStep
          parent={parent}
          children={children}
          meta={meta}
          onBack={back}
          onSubmit={onSubmitFinal}
        />
      )}
    </div>
  );
}
