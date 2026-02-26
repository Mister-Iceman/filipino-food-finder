import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')
  const action = searchParams.get('action') // approve or reject

  if (!token || !action) {
    return new NextResponse('Invalid request', { status: 400 })
  }

  // Find claim by token
  const { data: claim, error } = await supabase
    .from('claims')
    .select('*')
    .eq('token', token)
    .single()

  if (error || !claim) {
    return new NextResponse(renderPage('❌ Invalid or expired link.', 'This claim token was not found.', false), {
      headers: { 'Content-Type': 'text/html' },
    })
  }

  if (claim.status !== 'pending') {
    return new NextResponse(renderPage('Already Processed', `This claim was already ${claim.status}.`, false), {
      headers: { 'Content-Type': 'text/html' },
    })
  }

  if (action === 'approve') {
    // Update claim status
    await supabase
      .from('claims')
      .update({ status: 'approved', reviewed_at: new Date().toISOString() })
      .eq('token', token)

    // Mark listing as claimed
    await supabase
      .from('listings')
      .update({
        is_claimed: true,
        claimed_owner_name: claim.owner_name,
        claimed_at: new Date().toISOString(),
      })
      .eq('id', claim.listing_id)

    // Generate dashboard token and create business_owners record
    const dashboardToken = crypto.randomBytes(32).toString('hex')
    await supabase
      .from('business_owners')
      .insert({
        listing_id: claim.listing_id,
        owner_email: claim.owner_email,
        owner_name: claim.owner_name,
        is_primary: true,
        dashboard_token: dashboardToken,
      })

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://filipinofoodnearme.org'
    const dashboardUrl = `${baseUrl}/owner/dashboard?token=${dashboardToken}`

    // Email the claimant that they're approved + dashboard link
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        sender: { name: 'Filipino Food Near Me', email: 'info@filipinofoodnearme.org' },
        to: [{ email: claim.owner_email, name: claim.owner_name }],
        subject: `🎉 Your listing claim for ${claim.listing_name} is approved!`,
        htmlContent: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #16a34a;">You're now a Verified Owner! 🇵🇭</h2>
            <p>Congratulations, ${claim.owner_name}!</p>
            <p>Your claim for <strong>${claim.listing_name}</strong> has been approved. Your listing now displays a <strong>Verified Owner</strong> badge on FilipinoFoodNearMe.org.</p>
            <p>You can view your listing here:<br>
              <a href="https://filipinofoodnearme.org/listings/${claim.listing_id}" style="color: #62438D;">
                filipinofoodnearme.org/listings/${claim.listing_id}
              </a>
            </p>
            <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <p style="margin: 0 0 8px; font-weight: bold; color: #15803d;">Access Your Owner Dashboard</p>
              <p style="margin: 0 0 16px; color: #374151; font-size: 14px;">Use this private link to verify the dishes you serve and features your business offers:</p>
              <a href="${dashboardUrl}" style="background: #16a34a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
                Open My Owner Dashboard →
              </a>
              <p style="margin: 12px 0 0; color: #6b7280; font-size: 12px;">Save this link — it's your permanent access to your owner dashboard. Do not share it.</p>
            </div>
            <p style="color: #666; font-size: 13px;">
              Maraming salamat for being part of our community!<br>
              — The FilipinoFoodNearMe.org Team 🇵🇭
            </p>
          </div>
        `,
      }),
    })

    return new NextResponse(
      renderPage('✅ Claim Approved!', `${claim.listing_name} is now marked as Community Member. A confirmation email was sent to ${claim.owner_email}.`, true),
      { headers: { 'Content-Type': 'text/html' } }
    )
  }

  if (action === 'reject') {
    await supabase
      .from('claims')
      .update({ status: 'rejected', reviewed_at: new Date().toISOString() })
      .eq('token', token)

    // Notify claimant of rejection
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        sender: { name: 'Filipino Food Near Me', email: 'info@filipinofoodnearme.org' },
        to: [{ email: claim.owner_email, name: claim.owner_name }],
        subject: `Update on your claim for ${claim.listing_name}`,
        htmlContent: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #62438D;">Update on Your Claim</h2>
            <p>Hi ${claim.owner_name},</p>
            <p>Thank you for submitting a claim for <strong>${claim.listing_name}</strong>. After review, we were unable to verify this claim at this time.</p>
            <p>If you believe this is an error, please reply to this email with additional verification (such as a business license, menu, or social media link) and we'll take another look.</p>
            <p style="color: #666; font-size: 13px;">
              — The FilipinoFoodNearMe.org Team 🇵🇭
            </p>
          </div>
        `,
      }),
    })

    return new NextResponse(
      renderPage('❌ Claim Rejected', `The claim for ${claim.listing_name} has been rejected. A notification was sent to ${claim.owner_email}.`, false),
      { headers: { 'Content-Type': 'text/html' } }
    )
  }

  return new NextResponse('Invalid action', { status: 400 })
}

function renderPage(title: string, message: string, success: boolean) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} - FilipinoFoodNearMe Admin</title>
        <meta charset="utf-8">
        <style>
          body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f9fafb; }
          .card { background: white; border-radius: 12px; padding: 48px; max-width: 480px; text-align: center; box-shadow: 0 4px 24px rgba(0,0,0,0.1); }
          h1 { color: ${success ? '#16a34a' : '#dc2626'}; margin-bottom: 16px; }
          p { color: #4b5563; line-height: 1.6; }
          a { color: #62438D; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>${title}</h1>
          <p>${message}</p>
          <p style="margin-top: 24px;"><a href="https://filipinofoodnearme.org">← Back to FilipinoFoodNearMe.org</a></p>
        </div>
      </body>
    </html>
  `
}