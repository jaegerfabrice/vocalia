import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName, phone, cabinet } = await req.json()
    const { data, error } = await supabase.auth.admin.createUser({
      email, password, email_confirm: true
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    await supabase.from('clients').insert({
      user_id: data.user.id,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      company_name: cabinet
    })
    return NextResponse.json({ user: data.user })
  } catch (e) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}