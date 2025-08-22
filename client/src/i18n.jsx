import { createContext, useContext, useEffect, useMemo, useState } from "react";

const KEY = "survey_lang";
const strings = {
  EN: {
    homeTitle: "Parent & Student Survey",
    admin: "Admin",
    home: "Home",
    loginTitle: "Admin Login",
    email: "Email",
    password: "Password",
    login: "Login",
    logout: "Logout",
    download: "Download Excel",
    step: (a, b) => `Step ${a} of ${b}`,
    parentName: "Parent/Guardian Name",
    phone: "Phone",
    address: "Address",
    studyPlan: "Desired Study Plan",
    select: "Select...",
    howMany: "How many children?",
    child: (i, total) => `Child ${i} of ${total}`,
    childName: "Child Name",
    age: "Age",
    grade: "Grade",
    next: "Next",
    back: "Back",
    review: "Review & Submit",
    submit: "Submit",
    childrenCount: (n) => `Children (${n})`,
    thanksTitle: "✅ Thank you!",
    thanksText: "Your survey was submitted successfully.",
    none: "No submissions yet.",
  },
  AM: {
    homeTitle: "የወላጅና የተማሪ መጠይቅ",
    admin: "አስተዳዳሪ",
    home: "መነሻ",
    loginTitle: "የአስተዳዳሪ መግቢያ",
    email: "ኢሜይል",
    password: "የይለፍ ቃል",
    login: "መግባት",
    logout: "መውጣት",
    download: "ኤክሴል አውርድ",
    step: (a, b) => `ደረጃ ${a} ከ ${b}`,
    parentName: "የወላጅ/ተንከባካቢ ስም",
    phone: "ስልክ",
    address: "አድራሻ",
    studyPlan: "የሚፈልጉት የትምህርት እቅድ",
    select: "ምረጥ...",
    howMany: "ልጆች ስንት ናቸው?",
    child: (i, total) => `ልጅ ${i} ከ ${total}`,
    childName: "የልጅ ስም",
    age: "እድሜ",
    grade: "ክፍል",
    next: "ቀጣይ",
    back: "ጀርባ",
    review: "ክለሳ እና ማስገባት",
    submit: "አስገባ",
    childrenCount: (n) => `ልጆች (${n})`,
    thanksTitle: "✅ አመሰግናለሁ!",
    thanksText: "መረጃዎ ተሳክቶ ተቀብሏል።",
    none: "ግብዣ የለም።",
  },
};

const I18nCtx = createContext({ lang: "EN", t: strings.EN, setLang: () => {} });

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem(KEY) || "EN");
  useEffect(() => {
    localStorage.setItem(KEY, lang);
  }, [lang]);
  const t = useMemo(() => strings[lang] || strings.EN, [lang]);
  return (
    <I18nCtx.Provider value={{ lang, setLang, t }}>{children}</I18nCtx.Provider>
  );
}

export function useI18n() {
  return useContext(I18nCtx);
}
