import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        email,
        listIds: [2],
        updateEnabled: true,
        attributes: {
          SOURCE: 'FilipinoFoodNearMe.org',
        },
      }),
    })

    // 204 = already exists but updated, 201 = created
    if (res.status === 201 || res.status === 204) {
      return NextResponse.json({ success: true })
    }

    const data = await res.json()

    // Brevo returns 400 with code "duplicate_parameter" if contact already exists
    // in some API versions — treat as success
    if (data?.code === 'duplicate_parameter') {
      return NextResponse.json({ success: true, already: true })
    }

    return NextResponse.json({ error: 'Signup failed' }, { status: 500 })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}