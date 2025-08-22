import { useI18n } from '../../i18n'
export default function ReviewStep({ parent, children, onBack, onSubmit }){
  const { t } = useI18n()
  return (
    <div>
      <h4>{t.review}</h4>
      <div className="card" style={{marginTop:12}}>
        <h5>{t.parentName}</h5>
        <p><b>Name:</b> {parent.name}</p>
        <p><b>Email:</b> {parent.email}</p>
        <p><b>Phone:</b> {parent.phone}</p>
        <p><b>Address:</b> {parent.address}</p>
        <p><b>Study Plan:</b> {parent.studyPlan}</p>
      </div>
      <div className="card" style={{marginTop:12}}>
      <h5>{t.childrenCount(children.length)}</h5>
        {children.map((c,i)=> (
          <div key={i} style={{marginBottom:8}}>
            <b>Child {i+1}:</b> {c.name} · Age {c.age} · Grade {c.grade}
          </div>
        ))}
      </div>
      <div className="buttonbar">
        <button onClick={onBack}>{t.back}</button>
        <button className="primary" onClick={onSubmit}>{t.submit}</button>
       </div>
    </div>
  )
}
