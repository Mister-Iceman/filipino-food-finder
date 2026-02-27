import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { org_name, website, contact_email, description, category } = await req.json()

    if (!org_name?.trim() || !contact_email?.trim()) {
      return NextResponse.json({ error: 'Organization name and contact email are required.' }, { status: 400 })
    }

    const { error: dbError } = await supabase.from('community_partners').insert({
      org_name: org_name.trim(),
      website: website?.trim() || null,
      contact_email: contact_email.trim(),
      description: description?.trim() || null,
      category: category || 'Organization',
      status: 'pending',
    })

    if (dbError) {
      console.error('Partner inquiry DB error:', dbError)
      return NextResponse.json({ error: 'Failed to save inquiry.' }, { status: 500 })
    }

    // Notify admin via Brevo
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        sender: { name: 'Filipino Food Near Me', email: 'info@filipinofoodnearme.org' },
        to: [{ email: 'info@filipinofoodnearme.org', name: 'Admin' }],
        subject: `New Community Partner Inquiry: ${org_name.trim()}`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #62438D;">New Community Partner Inquiry</h2>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Organization:</strong> ${org_name.trim()}</p>
              <p><strong>Category:</strong> ${category || 'Organization'}</p>
              ${website ? `<p><strong>Website:</strong> <a href="${website.trim()}">${website.trim()}</a></p>` : ''}
              <p><strong>Contact Email:</strong> ${contact_email.trim()}</p>
              ${description ? `<p><strong>Description:</strong> ${description.trim()}</p>` : ''}
            </div>
            <p>
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://filipinofoodnearme.org'}/admin"
                 style="background-color: #62438D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Review in Admin
              </a>
            </p>
          </div>
        `,
      }),
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Partner inquiry error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
