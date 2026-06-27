'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
const HOURS_START = ['07:00', '08:00', '09:00', '10:00', '11:00']
const HOURS_END = ['17:00', '18:00', '19:00', '20:00', '21:00']
const DURATIONS = ['15 min', '30 min', '45 min', '1 heure', '1h30', '2 heures']
const AGENDAS = ['Google Calendar', 'Outlook', 'Apple Calendar', 'Pas agenda']

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [data, setData] = useState({ days: [] as string[], start: '09:00', end: '18:00', duration: '30 min', agenda: '', customQuestion: '' })
  const g = '#c49d64', sf = '#111118', mt = '#7a7a8a'

  const toggleDay = (day: string) => {
    setData(d => ({ ...d, days: d.days.includes(day) ? d.days.filter(x => x !== day) : [...d.days, day] }))
  }

  const handleFinish = async () => {
    await fetch('/api/onboarding', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    router.push('/activation')
  }

  return (
    <div style={{ minHeight: '100vh', background: sf, fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
      <div style={{ width: '100%', maxWidth: '520px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '32px', fontWeight: 700, color: g }}>Vocalia</div>
          <div style={{ color: mt, marginTop: '8px' }}>Configuration de votre espace</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
            {[1,2,3,4,5].map(i => (
              <div key={i} style={{ width: '28px', height: '4px', borderRadius: '2px', background: i <= step ? g : 'rgba(255,255,255,0.1)' }} />
            ))}
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '32px' }}>
          {step === 1 && (
            <div>
              <div style={{ color: '#f0ede8', fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>Vos jours de disponibilite</div>
              <div style={{ color: mt, fontSize: '13px', marginBottom: '20px' }}>Quels jours acceptez-vous des rendez-vous ?</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '24px' }}>
                {DAYS.map(day => (
                  <button key={day} onClick={() => toggleDay(day)}
                    style={{ padding: '10px 6px', borderRadius: '10px', border: `1px solid ${data.days.includes(day) ? g : 'rgba(255,255,255,0.1)'}`, background: data.days.includes(day) ? 'rgba(196,157,100,0.2)' : 'transparent', color: data.days.includes(day) ? g : '#f0ede8', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                    {day.slice(0,3)}
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(2)} disabled={data.days.length === 0}
                style={{ width: '100%', padding: '14px', borderRadius: '10px', border: 'none', background: data.days.length > 0 ? g : 'rgba(255,255,255,0.1)', color: data.days.length > 0 ? sf : mt, fontWeight: 700, cursor: data.days.length > 0 ? 'pointer' : 'default', fontSize: '15px' }}>
                Continuer
              </button>
            </div>
          )}
          {step === 2 && (
            <div>
              <div style={{ color: '#f0ede8', fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>Vos horaires</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <div style={{ color: mt, fontSize: '13px', marginBottom: '8px' }}>Debut</div>
                  {HOURS_START.map(h => (
                    <button key={h} onClick={() => setData(d => ({...d, start: h}))}
                      style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '6px', borderRadius: '8px', border: `1px solid ${data.start === h ? g : 'rgba(255,255,255,0.1)'}`, background: data.start === h ? 'rgba(196,157,100,0.2)' : 'transparent', color: data.start === h ? g : '#f0ede8', cursor: 'pointer', fontSize: '14px' }}>
                      {h}
                    </button>
                  ))}
                </div>
                <div>
                  <div style={{ color: mt, fontSize: '13px', marginBottom: '8px' }}>Fin</div>
                  {HOURS_END.map(h => (
                    <button key={h} onClick={() => setData(d => ({...d, end: h}))}
                      style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '6px', borderRadius: '8px', border: `1px solid ${data.end === h ? g : 'rgba(255,255,255,0.1)'}`, background: data.end === h ? 'rgba(196,157,100,0.2)' : 'transparent', color: data.end === h ? g : '#f0ede8', cursor: 'pointer', fontSize: '14px' }}>
                      {h}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => setStep(3)} style={{ width: '100%', padding: '14px', borderRadius: '10px', border: 'none', background: g, color: sf, fontWeight: 700, cursor: 'pointer', fontSize: '15px' }}>Continuer</button>
              <button onClick={() => setStep(1)} style={{ marginTop: '8px', color: mt, background: 'none', border: 'none', cursor: 'pointer' }}>Retour</button>
            </div>
          )}
          {step === 3 && (
            <div>
              <div style={{ color: '#f0ede8', fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>Duree d un rendez-vous</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
                {DURATIONS.map(d => (
                  <button key={d} onClick={() => setData(x => ({...x, duration: d}))}
                    style={{ padding: '14px 8px', borderRadius: '10px', border: `1px solid ${data.duration === d ? g : 'rgba(255,255,255,0.1)'}`, background: data.duration === d ? 'rgba(196,157,100,0.2)' : 'transparent', color: data.duration === d ? g : '#f0ede8', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                    {d}
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(4)} style={{ width: '100%', padding: '14px', borderRadius: '10px', border: 'none', background: g, color: sf, fontWeight: 700, cursor: 'pointer', fontSize: '15px' }}>Continuer</button>
              <button onClick={() => setStep(2)} style={{ marginTop: '8px', color: mt, background: 'none', border: 'none', cursor: 'pointer' }}>Retour</button>
            </div>
          )}
          {step === 4 && (
            <div>
              <div style={{ color: '#f0ede8', fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>Votre agenda</div>
              {AGENDAS.map(a => (
                <button key={a} onClick={() => setData(d => ({...d, agenda: a}))}
                  style={{ display: 'block', width: '100%', padding: '14px', marginBottom: '8px', borderRadius: '10px', border: `1px solid ${data.agenda === a ? g : 'rgba(255,255,255,0.1)'}`, background: data.agenda === a ? 'rgba(196,157,100,0.2)' : 'transparent', color: data.agenda === a ? g : '#f0ede8', cursor: 'pointer', textAlign: 'left', fontSize: '14px' }}>
                  {a}
                </button>
              ))}
              <button onClick={() => setStep(5)} disabled={!data.agenda}
                style={{ width: '100%', padding: '14px', borderRadius: '10px', border: 'none', background: data.agenda ? g : 'rgba(255,255,255,0.1)', color: data.agenda ? sf : mt, fontWeight: 700, cursor: data.agenda ? 'pointer' : 'default', fontSize: '15px', marginTop: '8px' }}>
                Continuer
              </button>
              <button onClick={() => setStep(3)} style={{ marginTop: '8px', color: mt, background: 'none', border: 'none', cursor: 'pointer' }}>Retour</button>
            </div>
          )}
          {step === 5 && (
            <div>
              <div style={{ color: '#f0ede8', fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>Riley pose une question de votre choix</div>
              <div style={{ color: mt, fontSize: '13px', marginBottom: '20px' }}>Riley posera cette question a chaque client.</div>
              <textarea value={data.customQuestion} onChange={e => setData(d => ({...d, customQuestion: e.target.value}))}
                placeholder="Ex: Quel est votre budget pour ce bien ?"
                rows={3}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#f0ede8', fontSize: '14px', boxSizing: 'border-box', resize: 'none', marginBottom: '16px' }} />
              <button onClick={handleFinish}
                style={{ width: '100%', padding: '14px', borderRadius: '10px', border: 'none', background: g, color: sf, fontWeight: 700, cursor: 'pointer', fontSize: '15px' }}>
                Terminer la configuration
              </button>
              <button onClick={() => setStep(4)} style={{ marginTop: '8px', color: mt, background: 'none', border: 'none', cursor: 'pointer' }}>Retour</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
