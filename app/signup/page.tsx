'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const EyeIcon = ({ open }: { open: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </>
    )}
  </svg>
)

export default function Signup() {
  const [form, setForm] = useState({ firstName: '', lastName: '', profession: 'avocat', email: '', phone: '', cabinet: '', password: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const g = '#c49d64', sf = '#111118', br = 'rgba(255,255,255,0.07)', mt = '#7a7a8a'

  async function handleSubmit() {
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email, password: form.password })
    })
    const data = await res.json()
    if (data.error) { setError(data.error); setLoading(false); return }
    setSent(true)
    setTimeout(() => router.push('/login'), 2000)
    setLoading(false)
  }

  if (sent) return (
    <div style={{ minHeight: '100vh', background: sf, color: '#f0ede8', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
        <div style={{ fontSize: '24px', fontWeight: 700, color: g, marginBottom: '8px' }}>Compte créé !</div>
        <div style={{ color: mt }}>Redirection vers la connexion...</div>
      </div>
    </div>
  )

  const inputStyle = { width: '100%', padding: '12px 16px', background: br, border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f0ede8', fontSize: '15px', outline: 'none', boxSizing: 'border-box' as const }

  return (
    <div style={{ minHeight: '100vh', background: sf, color: '#f0ede8', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ fontSize: '28px', fontWeight: 700, color: g, marginBottom: '8px' }}>Vocalia</div>
        <div style={{ fontSize: '16px', color: mt, marginBottom: '40px' }}>Votre assistant vocal IA — Ne ratez plus aucun appel</div>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', color: mt, marginBottom: '6px' }}>Prénom</div>
            <input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} placeholder="Fabrice" style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', color: mt, marginBottom: '6px' }}>Nom</div>
            <input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} placeholder="Dupont" style={inputStyle} />
          </div>
        </div>
        {[
          { key: 'cabinet', label: 'Nom du cabinet', placeholder: 'Cabinet Dupont & Associés' },
          { key: 'email', label: 'Email professionnel', placeholder: 'contact@cabinet-dupont.fr' },
          { key: 'phone', label: 'Numéro de téléphone', placeholder: '+33 1 23 45 67 89' },
        ].map(field => (
          <div key={field.key} style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '13px', color: mt, marginBottom: '6px' }}>{field.label}</div>
            <input value={form[field.key as keyof typeof form]} onChange={e => setForm({ ...form, [field.key]: e.target.value })} placeholder={field.placeholder} style={inputStyle} />
          </div>
        ))}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '13px', color: mt, marginBottom: '6px' }}>Mot de passe</div>
          <div style={{ position: 'relative' }}>
            <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Choisissez un mot de passe" style={{ ...inputStyle, paddingRight: '44px' }} />
            <button onClick={() => setShowPassword(prev => !prev)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: mt, display: 'flex', alignItems: 'center', padding: '0' }}>
              <EyeIcon open={showPassword} />
            </button>
          </div>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '13px', color: mt, marginBottom: '6px' }}>Profession</div>
          <select value={form.profession} onChange={e => setForm({ ...form, profession: e.target.value })} style={{ width: '100%', padding: '12px 16px', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f0ede8', fontSize: '15px', outline: 'none' }}>
            <option value="avocat">Avocat</option>
            <option value="medecin">Médecin</option>
            <option value="notaire">Notaire</option>
            <option value="comptable">Comptable</option>
            <option value="autre">Autre</option>
          </select>
        </div>
        {error && <div style={{ color: '#ff4444', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}
        <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '14px', background: g, border: 'none', borderRadius: '8px', color: sf, fontSize: '16px', fontWeight: 700, cursor: 'pointer', marginTop: '8px' }}>
          {loading ? 'Création...' : 'Démarrer mon essai gratuit →'}
        </button>
        <div style={{ textAlign: 'center', color: mt, fontSize: '13px', marginTop: '16px' }}>Essai gratuit 7 jours — Sans engagement — 49€/mois ensuite</div>
      </div>
    </div>
  )
}