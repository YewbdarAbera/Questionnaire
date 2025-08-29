// server/src/utils/jwt.js
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

/** Sign app session for admin after Google token is verified */
export function signAdminSession(payload) {
  // payload: { email, name }
  return jwt.sign(payload, SECRET, { expiresIn: "12h" });
}

/** Verify our app session */
export function verifyAdminSession(token) {
  return jwt.verify(token, SECRET);
}
