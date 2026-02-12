import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { submissionId } = await request.json()

    // Get submission
    const { data: submission, error: fetchError } = await supabase
      .from('business_submissions')
      .select('*')
      .eq('id', submissionId)
      .single()

    if (fetchError || !submission) {
      throw new Error('Submission not found')
    }

    // Create slug
    const slug = submission.business_name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      + '-' + submission.city.toLowerCase().replace(/[^a-z0-9]+/g, '-')

    // Add to listings table
    const { error: insertError } = await supabase
      .from('listings')
      .insert([
        {
          name: submission.business_name,
          slug: slug,
          category_primary: submission.category_primary,
          category_secondary: submission.category_secondary,
          address_street: submission.address_street,
          city: submission.city,
          state: submission.state,
          zip: submission.zip,
          phone: submission.phone,
          website: submission.website,
          instagram_url: submission.instagram_url,
          facebook_url: submission.facebook_url,
          tiktok_url: submission.tiktok_url,
          x_url: submission.x_url,
          google_maps_url: submission.google_maps_url,
          hours: submission.hours,
          description: submission.description
        }
      ])

    if (insertError) {
      console.error('Insert error:', insertError)
      throw new Error('Failed to add to listings')
    }

    // Update submission status
    await supabase
      .from('business_submissions')
      .update({
        status: 'approved',
        reviewed_at: new Date().toISOString()
      })
      .eq('id', submissionId)

    // Send approval email
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
            email: submission.contact_email,
            name: submission.business_name
          }
        ],
        subject: `🎉 Your Business is Now Listed!`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #10b981;">Congratulations!</h2>
            
            <p>Great news! <strong>${submission.business_name}</strong> has been approved and is now live on Filipino Food Near Me!</p>

            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Your listing is now visible at:</strong></p>
              <p style="margin: 10px 0 0 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://filipinofoodnearme.org'}/listings/${slug}" 
                   style="color: #2563eb; font-weight: bold;">
                  View Your Listing
                </a>
              </p>
            </div>

            <p>Thank you for joining the first and only community Filipino food directory in America!</p>

            <p style="margin-top: 30px;">
              Need to update your information? Just reply to this email.
            </p>

            <p style="color: #6b7280; font-size: 12px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
              Filipino Food Near Me<br>
              Building community, one restaurant at a time
            </p>
          </div>
        `
      })
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Approval error:', error)
    return NextResponse.json(
      { error: 'Failed to approve submission' },
      { status: 500 }
    )
  }
}