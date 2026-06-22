'use client'
import { useState, useRef, useEffect } from 'react'

const professions: Record<string, string[]> = {
  'Avocat': ['Divorce', 'Licenciement', 'Litige commercial', 'Succession', 'Autre'],
  'Médecin': ['Consultation générale', 'Renouvellement ordonnance', 'Résultats analyses', 'Autre'],
  'Notaire': ['Achat immobilier', 'Succession', 'Testament', 'Autre'],
  'Comptable': ['Déclaration fiscale', 'Bilan annuel', 'Conseil', 'Autre']
}

const HOURS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']
const MONTHS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']

type Message = { from: 'bot' | 'user', text: string, options?: string[], calendar?: boolean, hours?: boolean }

export default function ChatWidget({ autoOpen }: { autoOpen?: boolean }) {
  const [open, setOpen] = useState(false)
  useEffect(() => { if (autoOpen) { setOpen(true); setTimeout(() => startChat(), 400) } }, [autoOpen])
  const [messages, setMessages] = useState<Message[]>([])
  const [data, setData] = useState({ profession: '', reason: '', name: '', phone: '', date: '', time: '' })
  const [step, setStep] = useState(0)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const g = '#c49d64', sf = '#111118', mt = '#7a7a8a'

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const addBot = (text: string, options?: string[], calendar?: boolean, hours?: boolean) => {
    setMessages(m => [...m, { from: 'bot', text, options, calendar, hours }])
  }

  const addUser = (text: string) => {
    setMessages(m => [...m, { from: 'user', text }])
  }

  const startChat = () => {
    setMessages([])
    setStep(1)
    setData({ profession: '', reason: '', name: '', phone: '', date: '', time: '' })
    setTimeout(() => addBot('Bonjour ! 👋 Je suis Riley, votre assistante virtuelle. Avec quel professionnel souhaitez-vous prendre rendez-vous ?', Object.keys(professions)), 300)
  }

  const getDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days: (number | null)[] = []
    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) days.push(null)
    for (let i = 1; i <= daysInMonth; i++) days.push(i)
    return days
  }

  const isAvailable = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const today = new Date(); today.setHours(0,0,0,0)
    return date > today && date.getDay() !== 0 && date.getDay() !== 6
  }

  const formatDate = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Paris' })
  }

  const handleOption = async (option: string) => {
    addUser(option)
    if (step === 1) {
      setData(d => ({ ...d, profession: option }))
      setStep(2)
      setTimeout(() => addBot(`Parfait ! Pour quelle raison consultez-vous un ${option} ?`, professions[option]), 500)
    } else if (step === 2) {
      setData(d => ({ ...d, reason: option }))
      setStep(3)
      setTimeout(() => addBot('Quel jour vous convient ?', undefined, true), 500)
    } else if (step === 5) {
      const slot = `${data.date} à ${option}`
      setData(d => ({ ...d, time: option }))
      setStep(6)
      setTimeout(() => addBot(`Super ! RDV le ${slot}. Quel est votre nom complet ?`), 500)
    }
  }

  const handleDay = (day: number) => {
    if (!isAvailable(day)) return
    const dateStr = formatDate(day)
    setData(d => ({ ...d, date: dateStr }))
    addUser(dateStr)
    setStep(5)
    setTimeout(() => addBot(`${dateStr} — Quelle heure vous convient ?`, undefined, false, true), 500)
  }

  const handleSend = async () => {
    if (!input.trim()) return
    const val = input.trim()
    setInput('')
    addUser(val)
    if (step === 6) {
      setData(d => ({ ...d, name: val }))
      setStep(7)
      setTimeout(() => addBot('Votre numéro de téléphone ?'), 500)
    } else if (step === 7) {
      setData(d => ({ ...d, phone: val }))
      setStep(8)
      const d = { ...data, phone: val }
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: d.name.split(' ')[0] || '',
          last_name: d.name.split(' ')[1] || '',
          phone: val,
          reason: `[${d.profession}] ${d.reason} - RDV: ${d.date} à ${d.time}`,
          summary: `[${d.profession}] ${d.reason} - RDV: ${d.date} à ${d.time}`,
          status: 'nouveau'
        })
      })
      setTimeout(() => addBot(`✅ Parfait ${d.name} ! Votre rendez-vous est confirmé.\n\n📅 ${d.date} à ${d.time}\n👤 ${d.profession} — ${d.reason}\n\nNous vous contacterons pour confirmer. À bientôt !`), 500)
    }
  }

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000, fontFamily: 'sans-serif' }}>
      {open && (
        <div style={{ width: '360px', height: '520px', background: sf, borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', marginBottom: '12px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: g, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🤖</div>
            <div>
              <div style={{ color: '#f0ede8', fontWeight: 600, fontSize: '14px' }}>Riley</div>
              <div style={{ color: '#4caf82', fontSize: '11px' }}>● En ligne</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: mt, cursor: 'pointer', fontSize: '18px' }}>×</button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>👋</div>
                <div style={{ color: '#f0ede8', fontWeight: 600, marginBottom: '8px' }}>Bonjour !</div>
                <div style={{ color: mt, fontSize: '13px', marginBottom: '20px' }}>Je suis Riley, votre assistante pour prendre rendez-vous.</div>
                <button onClick={startChat} style={{ padding: '12px 24px', borderRadius: '10px', border: 'none', background: g, color: sf, fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>
                  Prendre un rendez-vous →
                </button>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth: '80%', padding: '10px 14px', borderRadius: msg.from === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: msg.from === 'user' ? g : 'rgba(255,255,255,0.08)', color: msg.from === 'user' ? sf : '#f0ede8', fontSize: '13px', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
                    {msg.text}
                  </div>
                </div>
                {msg.options && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                    {msg.options.map(o => (
                      <button key={o} onClick={() => handleOption(o)} style={{ padding: '8px 12px', borderRadius: '8px', border: `1px solid ${g}`, background: 'transparent', color: g, cursor: 'pointer', fontSize: '13px', textAlign: 'left' }}>{o}</button>
                    ))}
                  </div>
                )}
                {msg.calendar && (
                  <div style={{ marginTop: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} style={{ background: 'none', border: 'none', color: mt, cursor: 'pointer' }}>‹</button>
                      <span style={{ color: '#f0ede8', fontSize: '12px', fontWeight: 600 }}>{MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
                      <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} style={{ background: 'none', border: 'none', color: mt, cursor: 'pointer' }}>›</button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
                      {['L','M','M','J','V','S','D'].map((d,i) => <div key={i} style={{ textAlign: 'center', color: mt, fontSize: '10px', padding: '2px' }}>{d}</div>)}
                      {getDays().map((day, i) => (
                        <button key={i} disabled={!day || !isAvailable(day as number)} onClick={() => day && handleDay(day as number)}
                          style={{ padding: '4px 2px', borderRadius: '6px', border: 'none', background: day && isAvailable(day as number) ? 'rgba(196,157,100,0.2)' : 'transparent', color: day && isAvailable(day as number) ? '#f0ede8' : 'rgba(255,255,255,0.15)', cursor: day && isAvailable(day as number) ? 'pointer' : 'default', fontSize: '11px', fontWeight: 600 }}>
                          {day || ''}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {msg.hours && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginTop: '8px' }}>
                    {HOURS.map(h => (
                      <button key={h} onClick={() => handleOption(h)} style={{ padding: '8px', borderRadius: '8px', border: `1px solid ${g}`, background: 'transparent', color: g, cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>{h}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {step >= 6 && step < 8 && (
            <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: '8px' }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder={step === 6 ? 'Votre nom complet...' : 'Votre téléphone...'}
                style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#f0ede8', fontSize: '13px' }} />
              <button onClick={handleSend} style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', background: g, color: sf, cursor: 'pointer', fontWeight: 700 }}>→</button>
            </div>
          )}
        </div>
      )}

      <button onClick={() => setOpen(!open)} style={{ width: 'auto', height: '48px', padding: '0 20px', borderRadius: '50%', background: g, border: 'none', cursor: 'pointer', fontSize: '24px', boxShadow: '0 4px 20px rgba(196,157,100,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' }}>
        {open ? '×' : <span style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'14px',fontWeight:700}}><span>💬</span><span style={{whiteSpace:'nowrap'}}>Prendre RDV</span></span>}
      </button>
    </div>
  )
}
