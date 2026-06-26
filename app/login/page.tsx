'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const g = '#c49d64', sf = '#111118', mt = '#7a7a8a'

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email ou mot de passe incorrect')
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: sf, fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '32px', fontWeight: 700, color: g }}>Vocalia</div>
          <div style={{ color: mt, marginTop: '8px' }}>Connexion professionnels</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '32px' }}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ color: mt, fontSize: '13px', marginBottom: '6px' }}>Email</div>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#f0ede8', fontSize: '14px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ color: mt, fontSize: '13px', marginBottom: '6px' }}>Mot de passe</div>
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '12px', paddingRight: '44px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#f0ede8', fontSize: '14px', boxSizing: 'border-box' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#7a7a8a', fontSize: '16px' }}>{showPassword ? '🙈' : '👁'}</button>
            </div>
          </div>
          {error && <div style={{ color: '#ff4444', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}
          <button onClick={handleLogin} disabled={loading || !email || !password} style={{ width: '100%', padding: '14px', borderRadius: '10px', border: 'none', background: email && password ? g : 'rgba(255,255,255,0.1)', color: email && password ? sf : mt, fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <div style={{ marginBottom: '12px' }}><a href='/forgot-password' style={{ color: g, fontSize: '13px', textDecoration: 'none' }}>Mot de passe oublié ?</a></div>
            <span style={{ color: mt, fontSize: '13px' }}>Pas encore inscrit ? </span>
            <a href="/signup" style={{ color: g, fontSize: '13px', textDecoration: 'none' }}>Créer un compte</a>
          </div>
        </div>
      </div>
    </div>
  )
}