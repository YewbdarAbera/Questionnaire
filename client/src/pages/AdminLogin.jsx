import { useState } from 'react'
import { isAuthed, setToken } from '../lib/auth'
import { useNavigate, Navigate } from 'react-router-dom'
import { adminLoginApi } from '../lib/api'
import { useI18n } from '../i18n'
export default function AdminLogin(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const nav = useNavigate()
  const { t } = useI18n()
  if(isAuthed()) return <Navigate to="/admin/dashboard" replace />

  async function onSubmit(e){
    e.preventDefault()
    setError('')
    try {
      const { token } = await adminLoginApi(email, password)
      setToken(token)
      nav('/admin/dashboard')
    } catch(err){
      setError(err.message)
    }
  }

  return (
    <div className="card">
       <h3>{t.loginTitle}</h3>
      <form onSubmit={onSubmit}>
        <div className="field">
         <label>{t.email}</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="admin@example.com" />
        </div>
        <div className="field">
          <label>{t.password}</label>
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="••••••••" />
        </div>
        {error && <div className="error">{error}</div>}
        <div className="buttonbar">
         <button className="primary" type="submit">{t.login}</button>
        </div>
      </form>
    </div>
  )
}
