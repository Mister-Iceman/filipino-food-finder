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
      .from('business_submissions')
      .select('*')
      .eq('id', submissionId)
      .single()

    if (!submission) {
      throw new Error('Submission not found')
    }

    await supabase
      .from('business_submissions')
      .update({
        status: 'rejected',
        reviewed_at: new Date().toISOString()
      })
      .eq('id', submissionId)

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
        subject: `Update on Your Submission — ${submission.business_name}`,
        htmlContent: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/></head><body style="margin:0;padding:0;background-color:#f9fafb;font-family:Arial,Helvetica,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;padding:40px 16px;"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);"><tr><td style="background:linear-gradient(90deg,#62438D,#92345A,#BF2F26,#CB5B16,#D1880D);height:6px;"></td></tr><tr><td style="padding:32px 40px 0 40px;"><p style="margin:0;font-size:13px;font-weight:700;letter-spacing:0.05em;color:#92345A;text-transform:uppercase;">FilipinoFoodNearMe.org</p></td></tr><tr><td style="padding:24px 40px 32px 40px;"><h1 style="margin:0 0 8px 0;font-size:24px;font-weight:700;color:#111827;">Thank you for your submission</h1><p style="margin:0 0 24px 0;font-size:15px;color:#6b7280;">We appreciate you taking the time to submit <strong style="color:#111827;">${submission.business_name}</strong> to our community directory.</p><p style="margin:0 0 16px 0;font-size:15px;color:#374151;line-height:1.6;">After careful review, we are unable to approve this listing at this time. FilipinoFoodNearMe.org is a directory focused specifically on businesses that serve Filipino food or carry Filipino food products — and based on the information provided, this listing may not meet that threshold right now.</p><table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fdf4ff;border:1px solid #e9d5ff;border-radius:8px;margin:0 0 24px 0;"><tr><td style="padding:20px 24px;"><p style="margin:0 0 12px 0;font-size:14px;font-weight:700;color:#6b21a8;">Our Listing Criteria</p><p style="margin:0 0 8px 0;font-size:14px;color:#374151;line-height:1.6;">To be listed, a business generally needs to meet all of the following:</p><ul style="margin:0;padding-left:20px;font-size:14px;color:#374151;line-height:1.8;"><li>Filipino cuisine makes up a meaningful part of the regular menu</li><li>The business carries Filipino food products or ingredients</li><li>There is a clearly promoted Filipino food item available consistently</li><li>The business has a physical, publicly accessible location (restaurant, store, market stall, or food truck) — home-based businesses, online-only food sellers, and catering operations with no public storefront are not eligible</li></ul><p style="margin:12px 0 0 0;font-size:13px;color:#7c3aed;"><a href="https://www.filipinofoodnearme.org/listing-policy" style="color:#7c3aed;text-decoration:underline;">Read our full listing policy</a></p></td></tr></table><p style="margin:0 0 16px 0;font-size:15px;color:#374151;line-height:1.6;">Common reasons a submission may not be approved:</p><ul style="margin:0 0 24px 0;padding-left:20px;font-size:14px;color:#374151;line-height:1.8;"><li>The menu does not include Filipino dishes or Filipino food products</li><li>Filipino items are very limited or only offered occasionally</li><li>The business is home-based, online-only, or has no public storefront customers can visit</li><li>The business appears to be temporarily or permanently closed</li><li>The information provided needs clarification</li></ul><table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fffbeb;border:1px solid #fde68a;border-radius:8px;margin:0 0 24px 0;"><tr><td style="padding:20px 24px;"><p style="margin:0 0 8px 0;font-size:14px;font-weight:700;color:#92400e;">Think this was a mistake?</p><p style="margin:0;font-size:14px;color:#374151;line-height:1.6;">If your menu has changed, if you carry Filipino food products, or if you would like to provide more details about your Filipino food offerings — just reply to this email. We are happy to take another look.</p></td></tr></table><p style="margin:0 0 4px 0;font-size:15px;color:#374151;line-height:1.6;">Salamat for being part of the community. We hope to see you in the directory soon.</p></td></tr><tr><td style="padding:24px 40px;border-top:1px solid #f3f4f6;background-color:#f9fafb;"><p style="margin:0 0 4px 0;font-size:12px;font-weight:700;color:#92345A;">FilipinoFoodNearMe.org</p><p style="margin:0 0 8px 0;font-size:12px;color:#9ca3af;">Community-powered Filipino food directory across all 50 states</p><p style="margin:0;font-size:12px;color:#9ca3af;">Questions? Reply to this email or visit <a href="https://www.filipinofoodnearme.org/contact" style="color:#92345A;text-decoration:none;">filipinofoodnearme.org/contact</a></p></td></tr><tr><td style="background:linear-gradient(90deg,#62438D,#92345A,#BF2F26,#CB5B16,#D1880D);height:4px;"></td></tr></table></td></tr></table></body></html>`
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Rejection error:', error)
    return NextResponse.json({ error: 'Failed to reject submission' }, { status: 500 })
  }
}
