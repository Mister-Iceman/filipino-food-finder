import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Need service role for email operations
)

export async function POST(request: NextRequest) {
  const { email } = await request.json()

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  // Generate verification token
  const token = Math.random().toString(36).substring(2) + Date.now().toString(36)
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

  // Store verification token
  const { error } = await supabase
    .from('email_verifications')
    .insert({
      email,
      token,
      expires_at: expiresAt.toISOString(),
    })

  if (error) {
    return NextResponse.json({ error: 'Failed to send verification' }, { status: 500 })
  }

  // TODO: Send verification email (implement in Step 3)
  // For now, return the token (in production, send via email)
  
  return NextResponse.json({ 
    success: true,
    // REMOVE THIS IN PRODUCTION - only for testing
    token, 
    verifyUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/verify?token=${token}`
  })
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 400 })
  }

  // Check if token exists and is not expired
  const { data, error } = await supabase
    .from('email_verifications')
    .select('*')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
  }

  // Mark as verified
  await supabase
    .from('email_verifications')
    .update({ verified: true })
    .eq('token', token)

  return NextResponse.json({ 
    success: true,
    email: data.email 
  })
}