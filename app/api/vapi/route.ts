import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { data: onboarding } = await supabase
      .from('onboarding')
      .select('custom_question')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    const customQuestion = onboarding?.custom_question || ''

    return NextResponse.json({
      assistant: {
        systemPrompt: `Tu es Riley, un assistant vocal francophone pour professionnels.
Quand un client t'appelle, tu dois :
1. Te presenter : "Bonjour, je suis Riley ! Je vais vous demander quelques informations pour prendre votre rendez-vous. Pouvez-vous me donner votre prenom et votre nom de famille ?"
2. Epeler le prenom et nom lettre par lettre pour confirmer
3. Demander l email du client
4. ${customQuestion ? `Poser cette question : "${customQuestion}"` : 'Demander la raison de la visite'}
5. Demander les disponibilites
6. Confirmer et conclure chaleureusement
Tu es naturelle, chaleureuse et professionnelle. Tu ne poses qu une question a la fois.`
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
