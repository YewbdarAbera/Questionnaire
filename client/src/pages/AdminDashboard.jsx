import { useEffect, useMemo, useState } from 'react'
import { getSubmissions, downloadExcel } from '../lib/api'
import { logout } from '../lib/auth'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard(){
  const nav = useNavigate()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true); setError('')
        const res = await getSubmissions()
        if (!cancelled) setData(Array.isArray(res) ? res : [])
      } catch (err) {
        if (!cancelled) setError(err?.message || 'Failed to load submissions')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, []) // runs once (StrictMode may double‑invoke; the 'cancelled' guard prevents loops)

  const rows = useMemo(() =>
    (Array.isArray(data) ? data : []).map(d => ({
      id: d._id || d.id,
      submittedAt: d.submittedAt ? new Date(d.submittedAt).toLocaleString() : '',
      parentName: d?.parent?.name || '',
      email: d?.parent?.email || '',
      phone: d?.parent?.phone || '',
      address: d?.parent?.address || '',
      studyPlan: d?.parent?.studyPlan || '',
      childrenCount: Array.isArray(d?.children) ? d.children.length : 0, childrenSummary: Array.isArray(d?.children)
   ? d.children.map((c, i) => `${i+1}) ${c.name} (${c.age}, ${c.grade})`).join('  |  ')
    : ''
  })),[data])

  return (
    <div className="card">
      <div className="header">
        <h3>Admin Dashboard</h3>
        <div className="buttonbar">
          <button onClick={() => { logout(); nav('/admin') }}>Logout</button>
          <button onClick={downloadExcel} className="primary" disabled={loading}>Download Excel</button>
        </div>
      </div>

      {loading && <p>Loading…</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && rows.length === 0 && <p>No submissions yet.</p>}

      {!loading && !error && rows.length > 0 && (
        <div style={{overflowX:'auto'}}>
          <table className="table">
            <thead>
              <tr>
                <th>#</th><th>Submitted</th><th>Parent</th><th>Email</th>
                <th>Phone</th><th>Address</th><th>Study Plan</th><th>Children</th>
      <th>Child Info</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r,i)=>(
                <tr key={r.id || i}>
                  <td>{i+1}</td>
                  <td>{r.submittedAt}</td>
                  <td>{r.parentName}</td>
                  <td>{r.email}</td>
                  <td>{r.phone}</td>
                  <td>{r.address}</td>
                  <td>{r.studyPlan}</td>
                 <td>{r.childrenCount}</td>
        <td style={{whiteSpace:'pre-wrap'}}>{r.childrenSummary}</td>
        </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
