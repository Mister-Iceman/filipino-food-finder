import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function sendApprovalEmail(contactEmail: string, contactName: string) {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) return

  await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: {
        name: 'FilipinoFoodNearMe.org',
        email: 'advertise@filipinofoodnearme.org',
      },
      to: [{ email: contactEmail, name: contactName }],
      subject: 'Your ad is approved — going live on FilipinoFoodNearMe.org',
      htmlContent: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:linear-gradient(135deg,#62438D 0%,#92345A 40%,#BF2F26 100%);height:6px;border-radius:6px 6px 0 0;"></div>
          <div style="background:#ffffff;padding:32px 40px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">
            <p style="font-size:13px;font-weight:700;letter-spacing:0.05em;color:#92345A;text-transform:uppercase;margin:0 0 16px 0;">FilipinoFoodNearMe.org</p>
            <h1 style="font-size:22px;font-weight:700;color:#111827;margin:0 0 16px 0;">Your ad is approved! 🎉</h1>
            <p style="font-size:15px;color:#374151;line-height:1.6;margin:0 0 16px 0;">
              Hi ${contactName}, great news! Your featured ad has been approved and will be live within the next few hours.
            </p>
            <p style="font-size:15px;color:#374151;line-height:1.6;margin:0 0 16px 0;">
              Your Founding Advertiser rate is locked in — it stays yours as long as your subscription remains active.
            </p>
            <p style="font-size:15px;color:#374151;line-height:1.6;margin:0 0 24px 0;">
              Thank you for supporting the Filipino food community. Salamat! 🙏
            </p>
            <p style="font-size:15px;color:#374151;margin:0;">— The FilipinoFoodNearMe.org team</p>
          </div>
        </div>
      `,
    }),
  })
}

export async function POST(request: NextRequest) {
  try {
    const { id, status, admin_notes } = await request.json()

    if (!id || !status) {
      return NextResponse.json({ error: 'id and status are required' }, { status: 400 })
    }

    const updateData: Record<string, unknown> = { status, admin_notes: admin_notes || null }

    if (status === 'approved') {
      updateData.approved_at = new Date().toISOString()
      updateData.goes_live_at = new Date().toISOString()
    }

    const { data: submission, error: fetchErr } = await supabase
      .from('ad_submissions')
      .select('contact_email, contact_name')
      .eq('id', id)
      .single()

    if (fetchErr || !submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    const { error } = await supabase
      .from('ad_submissions')
      .update(updateData)
      .eq('id', id)

    if (error) {
      throw new Error(error.message)
    }

    if (status === 'approved' && submission.contact_email) {
      try {
        await sendApprovalEmail(submission.contact_email, submission.contact_name || 'Advertiser')
      } catch (emailErr) {
        console.error('Approval email error (non-fatal):', emailErr)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update status error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update status' },
      { status: 500 }
    )
  }
}
