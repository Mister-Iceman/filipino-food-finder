import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Map subject codes to readable text
    const subjectMap: { [key: string]: string } = {
      general: 'General Inquiry',
      business: 'Add My Business',
      issue: 'Report an Issue',
      partnership: 'Partnership/Advertising',
      other: 'Other'
    }

    const subjectText = subjectMap[subject] || subject

    // Send email via Brevo
    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY || '',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'Filipino Food Near Me Contact Form',
          email: 'info@filipinofoodnearme.org'
        },
        to: [
          {
            email: 'info@filipinofoodnearme.org',
            name: 'Filipino Food Near Me'
          }
        ],
        replyTo: {
          email: email,
          name: name
        },
        subject: `Contact Form: ${subjectText}`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
              New Contact Form Submission
            </h2>
            
            <div style="margin: 20px 0;">
              <p style="margin: 10px 0;"><strong>From:</strong> ${name}</p>
              <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 10px 0;"><strong>Subject:</strong> ${subjectText}</p>
            </div>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Message:</h3>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            
            <p style="color: #6b7280; font-size: 12px;">
              This email was sent from the Filipino Food Near Me contact form at filipinofoodnearme.org
            </p>
          </div>
        `
      })
    })

    if (!brevoResponse.ok) {
      const errorData = await brevoResponse.json()
      console.error('Brevo API error:', errorData)
      throw new Error('Failed to send email via Brevo')
    }

    return NextResponse.json({ 
      success: true,
      message: 'Email sent successfully' 
    })

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}