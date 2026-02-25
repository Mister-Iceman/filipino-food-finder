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
    const formData = await request.json()

    // Validate required fields
    if (!formData.businessName || !formData.contactEmail || !formData.phone || !formData.address) {
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
          business_name: formData.businessName,
          category_primary: formData.categoryPrimary,
          category_secondary: formData.categorySecondary || null,
          address_street: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          phone: formData.phone,
          website: formData.website || null,
          instagram_url: formData.instagram || null,
          facebook_url: formData.facebook || null,
          tiktok_url: formData.tiktok || null,
          x_url: formData.x || null,
          google_maps_url: formData.googleMaps || null,
          hours: formData.hours || null,
          description: formData.description || null,
          contact_email: formData.contactEmail,
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
        subject: `🆕 New Business Submission: ${formData.businessName}`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">New Business Submission</h2>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Business:</strong> ${formData.businessName}</p>
              <p><strong>Category:</strong> ${formData.categoryPrimary}</p>
              <p><strong>Location:</strong> ${formData.city}, ${formData.state}</p>
              <p><strong>Contact:</strong> ${formData.contactEmail}</p>
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