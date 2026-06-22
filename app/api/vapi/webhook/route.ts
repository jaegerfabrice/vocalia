import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const payload = await req.json()

    await supabase.from('webhook_logs').insert({
      source: 'vapi',
      payload
    })

    const msg = payload?.message
    if (!msg) return NextResponse.json({ ok: true })

    const calledNumber = msg?.call?.phoneNumberId || msg?.phoneNumber?.number || null
    const callerNumber = msg?.call?.customer?.number || null
    const transcript = msg?.transcript || null
    const summary = msg?.analysis?.summary || null
    const extractedData = msg?.analysis?.structuredData || null
    const recordingUrl = msg?.recordingUrl || null
    const vapiCallId = msg?.call?.id || null
    const status = msg?.endedReason || 'completed'

    if (calledNumber) {
      const { data: phoneData } = await supabase
        .from('phone_numbers')
        .select('*')
        .eq('twilio_number', calledNumber)
        .single()

      if (phoneData) {
        await supabase.from('calls').insert({
          client_id: phoneData.client_id,
          phone_number_id: phoneData.id,
          caller_number: callerNumber,
          called_number: calledNumber,
          vapi_call_id: vapiCallId,
          transcript,
          summary,
          extracted_data: extractedData,
          recording_url: recordingUrl,
          status
        })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Webhook error:', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}