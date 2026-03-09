import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import * as brevo from '@getbrevo/brevo'

const OK = NextResponse.json({ success: true })

export async function POST(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  let body: { email?: string; listingSlug?: string }
  try {
    body = await request.json()
  } catch {
    return OK // never leak errors
  }

  const { email, listingSlug } = body
  if (!email || !email.includes('@') || !listingSlug) return OK

  // Find listing by slug
  const { data: listing } = await supabase
    .from('listings')
    .select('id, name, slug')
    .eq('slug', listingSlug.toLowerCase().trim())
    .single()

  if (!listing) return OK

  // Check for an approved claim matching this listing + email
  const { data: claim } = await supabase
    .from('claim_requests')
    .select('id')
    .eq('claimant_email', email)
    .eq('listing_name', listing.name)
    .eq('status', 'approved')
    .limit(1)
    .maybeSingle()

  if (!claim) return OK

  // Generate token + store session
  const token = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

  const { error: insertError } = await supabase.from('owner_sessions').insert({
    email,
    listing_slug: listingSlug.toLowerCase().trim(),
    token,
    expires_at: expiresAt.toISOString(),
  })

  if (insertError) return OK

  // Send magic link via Brevo
  const magicLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://filipinofoodnearme.org'}/owner/dashboard?token=${token}`

  try {
    const apiInstance = new brevo.TransactionalEmailsApi()
    apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY!)

    const sendSmtpEmail = new brevo.SendSmtpEmail()
    sendSmtpEmail.to = [{ email }]
    sendSmtpEmail.sender = { email: 'info@filipinofoodnearme.org', name: 'Filipino Food Near Me' }
    sendSmtpEmail.subject = 'Your FilipinoFoodNearMe.org Owner Access Link'
    sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #0038A8 0%, #002a80 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🇵🇭 Filipino Food Near Me</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #0038A8; margin-top: 0;">Your Owner Access Link</h2>
          <p style="font-size: 16px;">Click the button below to access your owner dashboard for <strong>${listing.name}</strong>.</p>
          <p style="font-size: 14px; color: #666;">This link expires in 24 hours and can only be used once.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${magicLink}"
               style="background: #0038A8; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-size: 18px; font-weight: bold; display: inline-block;">
              Access My Dashboard
            </a>
          </div>
          <p style="font-size: 14px; color: #666;">Or copy and paste this link into your browser:</p>
          <p style="font-size: 12px; color: #999; word-break: break-all;">${magicLink}</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="font-size: 12px; color: #999;">If you didn't request this link, you can safely ignore this email.</p>
          <p style="font-size: 12px; color: #999; text-align: center; margin-top: 20px;">
            Filipino Food Near Me — Supporting our community, one listing at a time<br>
            <a href="https://filipinofoodnearme.org" style="color: #0038A8;">filipinofoodnearme.org</a>
          </p>
        </div>
      </body>
      </html>
    `
    await apiInstance.sendTransacEmail(sendSmtpEmail)
  } catch {
    // fail silently — always return OK
  }

  return OK
}
