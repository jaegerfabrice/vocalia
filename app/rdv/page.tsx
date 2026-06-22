'use client'
import { useState, useEffect } from 'react'
import ChatWidget from './../components/ChatWidget'
import VapiCall from './../components/VapiCall'

type Professional = { id: string, name: string, profession: string }

const PROFESSIONS = ['Avocat', 'Immobilier']

export default function RDVPage() {
  const [step, setStep] = useState<'profession' | 'search' | 'mode' | 'form'>('profession')
  const [profession, setProfession] = useState('')
  const [search, setSearch] = useState('')
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [selected, setSelected] = useState<Professional | null>(null)
  const [showVapi, setShowVapi] = useState(false)
  const [openChat, setOpenChat] = useState(false)
  const g = '#c49d64', sf = '#111118', mt = '#7a7a8a'

  useEffect(() => {
    if (step === 'search' && profession) {
      fetch(`/api/professionals?profession=${encodeURIComponent(profession)}`)
        .then(r => r.json())
        .then(d => setProfessionals(d.professionals || []))
    }
  }, [step, profession])

  const filtered = professionals.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
    <div style={{ minHeight: '100vh', background: sf, fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
      <div style={{ width: '100%', maxWidth: '500px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '32px', fontWeight: 700, color: g }}>Vocalia</div>
          <div style={{ color: mt, marginTop: '8px' }}>Prendre un rendez-vous</div>
        </div>

        {step === 'profession' && (
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '32px' }}>
            <div style={{ color: '#f0ede8', fontWeight: 600, marginBottom: '20px', fontSize: '16px' }}>Avec quel type de professionnel ?</div>
            {PROFESSIONS.map(p => (
              <button key={p} onClick={() => { setProfession(p); setStep('search') }}
                style={{ display: 'block', width: '100%', padding: '16px', marginBottom: '10px', borderRadius: '12px', border: '1px solid rgba(196,157,100,0.3)', background: 'transparent', color: '#f0ede8', cursor: 'pointer', textAlign: 'left', fontSize: '15px', fontWeight: 500 }}>
                {p === 'Avocat' ? '⚖️' : p === 'Médecin' ? '🩺' : p === 'Notaire' ? '📜' : '📊'} {p}
              </button>
            ))}
          </div>
        )}

        {step === 'search' && (
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '32px' }}>
            <button onClick={() => setStep('profession')} style={{ color: mt, background: 'none', border: 'none', cursor: 'pointer', marginBottom: '16px', fontSize: '14px' }}>← Retour</button>
            <div style={{ color: '#f0ede8', fontWeight: 600, marginBottom: '16px', fontSize: '16px' }}>Rechercher votre {profession}</div>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={`Nom du ${profession.toLowerCase()}...`}
              style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid rgba(196,157,100,0.4)', background: 'rgba(255,255,255,0.07)', color: '#f0ede8', fontSize: '15px', boxSizing: 'border-box', marginBottom: '16px' }}
            />
            {filtered.length === 0 && search.length > 0 && (
              <div style={{ color: mt, textAlign: 'center', padding: '20px', fontSize: '14px' }}>Aucun résultat pour "{search}"</div>
            )}
            {filtered.map(p => (
              <button key={p.id} onClick={() => { setSelected(p); setStep('mode') }}
                style={{ display: 'block', width: '100%', padding: '14px', marginBottom: '8px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#f0ede8', cursor: 'pointer', textAlign: 'left', fontSize: '15px' }}>
                👤 {p.name}
              </button>
            ))}
            {filtered.length === 0 && search.length === 0 && professionals.map(p => (
              <button key={p.id} onClick={() => { setSelected(p); setStep('mode') }}
                style={{ display: 'block', width: '100%', padding: '14px', marginBottom: '8px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#f0ede8', cursor: 'pointer', textAlign: 'left', fontSize: '15px' }}>
                👤 {p.name}
              </button>
            ))}
          </div>
        )}

        {step === 'mode' && selected && (
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '32px' }}>
            <button onClick={() => setStep('search')} style={{ color: mt, background: 'none', border: 'none', cursor: 'pointer', marginBottom: '20px', fontSize: '14px' }}>← Retour</button>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ color: '#f0ede8', fontWeight: 700, fontSize: '18px' }}>{selected.name}</div>
              <div style={{ color: g, fontSize: '13px', marginTop: '4px' }}>{selected.profession}</div>
            </div>
            <div style={{ color: '#f0ede8', fontWeight: 600, marginBottom: '16px', textAlign: 'center' }}>Comment souhaitez-vous prendre RDV ?</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <button onClick={() => setStep('form')}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(196,157,100,0.3)', borderRadius: '14px', padding: '28px 16px', cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>📋</div>
                <div style={{ color: '#f0ede8', fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>Questionnaire</div>
              </button>
              <button onClick={() => setShowVapi(true)}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(196,157,100,0.3)', borderRadius: '14px', padding: '28px 16px', cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>🎙️</div>
                <div style={{ color: '#f0ede8', fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>Avec Riley</div>
              </button>
            </div>
          </div>
        )}

        {step === 'form' && selected && (
          <FormRDV g={g} sf={sf} mt={mt} professional={selected} onBack={() => setStep('mode')} />
        )}
      </div>
    </div>
    <ChatWidget autoOpen={openChat} />
    {showVapi && <VapiCall onClose={() => setShowVapi(false)} professionalName={selected?.name} />}
    </>
  )
}

function FormRDV({ g, sf, mt, professional, onBack }: any) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', phone: '', email: '', reason: '', message: '', slot: '' })
  const [submitted, setSubmitted] = useState(false)
  const reasons = ['Consultation', 'Urgence', 'Suivi', 'Renouvellement', 'Autre']

  const handleSubmit = async () => {
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: form.name.split(' ')[0] || '',
        last_name: form.name.split(' ')[1] || '',
        phone: form.phone,
        reason: `[${professional.name}] ${form.reason} - RDV: ${form.slot} - ${form.message}`,
        summary: `[${professional.name}] ${form.reason} - RDV: ${form.slot}`,
        status: 'nouveau'
      })
    })
    setSubmitted(true)
  }

  if (submitted) return (
    <div style={{ textAlign: 'center', color: '#f0ede8', padding: '40px' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
      <div style={{ fontSize: '22px', fontWeight: 700, color: g, marginBottom: '8px' }}>Rendez-vous confirmé !</div>
      <div style={{ color: mt }}>Nous vous contacterons pour confirmer.</div>
    </div>
  )

  return (
    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '32px' }}>
      <button onClick={onBack} style={{ color: mt, background: 'none', border: 'none', cursor: 'pointer', marginBottom: '16px', fontSize: '14px' }}>← Retour</button>
      <div style={{ color: g, fontSize: '13px', marginBottom: '20px' }}>📋 RDV avec {professional.name}</div>

      {step === 1 && (
        <div>
          <div style={{ color: '#f0ede8', fontWeight: 600, marginBottom: '16px' }}>Motif de consultation</div>
          {reasons.map(r => (
            <button key={r} onClick={() => { setForm({...form, reason: r}); setStep(2) }}
              style={{ display: 'block', width: '100%', padding: '12px', marginBottom: '8px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#f0ede8', cursor: 'pointer', textAlign: 'left', fontSize: '14px' }}>
              {r}
            </button>
          ))}
        </div>
      )}

      {step === 2 && (
        <div>
          <div style={{ color: '#f0ede8', fontWeight: 600, marginBottom: '16px' }}>Quand êtes-vous disponible ?</div>
          <input value={form.slot} onChange={e => setForm({...form, slot: e.target.value})}
            placeholder="Ex: Lundi matin, mardi après 15h..."
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#f0ede8', fontSize: '14px', boxSizing: 'border-box', marginBottom: '16px' }} />
          <div style={{ color: mt, fontSize: '13px', marginBottom: '8px' }}>Précisions (optionnel)</div>
          <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={2}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#f0ede8', fontSize: '14px', boxSizing: 'border-box', resize: 'none', marginBottom: '16px' }} />
          <button onClick={() => setStep(3)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', background: g, color: sf, fontWeight: 700, cursor: 'pointer' }}>Continuer →</button>
          <button onClick={() => setStep(1)} style={{ marginTop: '8px', color: mt, background: 'none', border: 'none', cursor: 'pointer' }}>← Retour</button>
        </div>
      )}

      {step === 3 && (
        <div>
          <div style={{ color: '#f0ede8', fontWeight: 600, marginBottom: '16px' }}>Vos coordonnées</div>
          {[['Nom complet', 'name', 'text'], ['Téléphone', 'phone', 'tel'], ['Email', 'email', 'email']].map(([label, field, type]) => (
            <div key={field} style={{ marginBottom: '14px' }}>
              <div style={{ color: mt, fontSize: '13px', marginBottom: '6px' }}>{label}</div>
              <input type={type} value={(form as any)[field]} onChange={e => setForm({...form, [field]: e.target.value})}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#f0ede8', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
          ))}
          <button onClick={handleSubmit} style={{ width: '100%', padding: '14px', borderRadius: '10px', border: 'none', background: g, color: sf, fontWeight: 700, fontSize: '15px', cursor: 'pointer', marginTop: '8px' }}>
            Confirmer le rendez-vous →
          </button>
          <button onClick={() => setStep(2)} style={{ marginTop: '8px', color: mt, background: 'none', border: 'none', cursor: 'pointer' }}>← Retour</button>
        </div>
      )}
    </div>
  )
}
