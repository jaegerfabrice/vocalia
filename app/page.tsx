'use client'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  const g = '#c49d64', sf = '#111118', mt = '#7a7a8a'

  return (
    <div style={{ minHeight: '100vh', background: sf, fontFamily: 'Playfair Display, Georgia, serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>

        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: g }}>Vocalia</div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => router.push('/login')}
              style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid rgba(196,157,100,0.4)', background: 'transparent', color: g, cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
              Se connecter
            </button>
            <button onClick={() => router.push('/signup')}
              style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: g, color: sf, cursor: 'pointer', fontSize: '14px', fontWeight: 700 }}>
              Commencer
            </button>
          </div>
        </nav>

        <div style={{ textAlign: 'center', padding: '80px 0 60px' }}>
          <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '20px', border: '1px solid rgba(196,157,100,0.3)', color: g, fontSize: '13px', marginBottom: '24px' }}>
            Assistante IA pour professionnels
          </div>
          <h1 style={{ fontSize: '52px', fontWeight: 800, color: '#f0ede8', lineHeight: 1.15, marginBottom: '20px' }}>
            Ne manquez plus<br />
            <span style={{ color: g }}>aucun appel client</span>
          </h1>
          <p style={{ color: mt, fontSize: '18px', maxWidth: '520px', margin: '0 auto 40px', lineHeight: 1.6 }}>
            Riley, votre assistante vocale IA, repond a vos appels 24h/24, prend les rendez-vous et vous envoie un email a chaque nouveau client.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => router.push('/signup')}
              style={{ padding: '16px 32px', borderRadius: '10px', border: 'none', background: g, color: sf, fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}>
              Essayer 7 jours gratuits →
            </button>
            <button onClick={() => router.push('/rdv')}
              style={{ padding: '16px 32px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: '#f0ede8', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}>
              Voir une demo 🎙️
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '80px' }}>
          {[
            { icon: '🎙️', title: 'Riley repond', desc: 'Votre assistante IA repond instantanement a chaque appel, 24h/24 et 7j/7' },
            { icon: '📅', title: 'RDV automatiques', desc: 'Riley pose les questions, note les disponibilites et confirme le rendez-vous' },
            { icon: '📧', title: 'Email instantane', desc: 'Vous recevez un email avec les coordonnees du client des que Riley raccroche' }
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '16px', padding: '28px', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontSize: '36px', marginBottom: '14px' }}>{icon}</div>
              <div style={{ color: '#f0ede8', fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>{title}</div>
              <div style={{ color: mt, fontSize: '14px', lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', background: 'rgba(196,157,100,0.08)', borderRadius: '20px', padding: '48px', marginBottom: '60px', border: '1px solid rgba(196,157,100,0.2)' }}>
          <div style={{ color: g, fontSize: '13px', marginBottom: '12px', fontWeight: 600 }}>TARIFS SIMPLES</div>
          <div style={{ color: '#f0ede8', fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>49€ <span style={{ fontSize: '18px', color: mt, fontWeight: 400 }}>/mois</span></div>
          <div style={{ color: mt, fontSize: '15px', marginBottom: '28px' }}>7 jours gratuits, puis 99€/mois — Tout inclus</div>
          <button onClick={() => router.push('/signup')}
            style={{ padding: '14px 32px', borderRadius: '10px', border: 'none', background: g, color: sf, fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}>
            Commencer maintenant →
          </button>
        </div>

        <div style={{ textAlign: 'center', padding: '24px 0', borderTop: '1px solid rgba(255,255,255,0.07)', color: mt, fontSize: '13px' }}>
          Vocalia © 2025 — L assistante IA pour professionnels
        </div>
      </div>
    </div>
  )
}
