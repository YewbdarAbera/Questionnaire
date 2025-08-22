import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { childSchema } from '../../lib/schema'
import { useI18n } from '../../i18n'
export default function ChildStep({ index, total, value, onValid, onBack }){
  const { register, handleSubmit, formState:{ errors, isValid } } = useForm({
    mode:'onChange',
    resolver: zodResolver(childSchema),
    defaultValues: value || { name:'', age:'', grade:'' }
  })
const { t } = useI18n()
  return (
    <div>
      <h4>{t.child(index+1, total)}</h4>
      <form onSubmit={handleSubmit(onValid)}>
        <div className="row">
          <div className="field">
            <label>{t.childName}</label>
            <input {...register('name')} placeholder="Alex" />
            {errors.name && <div className="error">{errors.name.message}</div>}
          </div>
          <div className="field">
             <label>{t.age}</label>
            <input type="number" min={1} max={20} {...register('age', { valueAsNumber: true })} />
            {errors.age && <div className="error">{errors.age.message}</div>}
          </div>
        </div>

        <div className="field">
         <label>{t.grade}</label>
          <select {...register('grade')}>
            <option value="">Select...</option>
            <option value="K">K</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6+">6+</option>
          </select>
          {errors.grade && <div className="error">{errors.grade.message}</div>}
        </div>

        <div className="buttonbar">
          <button type="button" onClick={onBack}>{t.back}</button>
         <button className="primary" type="submit" disabled={!isValid}>{t.next}</button>
         </div>
      </form>
    </div>
  )
}
