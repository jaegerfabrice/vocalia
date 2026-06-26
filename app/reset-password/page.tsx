'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const g = '#c49d64', sf = '#111118', mt = '#7a7a8a'

  const handleReset = async () => {
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas'); return }
    if (password.length < 6) { setError('Minimum 6 caractères'); return }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) { setError(error.message); setLoading(false); return }
    setDone(true)
    setTimeout(() => router.push('/login'), 3000)
  }

  return (
    <div style={{ minHeight: '100vh', background: sf, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ color: '#f0ede8', fontSize: '24px', marginBottom: '24px', textAlign: 'center' }}>Nouveau mot de passe</h1>
        {done ? (
          <p style={{ color: '#4caf50', textAlign: 'center' }}>Mot de passe mis à jour ! Redirection...</p>
        ) : (
          <>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', color: mt, marginBottom: '6px' }}>Nouveau mot de passe</div>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '12px', paddingRight: '44px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#f0ede8', fontSize: '14px', boxSizing: 'border-box' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: mt }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', color: mt, marginBottom: '6px' }}>Confirmer le mot de passe</div>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#f0ede8', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
            {error && <div style={{ color: '#ff4444', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}
            <button onClick={handleReset} disabled={loading || !password || !confirm} style={{ width: '100%', padding: '14px', borderRadius: '10px', border: 'none', background: password && confirm ? g : 'rgba(255,255,255,0.1)', color: password && confirm ? sf : mt, fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>
              {loading ? 'Mise à jour...' : 'Changer le mot de passe'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
