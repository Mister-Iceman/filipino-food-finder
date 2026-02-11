import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import * as brevo from '@getbrevo/brevo'

export async function POST(request: NextRequest) {
  // Initialize clients inside function (runtime, not build time)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { email, listingSlug } = await request.json()

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  // Generate verification token
  const token = Math.random().toString(36).substring(2) + Date.now().toString(36)
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

  // Store verification token with listing slug
  const { error } = await supabase
    .from('email_verifications')
    .insert({
      email,
      token,
      expires_at: expiresAt.toISOString(),
      listing_slug: listingSlug || null, // Save the restaurant slug
    })

  if (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to send verification' }, { status: 500 })
  }

  // Build verification URL
  const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://filipinofoodnearme.org'}/api/verify-email?token=${token}`

  // Initialize Brevo inside function
  const apiInstance = new brevo.TransactionalEmailsApi()
  apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY!)

  // Send email via Brevo
  const sendSmtpEmail = new brevo.SendSmtpEmail()
  sendSmtpEmail.to = [{ email }]
  sendSmtpEmail.sender = { 
    email: 'info@filipinofoodnearme.org',
    name: 'Filipino Food Near Me' 
  }
  sendSmtpEmail.subject = 'Verify your email - Filipino Food Near Me'
  sendSmtpEmail.htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🇵🇭 Filipino Food Near Me</h1>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #667eea; margin-top: 0;">Verify Your Email</h2>
        
        <p style="font-size: 16px;">Thank you for sharing your experience with the Filipino food community!</p>
        
        <p style="font-size: 16px;">Click the button below to verify your email and submit your rating:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" 
             style="background: #667eea; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-size: 18px; font-weight: bold; display: inline-block;">
            Verify Email & Continue
          </a>
        </div>
        
        <p style="font-size: 14px; color: #666;">Or copy and paste this link into your browser:</p>
        <p style="font-size: 12px; color: #999; word-break: break-all;">${verifyUrl}</p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #999;">
          This link expires in 24 hours. If you didn't request this verification, you can safely ignore this email.
        </p>
        
        <p style="font-size: 12px; color: #999; text-align: center; margin-top: 20px;">
          Filipino Food Near Me - Supporting our community, one rating at a time<br>
          <a href="https://filipinofoodnearme.org" style="color: #667eea;">filipinofoodnearme.org</a>
        </p>
      </div>
    </body>
    </html>
  `

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail)
    return NextResponse.json({ 
      success: true,
      message: 'Verification email sent! Check your inbox.'
    })
  } catch (emailError: any) {
    console.error('Email sending error:', emailError)
    return NextResponse.json({ 
      error: 'Failed to send verification email. Please try again.',
      details: emailError.message 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

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

  // Redirect back to the restaurant page if we have a slug, otherwise homepage
  const redirectUrl = data.listing_slug 
    ? `${process.env.NEXT_PUBLIC_SITE_URL || 'https://filipinofoodnearme.org'}/listings/${data.listing_slug}?verified=true&email=${encodeURIComponent(data.email)}&token=${token}`
    : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://filipinofoodnearme.org'}?verified=true&email=${encodeURIComponent(data.email)}&token=${token}`

  return NextResponse.redirect(redirectUrl)
}