import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { parentSchema } from '../../lib/schema'
import { useI18n } from '../../i18n'
export default function ParentInfoStep({ value, onValid }){
  const { register, handleSubmit, formState:{ errors, isValid } } = useForm({
    mode:'onChange',
    resolver: zodResolver(parentSchema),
    defaultValues: value
  })
const { t } = useI18n()
  return (
    <form onSubmit={handleSubmit(onValid)}>
      <div className="row">
        <div className="field">
          <label>{t.parentName}</label>
          <input {...register('name')} placeholder="Jane Doe" />
          {errors.name && <div className="error">{errors.name.message}</div>}
        </div>
        <div className="field">
         <label>{t.email}</label>
          <input {...register('email')} type="email" placeholder="jane@example.com" />
          {errors.email && <div className="error">{errors.email.message}</div>}
        </div>
      </div>

      <div className="row">
        <div className="field">
          <label>{t.phone}</label>
          <input {...register('phone')} placeholder="(555) 555‑1234" />
          {errors.phone && <div className="error">{errors.phone.message}</div>}
        </div>
        <div className="field">
          <label>{t.address}</label>
          <input {...register('address')} placeholder="123 Main St, City, ST" />
          {errors.address && <div className="error">{errors.address.message}</div>}
        </div>
      </div>

      <div className="field">
        <label>{t.studyPlan}</label>
        <select {...register('studyPlan')}>
           <option value="">{t.select}</option>
          <option value="STEM">STEM</option>
          <option value="Humanities">Humanities</option>
          <option value="Arts">Arts</option>
          <option value="General">General</option>
        </select>
        {errors.studyPlan && <div className="error">{errors.studyPlan.message}</div>}
      </div>

      <div className="buttonbar">
        <button className="primary" type="submit" disabled={!isValid}>{t.next}</button>
      </div>
    </form>
  )
}
