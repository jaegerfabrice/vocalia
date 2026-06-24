import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, phone, cabinet, profession } = body

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: Math.random().toString(36).slice(-8),
      email_confirm: true,
      user_metadata: { name, phone, cabinet, profession }
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ success: true, user: data.user })
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
