import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function PATCH(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { token } = await request.json()
  if (!token) return NextResponse.json({ error: 'No token' }, { status: 400 })

  await supabase
    .from('owner_sessions')
    .update({ used: true })
    .eq('token', token)
    .eq('used', false)

  return NextResponse.json({ success: true })
}
