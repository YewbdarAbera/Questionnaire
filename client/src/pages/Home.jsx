import MultiStepForm from '../components/MultiStepForm'
import { useI18n } from '../i18n'
export default function Home() {
  const { t } = useI18n()
  return (
    <div className="card">
      <h3>{t.homeTitle}</h3>
      <p className="badge">Multi‑step form with validation</p>
      <MultiStepForm />
    </div>
  )
}
