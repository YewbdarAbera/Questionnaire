const AUTH_KEY = 'survey_admin_token'
export function setToken(token){ localStorage.setItem(AUTH_KEY, token) }
export function getToken(){ return localStorage.getItem(AUTH_KEY) }
export function isAuthed(){ return !!getToken() }
export function logout(){ localStorage.removeItem(AUTH_KEY) }
