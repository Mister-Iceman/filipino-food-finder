import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { submissionId } = await request.json()

    const { data: submission } = await supabase
      .from('event_submissions')
      .select('*')
      .eq('id', submissionId)
      .single()

    if (!submission) throw new Error('Submission not found')

    await supabase
      .from('event_submissions')
      .update({ status: 'approved', reviewed_at: new Date().toISOString() })
      .eq('id', submissionId)

    await supabase.from('events').insert([{
      title: submission.title,
      description: submission.description,
      event_date: submission.event_date,
      event_time: submission.event_time,
      location_name: submission.location_name,
      address_street: submission.address_street,
      city: submission.city,
      state: submission.state,
      zip: submission.zip,
      event_url: submission.event_url,
      category: submission.category,
      status: 'published'
    }])

    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY || '',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'Filipino Food Near Me', email: 'info@filipinofoodnearme.org' },
        to: [{ email: submission.submitter_email, name: submission.submitter_name }],
        subject: `Your event is live: ${submission.title}`,
        htmlContent: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/></head><body style="margin:0;padding:0;background-color:#f9fafb;font-family:Arial,Helvetica,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;padding:40px 16px;"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);"><tr><td style="background:linear-gradient(90deg,#62438D,#92345A,#BF2F26,#CB5B16,#D1880D);height:6px;"></td></tr><tr><td style="padding:32px 40px 0 40px;"><p style="margin:0;font-size:13px;font-weight:700;letter-spacing:0.05em;color:#92345A;text-transform:uppercase;">FilipinoFoodNearMe.org</p></td></tr><tr><td style="padding:24px 40px 32px 40px;"><h1 style="margin:0 0 8px 0;font-size:24px;font-weight:700;color:#111827;">Your event is now live! 🎉</h1><p style="margin:0 0 24px 0;font-size:15px;color:#6b7280;">Hi ${submission.submitter_name}, your event has been approved and is now live on our community calendar.</p><table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;margin:0 0 24px 0;"><tr><td style="padding:20px 24px;"><p style="margin:0 0 4px 0;font-size:13px;color:#16a34a;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">Now Live</p><p style="margin:0 0 12px 0;font-size:20px;font-weight:700;color:#111827;">${submission.title}</p><p style="margin:0;font-size:14px;color:#374151;">${submission.city}, ${submission.state} &nbsp;·&nbsp; ${submission.event_date}</p></td></tr></table><p style="margin:0 0 16px 0;font-size:15px;color:#374151;line-height:1.6;">Share the events page with your community so they can discover your event:</p><p style="margin:0 0 24px 0;"><a href="https://www.filipinofoodnearme.org/events" style="background:linear-gradient(90deg,#62438D,#92345A);color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">View Events Calendar →</a></p><p style="margin:0;font-size:15px;color:#374151;">Salamat for sharing with the community! 🙏</p></td></tr><tr><td style="padding:24px 40px;border-top:1px solid #f3f4f6;background-color:#f9fafb;"><p style="margin:0 0 4px 0;font-size:12px;font-weight:700;color:#92345A;">FilipinoFoodNearMe.org</p><p style="margin:0 0 8px 0;font-size:12px;color:#9ca3af;">Community-powered Filipino food directory across America</p></td></tr><tr><td style="background:linear-gradient(90deg,#62438D,#92345A,#BF2F26,#CB5B16,#D1880D);height:4px;"></td></tr></table></td></tr></table></body></html>`
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Event approval error:', error)
    return NextResponse.json({ error: 'Failed to approve event submission' }, { status: 500 })
  }
}
