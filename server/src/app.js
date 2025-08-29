// src/main.jsx or src/App.jsx
import { GoogleOAuthProvider } from "@react-oauth/google";

<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
  <App />
</GoogleOAuthProvider>;
