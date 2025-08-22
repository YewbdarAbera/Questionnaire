import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'
export default function SubmitSuccess() {
  const { t } = useI18n()
  return (
    <div className="card">
      <h3>{t.thanksTitle}</h3>
+      <p>{t.thanksText}</p>
      <Link className="link" to="/">Submit another response</Link>
    </div>
  )
}
