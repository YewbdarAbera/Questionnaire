import { Navigate, useLocation } from "react-router-dom";
import { isAuthed } from "./lib/auth";

export default function RequireAuth({ children }) {
  const authed = isAuthed();               // reads once per render
  const location = useLocation();
  if (!authed) return <Navigate to="/admin" replace state={{ from: location }} />;
  return children;
}
