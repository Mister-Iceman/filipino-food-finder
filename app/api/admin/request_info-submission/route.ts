import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { submissionId, message } = await request.json()

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
        status: 'info_requested',
        admin_notes: message
      })
      .eq('id', submissionId)

    // Send email requesting info
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
        subject: `Additional Information Needed for ${submission.business_name}`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Additional Information Needed</h2>
            
            <p>Thank you for submitting <strong>${submission.business_name}</strong> to Filipino Food Near Me!</p>

            <p>To complete your listing, we need some additional information:</p>

            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="white-space: pre-wrap;">${message}</p>
            </div>

            <p>Please reply to this email with the requested information, and we'll process your submission right away.</p>

            <p style="color: #6b7280; font-size: 12px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
              Filipino Food Near Me
            </p>
          </div>
        `
      })
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Request info error:', error)
    return NextResponse.json(
      { error: 'Failed to request info' },
      { status: 500 }
    )
  }
}