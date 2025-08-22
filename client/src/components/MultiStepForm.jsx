import { useState, useMemo } from 'react'
import ParentInfoStep from './steps/ParentInfoStep'
import HouseholdStep from './steps/HouseholdStep'
import ChildStep from './steps/ChildStep'
import ReviewStep from './steps/ReviewStep'
import { useNavigate } from 'react-router-dom'
import { submitSurvey } from '../lib/api'
import { useI18n } from '../i18n'
export default function MultiStepForm() {
  const { t } = useI18n()
  const nav = useNavigate()
  const [step, setStep] = useState(0)
  const [parent, setParent] = useState({ name:'', email:'', phone:'', address:'', studyPlan:'' })
  const [childrenCount, setChildrenCount] = useState(0)
  const [children, setChildren] = useState([])

  const totalSteps = useMemo(()=> 2 + childrenCount + 1, [childrenCount])
  const reviewIndex = totalSteps - 1

  function next(){ setStep(s => Math.min(s+1, reviewIndex)) }
  function back(){ setStep(s => Math.max(s-1, 0)) }

  function upsertChild(index, child){
    setChildren(prev => { const copy=[...prev]; copy[index]=child; return copy })
  }

  async function onSubmit(){
    if(children.length !== childrenCount || children.some(c => !c)) return
    try{
      await submitSurvey({ parent, children })
      setStep(0); setParent({ name:'', email:'', phone:'', address:'', studyPlan:'' })
      setChildrenCount(0); setChildren([])
      nav('/submitted')
    }catch(err){ alert('Failed to submit: '+err.message) }
  }

  return (
    <div>
      <div className="badge">{t.step(step+1, totalSteps || 1)}</div>

      {step === 0 && (
        <ParentInfoStep value={parent} onValid={(v)=>{ setParent(v); next() }} />
      )}

      {step === 1 && (
        <HouseholdStep value={childrenCount} onValid={(count)=>{ setChildrenCount(count); if(count===0) setChildren([]); next() }} onBack={back} />
      )}

      {step >= 2 && step < reviewIndex && (
        <ChildStep
          index={step-2}
          total={childrenCount}
          value={children[step-2]}
          onValid={(child)=>{ upsertChild(step-2, child); next() }}
          onBack={back}
        />
      )}

      {step === reviewIndex && (
        <ReviewStep parent={parent} children={children} onBack={back} onSubmit={onSubmit} />
      )}
    </div>
  )
}
