'use client'
import { useRouter } from 'next/navigation'

export default function Activation() {
  const router = useRouter()
  const g = '#c49d64', sf = '#111118', mt = '#7a7a8a'

  return (
    <div style={{ minHeight: '100vh', background: sf, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', padding: '20px' }}>
      <div style={{ maxWidth: '480px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
        <h1 style={{ color: '#f0ede8', fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Riley est presque prêt !</h1>
        <p style={{ color: mt, fontSize: '15px', marginBottom: '40px' }}>Dernière étape — Activez Riley en 30 secondes</p>

        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '32px', marginBottom: '24px' }}>
          <p style={{ color: mt, fontSize: '14px', marginBottom: '16px' }}>Sur votre téléphone, ouvrez le clavier d'appel et tapez exactement ce code :</p>
          <div style={{ background: '#0a0a12', borderRadius: '12px', padding: '24px', marginBottom: '16px', border: '2px solid #c49d64' }}>
            <div style={{ color: g, fontSize: '28px', fontWeight: 800, letterSpacing: '2px', fontFamily: 'monospace' }}>**21*0033948194151#</div>
          </div>
          <p style={{ color: mt, fontSize: '13px' }}>Puis appuyez sur <strong style={{ color: '#f0ede8' }}>Appeler ✅</strong></p>
        </div>

        <div style={{ background: 'rgba(196,157,100,0.1)', borderRadius: '12px', padding: '16px', marginBottom: '32px', border: '1px solid rgba(196,157,100,0.3)' }}>
          <p style={{ color: g, fontSize: '13px', margin: 0 }}>✅ C'est tout ! Désormais tous vos appels professionnels seront pris en charge par Riley automatiquement.</p>
        </div>

        <button onClick={() => router.push('/dashboard')} style={{ width: '100%', padding: '16px', background: g, border: 'none', borderRadius: '10px', color: sf, fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}>
          J'ai activé Riley → Accéder au dashboard
        </button>
      </div>
    </div>
  )
}
