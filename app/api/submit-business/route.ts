import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()

    // Validate required fields
    if (!formData.businessName || !formData.contactEmail || !formData.phone || !formData.address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

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
          name: 'Filipino Food Near Me - Business Submission',
          email: 'info@filipinofoodnearme.org'
        },
        to: [
          {
            email: 'info@filipinofoodnearme.org',
            name: 'Filipino Food Near Me'
          }
        ],
        replyTo: {
          email: formData.contactEmail,
          name: formData.businessName
        },
        subject: `New Business Submission: ${formData.businessName}`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
              New Business Submission
            </h2>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Business Information</h3>
              <p><strong>Business Name:</strong> ${formData.businessName}</p>
              <p><strong>Primary Category:</strong> ${formData.categoryPrimary}</p>
              ${formData.categorySecondary ? `<p><strong>Secondary Category:</strong> ${formData.categorySecondary}</p>` : ''}
            </div>

            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Location</h3>
              <p><strong>Address:</strong> ${formData.address}</p>
              <p><strong>City:</strong> ${formData.city}</p>
              <p><strong>State:</strong> ${formData.state}</p>
              <p><strong>Zip:</strong> ${formData.zip}</p>
            </div>

            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Contact Information</h3>
              <p><strong>Phone:</strong> ${formData.phone}</p>
              <p><strong>Contact Email:</strong> ${formData.contactEmail}</p>
              ${formData.website ? `<p><strong>Website:</strong> <a href="${formData.website}">${formData.website}</a></p>` : ''}
            </div>

            ${(formData.instagram || formData.facebook || formData.tiktok || formData.x) ? `
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Social Media</h3>
              ${formData.instagram ? `<p><strong>Instagram:</strong> <a href="${formData.instagram}">${formData.instagram}</a></p>` : ''}
              ${formData.facebook ? `<p><strong>Facebook:</strong> <a href="${formData.facebook}">${formData.facebook}</a></p>` : ''}
              ${formData.tiktok ? `<p><strong>TikTok:</strong> <a href="${formData.tiktok}">${formData.tiktok}</a></p>` : ''}
              ${formData.x ? `<p><strong>X (Twitter):</strong> <a href="${formData.x}">${formData.x}</a></p>` : ''}
            </div>
            ` : ''}

            ${formData.googleMaps ? `
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Google Maps</h3>
              <p><a href="${formData.googleMaps}">${formData.googleMaps}</a></p>
            </div>
            ` : ''}

            ${formData.hours ? `
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Business Hours</h3>
              <p style="white-space: pre-wrap;">${formData.hours}</p>
            </div>
            ` : ''}

            ${formData.description ? `
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Description</h3>
              <p style="white-space: pre-wrap;">${formData.description}</p>
            </div>
            ` : ''}

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            
            <p style="color: #6b7280; font-size: 12px;">
              This submission was received from filipinofoodnearme.org/add-business
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