import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { listing_id, listing_name, listing_city, listing_state, owner_name, owner_role, owner_email, message } = await req.json()

  if (!listing_id || !owner_name || !owner_email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Check if listing is already claimed
  const { data: listing } = await supabase
    .from('listings')
    .select('is_claimed, name')
    .eq('id', listing_id)
    .single()

  if (listing?.is_claimed) {
    return NextResponse.json({ error: 'This listing has already been claimed' }, { status: 400 })
  }

  // Check for existing pending claim
  const { data: existingClaim } = await supabase
    .from('claims')
    .select('id')
    .eq('listing_id', listing_id)
    .eq('status', 'pending')
    .single()

  if (existingClaim) {
    return NextResponse.json({ error: 'A claim for this listing is already pending review' }, { status: 400 })
  }

  // Generate unique approval token
  const token = crypto.randomBytes(32).toString('hex')

  // Save claim to Supabase
  const { error: insertError } = await supabase
    .from('claims')
    .insert({
      listing_id,
      listing_name,
      listing_city,
      listing_state,
      owner_name,
      owner_role,
      owner_email,
      message,
      token,
      status: 'pending',
    })

  if (insertError) {
    return NextResponse.json({ error: 'Failed to submit claim' }, { status: 500 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://filipinofoodnearme.org'
  const approveUrl = `${baseUrl}/api/approve-claim?token=${token}&action=approve`
  const rejectUrl = `${baseUrl}/api/approve-claim?token=${token}&action=reject`

  // Email admin (you) for review
  await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY!,
    },
    body: JSON.stringify({
      sender: { name: 'FilipinoFoodNearMe', email: 'info@filipinofoodnearme.org' },
      to: [{ email: 'info@filipinofoodnearme.org' }],
      subject: `🏪 New Listing Claim: ${listing_name}`,
      htmlContent: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #62438D;">New Listing Claim Request</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 140px;">Business</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${listing_name}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Location</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${listing_city}, ${listing_state}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Owner Name</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${owner_name}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Role</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${owner_role || 'Not specified'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${owner_email}</td></tr>
            ${message ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Message</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${message}</td></tr>` : ''}
          </table>

          <div style="display: flex; gap: 16px; margin-bottom: 24px;">
            <a href="${approveUrl}" style="background: #16a34a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; margin-right: 12px;">
              ✅ Approve Claim
            </a>
            <a href="${rejectUrl}" style="background: #dc2626; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
              ❌ Reject Claim
            </a>
          </div>

          <p style="color: #666; font-size: 13px;">
            This claim was submitted via FilipinoFoodNearMe.org. 
            Approving will add a "Community Member" badge to the listing.
          </p>
        </div>
      `,
    }),
  })

  // Confirmation email to claimant
  await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY!,
    },
    body: JSON.stringify({
      sender: { name: 'Filipino Food Near Me', email: 'info@filipinofoodnearme.org' },
      to: [{ email: owner_email, name: owner_name }],
      subject: `We received your claim for ${listing_name} 🇵🇭`,
      htmlContent: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #62438D;">Salamat, ${owner_name}!</h2>
          <p>We received your claim request for <strong>${listing_name}</strong> in ${listing_city}, ${listing_state}.</p>
          <p>Our team will review it within <strong>2-3 business days</strong>. Once approved, your listing will display a Community Member badge.</p>
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
}