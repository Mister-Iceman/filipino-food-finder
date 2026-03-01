import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { listing_id, listing_name, claimant_name, claimant_email, claimant_phone, claimant_message } = body

    if (!listing_id || !listing_name || !claimant_name || !claimant_email || !claimant_phone || !claimant_message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    // Rate limit: max 3 submissions per email per 24 hours
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { count } = await supabase
      .from('listing_claims')
      .select('id', { count: 'exact', head: true })
      .eq('claimant_email', claimant_email.toLowerCase())
      .gte('created_at', since)

    if ((count ?? 0) >= 3) {
      return NextResponse.json({ error: 'Too many claim requests. Please try again tomorrow.' }, { status: 429 })
    }

    const { error: insertError } = await supabase
      .from('listing_claims')
      .insert({
        listing_id,
        listing_name,
        claimant_name,
        claimant_email: claimant_email.toLowerCase(),
        claimant_phone,
        claimant_message,
        status: 'pending',
      })

    if (insertError) {
      console.error('Claim insert error:', insertError)
      return NextResponse.json({ error: 'Failed to submit claim. Please try again.' }, { status: 500 })
    }

    // Notify admin
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        sender: { name: 'FilipinoFoodNearMe', email: 'info@filipinofoodnearme.org' },
        to: [{ email: 'info@filipinofoodnearme.org' }],
        subject: `🏪 New Business Claim: ${listing_name}`,
        htmlContent: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #62438D;">New Business Claim Submitted</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 160px;">Business</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${listing_name}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Name</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${claimant_name}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${claimant_email}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Phone</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${claimant_phone}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Message</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${claimant_message}</td></tr>
            </table>
            <div style="background: #fff8e1; border-left: 4px solid #f59e0b; padding: 12px 16px; margin-bottom: 16px; border-radius: 4px;">
              <p style="margin: 0; font-size: 13px; font-weight: bold; color: #92400e;">⚠️ VERIFICATION REMINDER</p>
              <p style="margin: 6px 0 0; font-size: 13px; color: #78350f;">Before approving, ask the claimant to email from their business email address or send a Google Business Profile dashboard screenshot to verify ownership.</p>
            </div>
            <p style="color: #666; font-size: 13px;">
              Review this claim in the <a href="https://filipinofoodnearme.org/admin" style="color: #62438D;">Admin Dashboard</a>.
            </p>
          </div>
        `,
      }),
    })

    // Confirmation to claimant
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        sender: { name: 'Filipino Food Near Me', email: 'info@filipinofoodnearme.org' },
        to: [{ email: claimant_email, name: claimant_name }],
        subject: `We received your claim for ${listing_name} 🇵🇭`,
        htmlContent: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #62438D;">Salamat, ${claimant_name}!</h2>
            <p>We received your claim request for <strong>${listing_name}</strong>.</p>
            <p>Our team will review it within <strong>2–3 business days</strong>. We'll email you once a decision is made.</p>
            <p>If you have questions, reply to this email or contact us at info@filipinofoodnearme.org.</p>
            <p style="color: #666; font-size: 13px; margin-top: 24px;">
              — The FilipinoFoodNearMe.org Team<br>
              Bayanihan, one bite at a time. 🇵🇭
            </p>
          </div>
        `,
      }),
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Claim submission error:', err)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}
