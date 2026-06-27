import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (body.message?.type === 'end-of-call-report') {
      const transcript = body.message?.transcript || ''
      const caller = body.message?.customer?.number || 'Inconnu'
      const duration = body.message?.durationSeconds || 0

      await supabase.from('calls').insert({
        caller_number: caller,
        transcript: transcript,
        duration: duration,
        created_at: new Date().toISOString()
      })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
