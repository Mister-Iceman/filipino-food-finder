import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { submissionId, is_pickup_only } = await request.json()
    console.log('🔍 Approving submission:', submissionId)

    const { data: submission, error: fetchError } = await supabase
      .from('business_submissions')
      .select('*')
      .eq('id', submissionId)
      .single()

    if (fetchError) {
      console.error('❌ Fetch error:', fetchError)
      throw new Error('Submission not found: ' + fetchError.message)
    }

    if (!submission) throw new Error('Submission not found')

    console.log('✅ Found submission:', submission.business_name)

    const slug = submission.business_name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      + '-' + submission.city.toLowerCase().replace(/[^a-z0-9]+/g, '-')

    console.log('📝 Created slug:', slug)

    const { error: insertError } = await supabase
      .from('listings')
      .insert([{
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
        description: submission.description,
        is_pickup_only: is_pickup_only ?? false
      }])

    if (insertError) {
      console.error('❌ Insert error:', insertError)
      throw new Error('Failed to add to listings: ' + insertError.message)
    }

    console.log('✅ Added to listings table')

    const { error: updateError } = await supabase
      .from('business_submissions')
      .update({ status: 'approved', reviewed_at: new Date().toISOString() })
      .eq('id', submissionId)

    if (updateError) {
      console.error('❌ Update error:', updateError)
      throw new Error('Failed to update status: ' + updateError.message)
    }

    console.log('✅ Updated submission status')

    try {
      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': process.env.BREVO_API_KEY || '',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: 'Filipino Food Near Me', email: 'info@filipinofoodnearme.org' },
          to: [{ email: submission.contact_email, name: submission.business_name }],
          subject: '🎉 Your Business is Now Listed!',
          htmlContent: `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 16px;"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);"><tr><td style="background:linear-gradient(90deg,#62438D,#92345A,#BF2F26,#CB5B16,#D1880D);height:6px;"></td></tr><tr><td style="padding:32px 40px 0 40px;"><p style="margin:0;font-size:13px;font-weight:700;letter-spacing:0.05em;color:#92345A;text-transform:uppercase;">FilipinoFoodNearMe.org</p></td></tr><tr><td style="padding:24px 40px 32px 40px;"><h1 style="margin:0 0 8px 0;font-size:24px;font-weight:700;color:#111827;">Your listing is now live! 🎉</h1><p style="margin:0 0 24px 0;font-size:15px;color:#6b7280;">Congratulations! <strong style="color:#111827;">${submission.business_name}</strong> has been approved and is now live on FilipinoFoodNearMe.org.</p><table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;margin:0 0 24px 0;"><tr><td style="padding:20px 24px;"><p style="margin:0 0 8px 0;font-size:13px;color:#16a34a;font-weight:700;text-transform:uppercase;">Now Live</p><p style="margin:0 0 12px 0;font-size:18px;font-weight:700;color:#111827;">${submission.business_name}</p><p style="margin:0;"><a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://filipinofoodnearme.org'}/listings/${slug}" style="background:linear-gradient(90deg,#62438D,#92345A);color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:700;font-size:14px;">View Your Listing →</a></p></td></tr></table><p style="margin:0 0 16px 0;font-size:15px;color:#374151;line-height:1.6;">Thank you for joining the first community-powered Filipino food directory in America. Salamat! 🙏</p><p style="margin:0;font-size:14px;color:#6b7280;">Need to update your info? Just reply to this email.</p></td></tr><tr><td style="padding:24px 40px;border-top:1px solid #f3f4f6;background:#f9fafb;"><p style="margin:0 0 4px 0;font-size:12px;font-weight:700;color:#92345A;">FilipinoFoodNearMe.org</p><p style="margin:0;font-size:12px;color:#9ca3af;">Community-powered Filipino food directory across America</p></td></tr><tr><td style="background:linear-gradient(90deg,#62438D,#92345A,#BF2F26,#CB5B16,#D1880D);height:4px;"></td></tr></table></td></tr></table></body></html>`
        })
      })
      console.log('✅ Email sent')
    } catch (emailError) {
      console.error('⚠️ Email error (non-fatal):', emailError)
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('💥 APPROVAL ERROR:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to approve submission' },
      { status: 500 }
    )
  }
}
