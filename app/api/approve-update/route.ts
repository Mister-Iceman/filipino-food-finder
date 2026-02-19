import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')
  const action = searchParams.get('action')

  if (!token || !action) {
    return new NextResponse('Invalid request', { status: 400 })
  }

  const { data: request } = await supabase
    .from('listing_update_requests')
    .select('*')
    .eq('token', token)
    .single()

  if (!request) {
    return new NextResponse(renderPage('Invalid Link', 'This update token was not found.', false), {
      headers: { 'Content-Type': 'text/html' }
    })
  }

  if (request.status !== 'pending') {
    return new NextResponse(renderPage('Already Processed', `This request was already ${request.status}.`, false), {
      headers: { 'Content-Type': 'text/html' }
    })
  }

  if (action === 'approve') {
    // Build update object with only provided fields
    const updates: Record<string, string> = {}
    if (request.new_hours) updates.hours = request.new_hours
    if (request.new_website) updates.website = request.new_website
    if (request.new_phone) updates.phone = request.new_phone
    if (request.new_description) updates.description = request.new_description
    if (request.new_instagram_url) updates.instagram_url = request.new_instagram_url
    if (request.new_facebook_url) updates.facebook_url = request.new_facebook_url
    if (request.new_tiktok_url) updates.tiktok_url = request.new_tiktok_url
    updates.updated_at = new Date().toISOString()

    await supabase.from('listings').update(updates).eq('id', request.listing_id)
    await supabase.from('listing_update_requests')
      .update({ status: 'approved', reviewed_at: new Date().toISOString() })
      .eq('token', token)

    // Notify owner
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': process.env.BREVO_API_KEY! },
      body: JSON.stringify({
        sender: { name: 'Filipino Food Near Me', email: 'info@filipinofoodnearme.org' },
        to: [{ email: request.owner_email, name: request.owner_name }],
        subject: `Your listing update for ${request.listing_name} is live!`,
        htmlContent: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
            <h2 style="color:#16a34a;">Update Applied!</h2>
            <p>Hi ${request.owner_name},</p>
            <p>Your updates for <strong>${request.listing_name}</strong> are now live on FilipinoFoodNearMe.org.</p>
            <p>Maraming salamat for keeping your listing accurate for the community!</p>
            <p style="color:#666;font-size:13px;">The FilipinoFoodNearMe.org Team</p>
          </div>
        `
      })
    })

    return new NextResponse(
      renderPage('Changes Applied!', `All updates for ${request.listing_name} are now live. ${request.owner_email} has been notified.`, true),
      { headers: { 'Content-Type': 'text/html' } }
    )
  }

  if (action === 'reject') {
    await supabase.from('listing_update_requests')
      .update({ status: 'rejected', reviewed_at: new Date().toISOString() })
      .eq('token', token)

    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': process.env.BREVO_API_KEY! },
      body: JSON.stringify({
        sender: { name: 'Filipino Food Near Me', email: 'info@filipinofoodnearme.org' },
        to: [{ email: request.owner_email, name: request.owner_name }],
        subject: `Update on your listing request for ${request.listing_name}`,
        htmlContent: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
            <h2 style="color:#62438D;">Update on Your Request</h2>
            <p>Hi ${request.owner_name},</p>
            <p>We were unable to apply the requested updates for <strong>${request.listing_name}</strong> at this time.</p>
            <p>If you have questions, please reply to this email.</p>
            <p style="color:#666;font-size:13px;">The FilipinoFoodNearMe.org Team</p>
          </div>
        `
      })
    })

    return new NextResponse(
      renderPage('Request Rejected', `The update for ${request.listing_name} was rejected. ${request.owner_email} has been notified.`, false),
      { headers: { 'Content-Type': 'text/html' } }
    )
  }

  return new NextResponse('Invalid action', { status: 400 })
}

function renderPage(title: string, message: string, success: boolean) {
  return `<!DOCTYPE html><html><head><title>${title}</title><style>body{font-family:sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:#f9fafb;}.card{background:white;border-radius:12px;padding:48px;max-width:480px;text-align:center;box-shadow:0 4px 24px rgba(0,0,0,0.1);}h1{color:${success ? '#16a34a' : '#dc2626'};}p{color:#4b5563;}a{color:#62438D;}</style></head><body><div class="card"><h1>${title}</h1><p>${message}</p><p style="margin-top:24px;"><a href="https://filipinofoodnearme.org">Back to FilipinoFoodNearMe.org</a></p></div></body></html>`
}