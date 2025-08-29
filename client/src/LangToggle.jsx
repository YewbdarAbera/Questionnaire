import { useI18n } from "./i18n";

export default function LangToggle(){
  const { lang, setLang } = useI18n();
  return (
    <div className="lang-pill" aria-label="Language">
      <button type="button" className={`chip ${lang==='EN'?'active':''}`} onClick={()=>setLang('EN')}>EN</button>
      <span className="sep" />
      <button type="button" className={`chip ${lang==='AM'?'active':''}`} onClick={()=>setLang('AM')}>AM</button>
    </div>
  );
}
