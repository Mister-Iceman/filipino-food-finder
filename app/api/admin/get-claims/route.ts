import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const { data, error } = await supabase
    .from('listing_claims')
    .select('id, listing_id, listing_name, claimant_name, claimant_email, claimant_phone, claimant_message, status, created_at')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[get-claims] error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ claims: data ?? [] })
}
