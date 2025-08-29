import { useEffect, useRef, useState } from "react";
import { setAdminToken } from "../admin/auth";

export default function AdminLoginModal({ open, onClose, onSuccess }){
  const divRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if(!open) return;
    setError("");
    // Render Google button
    const id = window.google?.accounts?.id;
    if(!id) return;

    id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (resp) => {
        try{
          const r = await fetch("/api/admin/google-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken: resp.credential })
          });
          if(!r.ok){
            const j = await r.json().catch(()=>({error:"Login failed"}));
            throw new Error(j.error || "Login failed");
          }
          const { token } = await r.json();
          setAdminToken(token);
          onSuccess?.();
        }catch(e){
          setError(e.message);
        }
      }
    });
    id.renderButton(divRef.current, { theme: "outline", size: "large", width: 320 });
  }, [open, onSuccess]);

  if(!open) return null;

  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.modal} onClick={(e)=>e.stopPropagation()}>
        <h3 style={{marginTop:0}}>Admin Login</h3>
        <p className="lead">Sign in with your Google account (allowlisted only).</p>
        <div ref={divRef} style={{display:"inline-block"}} />
        {error && <div style={{color:"#b00020", marginTop:12}}>{error}</div>}
        <div style={{marginTop:16}}>
          <button className="btn btn-outline" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position:"fixed", inset:0, background:"rgba(0,0,0,.5)",
    display:"grid", placeItems:"center", zIndex: 1000
  },
  modal: {
    width:"min(520px, 92vw)", background:"#fff", borderRadius:16,
    padding:"20px 22px", boxShadow:"0 20px 40px rgba(0,0,0,.35)"
  }
};
