import { useEffect, useState } from "react";
import { adminFetch, clearAdminToken } from "../admin/auth";

export default function AdminDashboard(){
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load(){
    setLoading(true); setErr("");
    try{
      const data = await adminFetch("/api/admin/grouped");
      setRows(data);
    }catch(e){
      setErr(e.message);
    }finally{
      setLoading(false);
    }
  }

  async function downloadExcel(){
    try{
      const blob = await adminFetch("/api/admin/export");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `questionnaire_grouped.xlsx`;
      document.body.appendChild(a);
      a.click(); a.remove();
      URL.revokeObjectURL(url);
    }catch(e){
      alert("Download failed: " + e.message);
    }
  }

  useEffect(()=>{ load(); },[]);

  return (
    <div className="card">
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <h1>Admin Dashboard</h1>
        <div style={{display:"flex", gap:10}}>
          <button className="btn btn-outline" onClick={()=>{ clearAdminToken(); location.reload(); }}>Sign out</button>
          <button className="btn btn-primary" onClick={downloadExcel}>Download Excel</button>
        </div>
      </div>

      {loading && <p>Loading…</p>}
      {err && <p style={{color:"#b00020"}}>{err}</p>}

      {!loading && !err && (
        <div className="table-wrap" style={{marginTop:12}}>
          <table className="table">
            <thead>
              <tr>
                <th>Key (Email/Phone)</th>
                <th>Parent</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Preferred</th>
                <th># Submissions</th>
                <th># Children</th>
                <th>Children (Name & Grade)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r,i)=>(
                <tr key={i}>
                  <td>{r.Key}</td>
                  <td>{r.ParentName}</td>
                  <td>{r.Email}</td>
                  <td>{r.Phone}</td>
                  <td>{r.Preferred}</td>
                  <td>{r.Submissions}</td>
                  <td>{r.ChildrenCount}</td>
                  <td>{r.Children}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
