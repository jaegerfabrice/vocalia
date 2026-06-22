import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET() {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ leads: data })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { error } = await supabase.from('leads').insert({
      first_name: body.first_name || '',
      last_name: body.last_name || '',
      phone: body.phone || '',
      reason: body.reason || '',
      summary: body.reason || '',
      status: 'nouveau'
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await resend.emails.send({
      from: 'Vocalia <onboarding@resend.dev>',
      to: 'jaegerfabrice@gmail.com',
      subject: 'Nouveau lead Vocalia',
      html: `
        <h2>Nouveau rendez-vous demande</h2>
        <p><strong>Nom :</strong> ${body.first_name} ${body.last_name}</p>
        <p><strong>Telephone :</strong> ${body.phone}</p>
        <p><strong>Raison :</strong> ${body.reason}</p>
        <p>Connectez-vous sur <a href="https://vocalia.vercel.app">vocalia.vercel.app</a> pour voir le lead.</p>
      `
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
