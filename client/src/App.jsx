import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import SubmitSuccess from './pages/SubmitSuccess'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import RequireAuth from './RequireAuth'
import { useI18n } from './i18n'
export default function App() {
  const { t, lang, setLang } = useI18n()
  return (
    <div className="container">
      <div className="header">
        <h2>🎓 Questionnaire</h2>
        <nav style={{display:'flex', gap:12}}>
         <Link className="link" to="/">Home</Link>
-          <Link className="link" to="/admin">Admin</Link>
+          <Link className="link" to="/">{t.home}</Link>
+          <Link className="link" to="/admin">{t.admin}</Link>
+          <div className="lang-toggle">
+            <button className={lang==='EN'?'active':''} onClick={()=>setLang('EN')}>EN</button>
+            <button className={lang==='AM'?'active':''} onClick={()=>setLang('AM')}>AM</button>
+          </div>
        </nav>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/submitted" element={<SubmitSuccess />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
       <RequireAuth><AdminDashboard /></RequireAuth>
  } />
      </Routes>
    </div>
  )
}
