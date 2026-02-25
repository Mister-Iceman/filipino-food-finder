import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkRateLimit, getIP } from '@/lib/rate-limit'
import { cleanText, cleanUrl } from '@/lib/sanitize'

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
    const formData = await request.json()

    // Honeypot check — real users never see or fill this field
    if (formData.website_confirm) {
      return NextResponse.json({ success: true })
    }

    // Sanitize all user-supplied fields before validation, DB writes, or emails
    const clean = {
      businessName:      cleanText(formData.businessName),
      categoryPrimary:   cleanText(formData.categoryPrimary),
      categorySecondary: cleanText(formData.categorySecondary),
      address:           cleanText(formData.address),
      city:              cleanText(formData.city),
      state:             cleanText(formData.state),
      zip:               cleanText(formData.zip),
      phone:             cleanText(formData.phone),
      hours:             cleanText(formData.hours),
      description:       cleanText(formData.description),
      contactEmail:      cleanText(formData.contactEmail),
      // URL fields: invalid / non-http(s) values are silently stripped to null
      website:    cleanUrl(formData.website)    || null,
      instagram:  cleanUrl(formData.instagram)  || null,
      facebook:   cleanUrl(formData.facebook)   || null,
      tiktok:     cleanUrl(formData.tiktok)     || null,
      x:          cleanUrl(formData.x)          || null,
      googleMaps: cleanUrl(formData.googleMaps) || null,
    }

    // Validate required fields
    if (!clean.businessName || !clean.contactEmail || !clean.phone || !clean.address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Save to database
    const { data: submission, error: dbError } = await supabase
      .from('business_submissions')
      .insert([
        {
          business_name: clean.businessName,
          category_primary: clean.categoryPrimary,
          category_secondary: clean.categorySecondary || null,
          address_street: clean.address,
          city: clean.city,
          state: clean.state,
          zip: clean.zip,
          phone: clean.phone,
          website: clean.website,
          instagram_url: clean.instagram,
          facebook_url: clean.facebook,
          tiktok_url: clean.tiktok,
          x_url: clean.x,
          google_maps_url: clean.googleMaps,
          hours: clean.hours || null,
          description: clean.description || null,
          contact_email: clean.contactEmail,
          status: 'pending'
        }
      ])
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      throw new Error('Failed to save submission')
    }

    // Send notification email to admin
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY || '',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'Filipino Food Near Me',
          email: 'info@filipinofoodnearme.org'
        },
        to: [
          {
            email: 'info@filipinofoodnearme.org',
            name: 'Admin'
          }
        ],
        subject: `🆕 New Business Submission: ${clean.businessName}`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">New Business Submission</h2>

            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Business:</strong> ${clean.businessName}</p>
              <p><strong>Category:</strong> ${clean.categoryPrimary}</p>
              <p><strong>Location:</strong> ${clean.city}, ${clean.state}</p>
              <p><strong>Contact:</strong> ${clean.contactEmail}</p>
            </div>

            <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Review this submission:</strong></p>
              <p style="margin: 10px 0 0 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://filipinofoodnearme.org'}/admin/submissions" 
                   style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  Go to Admin Panel
                </a>
              </p>
            </div>

            <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
              Submission ID: ${submission.id}
            </p>
          </div>
        `
      })
    })

    return NextResponse.json({ 
      success: true,
      message: 'Business submission received successfully' 
    })

  } catch (error) {
    console.error('Business submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit business. Please try again.' },
      { status: 500 }
    )
  }
}