'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Dashboard() {
  const [calls, setCalls] = useState<any[]>([])
  const [client, setClient] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const g = '#c49d64', sf = '#111118', mt = '#7a7a8a'

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }

      const { data: clientData } = await supabase
        .from('clients').select('*').eq('user_id', user.id).single()
      setClient(clientData)

      const { data: callsData } = await supabase
        .from('calls').select('*').order('created_at', { ascending: false })
      setCalls(callsData || [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: sf, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f0ede8', fontFamily: 'sans-serif' }}>
      Chargement...
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: sf, color: '#f0ede8', fontFamily: 'sans-serif' }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '20px', fontWeight: 700, color: g }}>Vocalia</div>
        <div style={{ color: mt, fontSize: '14px' }}>
          Bonjour {client?.first_name || client?.email} 👋
        </div>
        <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/login' }}
          style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: mt, cursor: 'pointer', fontSize: '13px' }}>
          Déconnexion
        </button>
      </div>
      <div style={{ padding: '32px 24px' }}>
        <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '24px' }}>
          Appels reçus ({calls.length})
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
              {['Date', 'Appelant', 'Résumé', 'Statut'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 12px', color: mt, fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {calls.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: mt }}>
                Aucun appel pour l instant. Riley attend vos clients ! 🎙️
              </td></tr>
            ) : calls.map((call, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px' }}>{call.created_at ? new Date(call.created_at).toLocaleDateString('fr-FR') : '-'}</td>
                <td style={{ padding: '12px' }}>{call.caller_number || '-'}</td>
                <td style={{ padding: '12px', color: mt }}>{call.summary || '-'}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ background: 'rgba(196,157,100,0.2)', color: g, padding: '3px 10px', borderRadius: '20px', fontSize: '12px' }}>
                    {call.status || 'Nouveau'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
