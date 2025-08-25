import { useEffect, useMemo, useState } from "react";

const COMM_OPTIONS = [
  { key: "email", label: "📧 Email" },
  { key: "phone", label: "📞 Phone" },
  { key: "text",  label: "💬 Text message" },
];

export default function ParentInfoStep({ value, onValid }) {
  const [name, setName] = useState(value?.name || "");
  const [email, setEmail] = useState(value?.email || "");
  const [phone, setPhone] = useState(value?.phone || "");
  const [comm, setComm] = useState(value?.preferredComm || "email");

  const validEmail = useMemo(() => /^\S+@\S+\.\S+$/.test(email.trim()), [email]);
  const validPhone = useMemo(() => phone.replace(/[^\d]/g, "").length >= 7, [phone]);
  const isValid = name.trim().length >= 2 && validEmail && validPhone;

  useEffect(() => {
    function onKey(e){ if(e.key === "Enter" && isValid) handleNext(); }
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, [isValid, name, email, phone, comm]);

  function handleNext(){
    if(!isValid) return;
    onValid({ name: name.trim(), email: email.trim(), phone: phone.trim(), preferredComm: comm });
  }

  return (
    <>
      <h1 className="wizard-title" style={{ marginTop: 8 }}>Contact Information</h1>

      <div className="field">
        <label>Parent/Guardian Name</label>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" />
        {name.trim().length < 2 && <div className="error">Please enter at least 2 characters.</div>}
      </div>

      <div className="field">
        <label>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="you@example.com" />
        {!validEmail && email.length>0 && <div className="error">Please enter a valid email.</div>}
      </div>

      <div className="field">
        <label>Phone</label>
        <input value={phone} onChange={e=>setPhone(e.target.value)} inputMode="tel" placeholder="(xxx) xxx‑xxxx" />
        {!validPhone && phone.length>0 && <div className="error">Please enter a valid phone number.</div>}
      </div>

      <div className="field">
        <label>Preferred communication</label>
        <div className="pills">
          {COMM_OPTIONS.map(o => (
            <button key={o.key} type="button" className={`pill ${comm===o.key?'active':''}`} onClick={()=>setComm(o.key)}>
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="btnbar">
        <span style={{flex:1}} />
        <button className="btn primary" onClick={handleNext} disabled={!isValid}>Next</button>
      </div>
    </>
  );
}
