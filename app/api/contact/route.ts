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

    // DEBUG: Check if API key exists
    const apiKey = process.env.BREVO_API_KEY
    console.log('API Key exists:', !!apiKey)
    console.log('API Key length:', apiKey?.length || 0)
    console.log('API Key first 10 chars:', apiKey?.substring(0, 10) || 'NONE')

    if (!apiKey) {
      console.error('BREVO_API_KEY is not set in environment variables')
      return NextResponse.json(
        { error: 'Server configuration error - API key missing' },
        { status: 500 }
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

    console.log('Attempting to send email via Brevo...')

    // Send email via Brevo
    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
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

    console.log('Brevo response status:', brevoResponse.status)

    if (!brevoResponse.ok) {
      const errorData = await brevoResponse.json()
      console.error('Brevo API error:', errorData)
      return NextResponse.json(
        { error: `Brevo error: ${JSON.stringify(errorData)}` },
        { status: 500 }
      )
    }

    const responseData = await brevoResponse.json()
    console.log('Brevo success:', responseData)

    return NextResponse.json({ 
      success: true,
      message: 'Email sent successfully' 
    })

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}