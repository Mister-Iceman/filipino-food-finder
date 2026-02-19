import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    listing_id, listing_name, listing_city, listing_state,
    owner_name, owner_email,
    new_hours, new_website, new_phone, new_description,
    new_instagram_url, new_facebook_url, new_tiktok_url, notes
  } = body

  if (!listing_id || !owner_name || !owner_email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Must have at least one field to update
  const hasUpdate = new_hours || new_website || new_phone || new_description ||
    new_instagram_url || new_facebook_url || new_tiktok_url

  if (!hasUpdate) {
    return NextResponse.json({ error: 'Please provide at least one field to update' }, { status: 400 })
  }

  const token = crypto.randomBytes(32).toString('hex')
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://filipinofoodnearme.org'

  const { error: insertError } = await supabase
    .from('listing_update_requests')
    .insert({
      listing_id, listing_name, listing_city, listing_state,
      owner_name, owner_email,
      new_hours, new_website, new_phone, new_description,
      new_instagram_url, new_facebook_url, new_tiktok_url,
      notes, token, status: 'pending'
    })

  if (insertError) {
    return NextResponse.json({ error: 'Failed to submit update' }, { status: 500 })
  }

  const approveUrl = `${baseUrl}/api/approve-update?token=${token}&action=approve`
  const rejectUrl = `${baseUrl}/api/approve-update?token=${token}&action=reject`

  // Build update summary for email
  const updateRows = [
    new_hours && `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;width:160px;">Hours</td><td style="padding:8px;border-bottom:1px solid #eee;">${new_hours}</td></tr>`,
    new_website && `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Website</td><td style="padding:8px;border-bottom:1px solid #eee;">${new_website}</td></tr>`,
    new_phone && `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Phone</td><td style="padding:8px;border-bottom:1px solid #eee;">${new_phone}</td></tr>`,
    new_description && `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Description</td><td style="padding:8px;border-bottom:1px solid #eee;">${new_description}</td></tr>`,
    new_instagram_url && `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Instagram</td><td style="padding:8px;border-bottom:1px solid #eee;">${new_instagram_url}</td></tr>`,
    new_facebook_url && `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Facebook</td><td style="padding:8px;border-bottom:1px solid #eee;">${new_facebook_url}</td></tr>`,
    new_tiktok_url && `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">TikTok</td><td style="padding:8px;border-bottom:1px solid #eee;">${new_tiktok_url}</td></tr>`,
    notes && `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Notes</td><td style="padding:8px;border-bottom:1px solid #eee;">${notes}</td></tr>`,
  ].filter(Boolean).join('')

  // Email admin
  await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': process.env.BREVO_API_KEY! },
    body: JSON.stringify({
      sender: { name: 'FilipinoFoodNearMe', email: 'info@filipinofoodnearme.org' },
      to: [{ email: 'info@filipinofoodnearme.org' }],
      subject: `📝 Listing Update Request: ${listing_name}`,
      htmlContent: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#62438D;">Listing Update Request</h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;width:160px;">Business</td><td style="padding:8px;border-bottom:1px solid #eee;">${listing_name}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Location</td><td style="padding:8px;border-bottom:1px solid #eee;">${listing_city}, ${listing_state}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Submitted by</td><td style="padding:8px;border-bottom:1px solid #eee;">${owner_name} (${owner_email})</td></tr>
          </table>
          <h3 style="color:#333;">Requested Changes:</h3>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">${updateRows}</table>
          <a href="${approveUrl}" style="background:#16a34a;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;margin-right:12px;">
            Apply All Changes
          </a>
          <a href="${rejectUrl}" style="background:#dc2626;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">
            Reject Request
          </a>
        </div>
      `
    })
  })

  // Confirm to owner
  await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': process.env.BREVO_API_KEY! },
    body: JSON.stringify({
      sender: { name: 'Filipino Food Near Me', email: 'info@filipinofoodnearme.org' },
      to: [{ email: owner_email, name: owner_name }],
      subject: `We received your update for ${listing_name}`,
      htmlContent: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#62438D;">Salamat, ${owner_name}!</h2>
          <p>We received your update request for <strong>${listing_name}</strong>.</p>
          <p>Our team will review and apply the changes within <strong>2-3 business days</strong>.</p>
          <p style="color:#666;font-size:13px;">
            Questions? Reply to this email.<br>
            The FilipinoFoodNearMe.org Team
          </p>
        </div>
      `
    })
  })

  return NextResponse.json({ success: true })
}