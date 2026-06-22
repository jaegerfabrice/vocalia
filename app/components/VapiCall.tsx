'use client'
import { useEffect, useState } from 'react'

export default function VapiCall({ onClose, professionalName }: { onClose: () => void, professionalName?: string }) {
  const [status, setStatus] = useState<'connecting' | 'active' | 'ended'>('connecting')
  const [vapi, setVapi] = useState<any>(null)
  const g = '#c49d64', sf = '#111118', mt = '#7a7a8a'

  useEffect(() => {
    const load = async () => {
      const promptRes = await fetch('/api/vapi', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
      const promptData = await promptRes.json()

      const Vapi = (await import('@vapi-ai/web')).default
      const key = process.env.NEXT_PUBLIC_VAPI_KEY as string
      const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID as string
      const v = new Vapi(key)
      setVapi(v)
      v.on('call-start', () => setStatus('active'))
      v.on('call-end', () => { setStatus('ended'); setTimeout(onClose, 2000) })
      v.start(assistantId)
    }
    load()
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, fontFamily: 'sans-serif' }}>
      <div style={{ background: sf, borderRadius: '20px', padding: '48px 40px', textAlign: 'center', width: '320px', border: '1px solid rgba(196,157,100,0.3)' }}>
        <div style={{ fontSize: '56px', marginBottom: '20px' }}>
          {status === 'connecting' ? '📞' : status === 'active' ? '🎙️' : '✅'}
        </div>
        <div style={{ color: '#f0ede8', fontWeight: 700, fontSize: '20px', marginBottom: '8px' }}>
          {status === 'connecting' ? 'Connexion...' : status === 'active' ? 'Riley vous parle' : 'Appel termine'}
        </div>
        {professionalName && (
          <div style={{ color: g, fontSize: '13px', marginBottom: '8px' }}>Cabinet de {professionalName}</div>
        )}
        <div style={{ color: mt, fontSize: '13px', marginBottom: '28px' }}>
          {status === 'connecting' ? 'Veuillez patienter...' : status === 'active' ? 'En ligne' : 'Merci !'}
        </div>
        {status === 'connecting' && (
          <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: mt, cursor: 'pointer', fontSize: '13px' }}>
            Annuler
          </button>
        )}
        {status === 'active' && (
          <button onClick={() => { vapi?.stop(); onClose() }}
            style={{ padding: '14px 28px', borderRadius: '10px', border: 'none', background: '#ff4444', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '15px' }}>
            Terminer l appel
          </button>
        )}
      </div>
    </div>
  )
}
