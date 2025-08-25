import { Navigate, useNavigate } from 'react-router-dom'
import { isAuthed, setToken } from '../lib/auth'
import { adminGoogleLogin } from '../lib/api'
import { GoogleLogin } from '@react-oauth/google'
import { useState } from 'react'
import { useI18n } from '../i18n'

export default function AdminLogin(){
  const { t } = useI18n()
  const nav = useNavigate()
  const [error, setError] = useState('')

  if(isAuthed()) return <Navigate to="/admin/dashboard" replace />

  return (
    <div className="card" style={{maxWidth:520, margin:'40px auto'}}>
      <h3>{t.loginTitle}</h3>
      <p style={{color:'#9aa3c7'}}>Sign in with your Google account (allowed admins only).</p>
      {error && <div className="error" style={{marginBottom:12}}>{error}</div>}
      <GoogleLogin
        onSuccess={async (res)=>{
          try{
            const { token } = await adminGoogleLogin(res.credential)
            setToken(token)
            nav('/admin/dashboard')
          }catch(e){ setError(e.message) }
        }}
        onError={()=> setError('Google sign-in failed')}
        useOneTap
      />
    </div>
  )
}
