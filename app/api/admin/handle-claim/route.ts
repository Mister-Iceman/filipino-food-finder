import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PUT(request: NextRequest) {
  try {
    const { claimId, action } = await request.json()

    if (!claimId || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const { data: claim, error: fetchError } = await supabase
      .from('listing_claims')
      .select('*')
      .eq('id', claimId)
      .single()

    if (fetchError || !claim) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 })
    }

    const { error: updateError } = await supabase
      .from('listing_claims')
      .update({ status: action === 'approve' ? 'approved' : 'rejected' })
      .eq('id', claimId)

    if (updateError) {
      console.error('[handle-claim] update error:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    const emailSubject = action === 'approve'
      ? `Your claim for ${claim.listing_name} has been approved! 🎉`
      : `Update on your claim for ${claim.listing_name}`

    const emailHtml = action === 'approve'
      ? `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Your Claim is Approved! 🇵🇭</h2>
          <p>Congratulations, ${claim.claimant_name}!</p>
          <p>Your claim for <strong>${claim.listing_name}</strong> has been verified and your listing is now marked as owner-claimed on FilipinoFoodNearMe.org.</p>
          <p>If you'd like to update your listing info, reply to this email and we'll help you out.</p>
          <p style="color: #666; font-size: 13px; margin-top: 24px;">
            Maraming salamat for being part of our community!<br>
            — The FilipinoFoodNearMe.org Team 🇵🇭
          </p>
        </div>
      `
      : `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #62438D;">Update on Your Claim</h2>
          <p>Hi ${claim.claimant_name},</p>
          <p>Thank you for submitting a claim for <strong>${claim.listing_name}</strong>. After review, we were unable to verify this claim at this time.</p>
          <p>If you believe this is an error, please reply to this email with additional verification (such as a business license, menu, or social media link) and we'll take another look.</p>
          <p style="color: #666; font-size: 13px; margin-top: 24px;">
            — The FilipinoFoodNearMe.org Team 🇵🇭
          </p>
        </div>
      `

    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        sender: { name: 'Filipino Food Near Me', email: 'info@filipinofoodnearme.org' },
        to: [{ email: claim.claimant_email, name: claim.claimant_name }],
        subject: emailSubject,
        htmlContent: emailHtml,
      }),
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[handle-claim] error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
