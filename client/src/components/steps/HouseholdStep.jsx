import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { childrenCountSchema } from '../../lib/schema'
import { useI18n } from '../../i18n'
export default function HouseholdStep({ value, onValid, onBack }){
  const { register, handleSubmit, formState:{ errors, isValid } } = useForm({
    mode:'onChange',
    resolver: zodResolver(childrenCountSchema),
    defaultValues: { childrenCount: value }
  })
const { t } = useI18n()
  return (
    <form onSubmit={handleSubmit(({ childrenCount })=> onValid(childrenCount))}>
      <div className="field">
        <label>{t.howMany}</label>
        <input type="number" min={0} max={10} {...register('childrenCount', { valueAsNumber: true })} />
        {errors.childrenCount && <div className="error">{errors.childrenCount.message}</div>}
      </div>
      <div className="buttonbar">
        <button type="button" onClick={onBack}>{t.back}</button>
       <button className="primary" type="submit" disabled={!isValid}>{t.next}</button>
       </div>
    </form>
  )
}
