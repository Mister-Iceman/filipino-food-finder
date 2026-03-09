import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import * as brevo from '@getbrevo/brevo'
import { toSlug, stateHintFromSlug } from '@/lib/listing-slug'

const ADMIN_PASSWORD = 'R@ikkonenProjpagkain2026'

export async function POST(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { password, photoId, action } = await request.json()

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!photoId || !['approve', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  // Fetch photo details before updating
  const { data: photo } = await supabase
    .from('listing_photos')
    .select('id, owner_email, listing_id')
    .eq('id', photoId)
    .single()

  if (!photo) return NextResponse.json({ error: 'Photo not found' }, { status: 404 })

  const newStatus = action === 'approve' ? 'approved' : 'rejected'

  await supabase
    .from('listing_photos')
    .update({ status: newStatus, reviewed_at: new Date().toISOString(), reviewed_by: 'admin' })
    .eq('id', photoId)

  // Send rejection email via Brevo
  if (action === 'reject') {
    try {
      // Get listing name for the email (no slug column — match by name+city+state)
      const slugToFind = photo.listing_id
      const stateHint = stateHintFromSlug(slugToFind)
      const q = supabase.from('listings').select('name, city, state')
      const { data: candidates } = stateHint ? await q.ilike('state', stateHint) : await q
      const listingMatch = (candidates ?? []).find(
        (l: { name: string; city: string; state: string }) =>
          toSlug(l.name ?? '', l.city ?? '', l.state ?? '') === slugToFind
      )
      const listingName = listingMatch?.name ?? slugToFind

      const apiInstance = new brevo.TransactionalEmailsApi()
      apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY!)

      const sendSmtpEmail = new brevo.SendSmtpEmail()
      sendSmtpEmail.to = [{ email: photo.owner_email }]
      sendSmtpEmail.sender = { email: 'info@filipinofoodnearme.org', name: 'Filipino Food Near Me' }
      sendSmtpEmail.subject = `Photo update for ${listingName} — FilipinoFoodNearMe.org`
      sendSmtpEmail.htmlContent = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0038A8 0%, #002a80 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🇵🇭 Filipino Food Near Me</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Photo Not Approved</h2>
            <p>Your photo for <strong>${listingName}</strong> was not approved.</p>
            <p>Please ensure photos show your business, food, or team clearly. Common reasons for rejection include blurry images, unrelated content, or images that don't clearly represent your business.</p>
            <p>You're welcome to upload a new photo via your owner dashboard.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 12px; color: #999; text-align: center;">
              Filipino Food Near Me — <a href="https://filipinofoodnearme.org" style="color: #0038A8;">filipinofoodnearme.org</a>
            </p>
          </div>
        </body>
        </html>
      `
      await apiInstance.sendTransacEmail(sendSmtpEmail)
    } catch {
      // fail silently
    }
  }

  return NextResponse.json({ success: true, status: newStatus })
}
