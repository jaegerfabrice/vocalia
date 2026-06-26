'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const g = '#c49d64', sf = '#111118', mt = '#7a7a8a'

  const handleReset = async () => {
    setLoading(true)
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://vocalia.vercel.app/reset-password'
    })
    setSent(true)
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: sf, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ color: '#f0ede8', fontSize: '24px', marginBottom: '8px', textAlign: 'center' }}>Mot de passe oublié</h1>
        {sent ? (
          <p style={{ color: '#4caf50', textAlign: 'center', marginTop: '20px' }}>Email envoyé ! Vérifiez votre boîte mail.</p>
        ) : (
          <>
            <p style={{ color: mt, fontSize: '14px', textAlign: 'center', marginBottom: '24px' }}>Entrez votre email pour recevoir un lien de réinitialisation</p>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#f0ede8', fontSize: '14px', boxSizing: 'border-box', marginBottom: '16px' }} />
            <button onClick={handleReset} disabled={loading || !email} style={{ width: '100%', padding: '14px', borderRadius: '10px', border: 'none', background: email ? g : 'rgba(255,255,255,0.1)', color: email ? sf : mt, fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>
              {loading ? 'Envoi...' : 'Envoyer le lien'}
            </button>
          </>
        )}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <a href="/login" style={{ color: g, fontSize: '13px', textDecoration: 'none' }}>Retour à la connexion</a>
        </div>
      </div>
    </div>
  )
}
