import React, { createContext, useContext, useMemo, useState } from "react";
import en from "./locales/en.json";
import am from "./locales/am.json";

const STRINGS = { EN: en, AM: am };
const I18nCtx = createContext();

export function I18nProvider({ children }) {
  const [lang, setLang] = useState("EN"); // user chooses on landing
  const t = useMemo(() => STRINGS[lang], [lang]);
  return (
    <I18nCtx.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nCtx.Provider>
  );
}
export const useI18n = () => useContext(I18nCtx);
