import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkRateLimit, getIP } from '@/lib/rate-limit'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const ip = getIP(request)
  const { allowed } = checkRateLimit(ip)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many submissions. Please wait before trying again.' },
      { status: 429 }
    )
  }

  try {
    const body = await request.json()

    const { error: insertError } = await supabase
      .from('event_submissions')
      .insert([{ ...body, status: 'pending' }])

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY || '',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'Filipino Food Near Me', email: 'info@filipinofoodnearme.org' },
        to: [{ email: body.submitter_email, name: body.submitter_name }],
        subject: `We received your event: ${body.title}`,
        htmlContent: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/></head><body style="margin:0;padding:0;background-color:#f9fafb;font-family:Arial,Helvetica,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;padding:40px 16px;"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);"><tr><td style="background:linear-gradient(90deg,#62438D,#92345A,#BF2F26,#CB5B16,#D1880D);height:6px;"></td></tr><tr><td style="padding:32px 40px 0 40px;"><p style="margin:0;font-size:13px;font-weight:700;letter-spacing:0.05em;color:#92345A;text-transform:uppercase;">FilipinoFoodNearMe.org</p></td></tr><tr><td style="padding:24px 40px 32px 40px;"><h1 style="margin:0 0 8px 0;font-size:24px;font-weight:700;color:#111827;">We got your event submission!</h1><p style="margin:0 0 24px 0;font-size:15px;color:#6b7280;">Hi ${body.submitter_name}, salamat for submitting to our community events calendar.</p><table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f3ff;border:1px solid #e9d5ff;border-radius:8px;margin:0 0 24px 0;"><tr><td style="padding:20px 24px;"><p style="margin:0 0 4px 0;font-size:13px;color:#7c3aed;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">Event Submitted</p><p style="margin:0 0 12px 0;font-size:20px;font-weight:700;color:#111827;">${body.title}</p><p style="margin:0;font-size:14px;color:#374151;">${body.city}, ${body.state} &nbsp;·&nbsp; ${body.event_date}</p></td></tr></table><p style="margin:0 0 16px 0;font-size:15px;color:#374151;line-height:1.6;">Our team will review your submission and you will hear back within <strong>3–5 business days</strong>. If approved, your event will appear on the FilipinoFoodNearMe.org events calendar.</p><p style="margin:0 0 24px 0;font-size:15px;color:#374151;line-height:1.6;">If we have any questions or need more details, we will reply to this email directly.</p><p style="margin:0;font-size:15px;color:#374151;">Salamat for helping build the community! 🙏</p></td></tr><tr><td style="padding:24px 40px;border-top:1px solid #f3f4f6;background-color:#f9fafb;"><p style="margin:0 0 4px 0;font-size:12px;font-weight:700;color:#92345A;">FilipinoFoodNearMe.org</p><p style="margin:0 0 8px 0;font-size:12px;color:#9ca3af;">Community-powered Filipino food directory across all 50 states</p><p style="margin:0;font-size:12px;color:#9ca3af;">Questions? Reply to this email or visit <a href="https://www.filipinofoodnearme.org/contact" style="color:#92345A;text-decoration:none;">filipinofoodnearme.org/contact</a></p></td></tr><tr><td style="background:linear-gradient(90deg,#62438D,#92345A,#BF2F26,#CB5B16,#D1880D);height:4px;"></td></tr></table></td></tr></table></body></html>`
      })
    })

    // Send internal notification to admin
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY || '',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'Filipino Food Near Me', email: 'info@filipinofoodnearme.org' },
        to: [{ email: 'info@filipinofoodnearme.org', name: 'Admin' }],
        subject: 'New Event Submission: ' + body.title,
        htmlContent: '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;"><h2 style="color:#92345A;">New Event Submission</h2><p><strong>Title:</strong> ' + body.title + '</p><p><strong>Category:</strong> ' + body.category + '</p><p><strong>Date:</strong> ' + body.event_date + '</p><p><strong>Location:</strong> ' + body.city + ', ' + body.state + '</p><p><strong>Submitted by:</strong> ' + body.submitter_name + ' (' + body.submitter_email + ')</p>' + (body.description ? '<p><strong>Description:</strong> ' + body.description + '</p>' : '') + '<br><a href="https://filipinofoodnearme.org/admin/events" style="background:#92345A;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:bold;">Go to Admin Panel</a></div>'
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Event submission error:', error)
    return NextResponse.json({ error: 'Failed to submit event' }, { status: 500 })
  }
}


