import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { I18nProvider } from './i18n'
import { GoogleOAuthProvider } from '@react-oauth/google'
import "./index.css"

 createRoot(document.getElementById('root')).render(
 <BrowserRouter>
   <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <I18nProvider>
        <App />
     </I18nProvider>
    </GoogleOAuthProvider>
  </BrowserRouter>
 )
