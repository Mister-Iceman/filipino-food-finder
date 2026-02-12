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
    const { data: submission } = await supabase
      .from('business_submissions')
      .select('*')
      .eq('id', submissionId)
      .single()

    if (!submission) {
      throw new Error('Submission not found')
    }

    // Update status
    await supabase
      .from('business_submissions')
      .update({
        status: 'rejected',
        reviewed_at: new Date().toISOString()
      })
      .eq('id', submissionId)

    // Send rejection email
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
        subject: `Update on Your Business Submission`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #6b7280;">Thank you for your submission</h2>
            
            <p>Thank you for submitting <strong>${submission.business_name}</strong> to Filipino Food Near Me.</p>

            <p>After review, we're unable to approve this listing at this time. This may be because:</p>
            <ul>
              <li>The business doesn't primarily serve Filipino food</li>
              <li>The information provided needs clarification</li>
              <li>The business appears to be permanently closed</li>
            </ul>

            <p>If you believe this was an error or would like to provide additional information, please reply to this email.</p>

            <p style="color: #6b7280; font-size: 12px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
              Filipino Food Near Me
            </p>
          </div>
        `
      })
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Rejection error:', error)
    return NextResponse.json(
      { error: 'Failed to reject submission' },
      { status: 500 }
    )
  }
}