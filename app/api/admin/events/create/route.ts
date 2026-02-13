import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ADMIN_PASSWORD = 'R@ikkonenProjpagkain2026'

export async function POST(request: Request) {
  const body = await request.json()
  
  if (body.password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { data, error } = await supabaseAdmin
    .from('events')
    .insert([body.eventData])
    .select()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ data })
}