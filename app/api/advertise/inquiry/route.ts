import { NextRequest, NextResponse } from 'next/server'

// ── In-memory rate limit: 3 inquiries per IP per day ─────────────────────────
const rateLimitMap = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now       = Date.now()
  const windowMs  = 24 * 60 * 60 * 1000
  const max       = 3

  const timestamps = (rateLimitMap.get(ip) ?? []).filter(t => now - t < windowMs)
  rateLimitMap.set(ip, timestamps)

  if (timestamps.length >= max) return true

  timestamps.push(now)
  rateLimitMap.set(ip, timestamps)
  return false
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function trim(fd: FormData, key: string): string {
  return ((fd.get(key) as string | null) ?? '').trim()
}

function sanitize(fd: FormData, key: string): string {
  return trim(fd, key).replace(/<[^>]*>/g, '')
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>')
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidUrl(url: string): boolean {
  if (!url) return true
  try {
    const p = new URL(url)
    return p.protocol === 'http:' || p.protocol === 'https:'
  } catch {
    return false
  }
}

function errorRedirect(req: NextRequest, msg: string): Response {
  const url = new URL('/advertise', req.url)
  url.searchParams.set('error', encodeURIComponent(msg))
  return NextResponse.redirect(url, 303)
}

const ALLOWED_PACKAGES = new Set([
  'Founding Sponsor', 'City Sponsor', 'Category Sponsor',
  'Featured Event Boost', 'Network Package', 'Seasonal Campaign',
  'Just exploring', '',
])

const ALLOWED_BUDGETS = new Set([
  'Under $200', '$200-$500', '$500-$1000', '$1000+', 'Not sure yet', '',
])

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    '127.0.0.1'

  if (isRateLimited(ip)) {
    return new Response('Too many inquiries. Please wait 24 hours.', {
      status:  429,
      headers: { 'Content-Type': 'text/plain' },
    })
  }

  let fd: FormData
  try {
    fd = await req.formData()
  } catch {
    return errorRedirect(req, 'Could not read form data. Please try again.')
  }

  // Honeypot
  if (trim(fd, '_gotcha')) {
    return NextResponse.redirect(new URL('/advertise?success=true', req.url), 303)
  }

  const name    = sanitize(fd, 'name').slice(0, 100)
  const company = sanitize(fd, 'company').slice(0, 100)
  const email   = sanitize(fd, 'email').toLowerCase()
  const phone   = sanitize(fd, 'phone').slice(0, 30)
  const website = sanitize(fd, 'website').slice(0, 200)
  const pkg     = sanitize(fd, 'package_interest')
  const budget  = sanitize(fd, 'budget')
  const message = sanitize(fd, 'message').slice(0, 1000)

  if (!name)    return errorRedirect(req, 'Name is required.')
  if (!company) return errorRedirect(req, 'Company / Brand is required.')
  if (!email)   return errorRedirect(req, 'Email is required.')

  if (!isValidEmail(email))
    return errorRedirect(req, 'Please enter a valid email address.')

  if (!ALLOWED_PACKAGES.has(pkg))
    return errorRedirect(req, 'Invalid package selection.')

  if (!ALLOWED_BUDGETS.has(budget))
    return errorRedirect(req, 'Invalid budget selection.')

  if (website && !isValidUrl(website))
    return errorRedirect(req, 'Website must be a valid http(s):// URL.')

  const apiKey      = process.env.BREVO_API_KEY
  const senderEmail = process.env.BREVO_SENDER_EMAIL ?? 'info@filipinofoodnearme.org'
  const adminEmail  = 'hello@filipinofoodnearme.org'

  const subject = `[AD INQUIRY] ${escapeHtml(company)} — ${pkg || 'General'} — ${budget || 'Budget TBD'}`

  // ── Admin notification email ──────────────────────────────────────────────
  const adminHtml = `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;color:#111827">
      <div style="background:#0038A8;padding:20px 24px;border-radius:12px 12px 0 0">
        <p style="color:#FCD116;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 4px">FilAm Network</p>
        <h1 style="color:white;font-size:20px;font-weight:700;margin:0">New Advertising Inquiry</h1>
      </div>
      <div style="background:#F9FAFB;padding:24px;border:1px solid #E5E7EB;border-top:none;border-radius:0 0 12px 12px">
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr><td style="padding:6px 0;font-weight:600;color:#374151;width:140px">Name</td><td style="padding:6px 0;color:#111827">${escapeHtml(name)}</td></tr>
          <tr><td style="padding:6px 0;font-weight:600;color:#374151">Company</td><td style="padding:6px 0;color:#111827">${escapeHtml(company)}</td></tr>
          <tr><td style="padding:6px 0;font-weight:600;color:#374151">Email</td><td style="padding:6px 0;color:#0038A8">${escapeHtml(email)}</td></tr>
          ${phone   ? `<tr><td style="padding:6px 0;font-weight:600;color:#374151">Phone</td><td style="padding:6px 0;color:#111827">${escapeHtml(phone)}</td></tr>` : ''}
          ${website ? `<tr><td style="padding:6px 0;font-weight:600;color:#374151">Website</td><td style="padding:6px 0;color:#0038A8"><a href="${escapeHtml(website)}" style="color:#0038A8">${escapeHtml(website)}</a></td></tr>` : ''}
          ${pkg     ? `<tr><td style="padding:6px 0;font-weight:600;color:#374151">Package</td><td style="padding:6px 0"><span style="background:#FCD116;color:#111827;font-weight:700;font-size:11px;padding:2px 8px;border-radius:999px">${escapeHtml(pkg)}</span></td></tr>` : ''}
          ${budget  ? `<tr><td style="padding:6px 0;font-weight:600;color:#374151">Budget</td><td style="padding:6px 0;color:#111827">${escapeHtml(budget)}</td></tr>` : ''}
        </table>
        ${message ? `
        <div style="margin-top:16px;padding:16px;background:white;border:1px solid #E5E7EB;border-left:4px solid #FCD116;border-radius:8px">
          <p style="font-weight:600;color:#374151;margin:0 0 8px;font-size:13px">Message</p>
          <p style="color:#374151;margin:0;font-size:13px;line-height:1.6">${escapeHtml(message)}</p>
        </div>` : ''}
        <p style="margin-top:16px;color:#9CA3AF;font-size:11px">IP: ${ip} · FilipinoFoodNearMe.org advertise inquiry</p>
      </div>
    </div>
  `

  // ── Auto-reply to sender ──────────────────────────────────────────────────
  const replyHtml = `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;color:#111827">
      <div style="background:#0038A8;padding:20px 24px;border-radius:12px 12px 0 0">
        <p style="color:#FCD116;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 4px">FilAm Network</p>
        <h1 style="color:white;font-size:20px;font-weight:700;margin:0">We got your inquiry, ${escapeHtml(name)}!</h1>
      </div>
      <div style="background:#F9FAFB;padding:24px;border:1px solid #E5E7EB;border-top:none;border-radius:0 0 12px 12px">
        <p style="color:#374151;line-height:1.6;margin:0 0 16px">
          Thank you for your interest in advertising with the FilAm Network. We received your inquiry
          and will follow up within <strong>1 business day</strong> with a media kit and next steps.
        </p>
        ${pkg ? `<p style="margin:0 0 16px;color:#374151">You indicated interest in: <strong>${escapeHtml(pkg)}</strong></p>` : ''}
        <p style="color:#374151;line-height:1.6;margin:0 0 20px">
          In the meantime, explore what your ad could look like:
          <a href="https://filipinofoodnearme.org/advertise#preview" style="color:#0038A8">
            filipinofoodnearme.org/advertise
          </a>
        </p>
        <p style="color:#9CA3AF;font-size:12px;margin:24px 0 0;border-top:1px solid #E5E7EB;padding-top:16px">
          FilipinoFoodNearMe.org · FilipinoEventsNearMe.org · The FilAm Network<br>
          <a href="mailto:hello@filipinofoodnearme.org" style="color:#0038A8">hello@filipinofoodnearme.org</a>
        </p>
      </div>
    </div>
  `

  if (apiKey) {
    Promise.all([
      fetch('https://api.brevo.com/v3/smtp/email', {
        method:  'POST',
        headers: { accept: 'application/json', 'api-key': apiKey, 'content-type': 'application/json' },
        body:    JSON.stringify({
          sender:      { name: 'FilAm Network', email: senderEmail },
          to:          [{ email: adminEmail, name: 'FilAm Network' }],
          replyTo:     { email, name },
          subject,
          htmlContent: adminHtml,
        }),
      }),
      fetch('https://api.brevo.com/v3/smtp/email', {
        method:  'POST',
        headers: { accept: 'application/json', 'api-key': apiKey, 'content-type': 'application/json' },
        body:    JSON.stringify({
          sender:      { name: 'FilAm Network', email: senderEmail },
          to:          [{ email, name }],
          subject:     'We received your advertising inquiry — FilAm Network',
          htmlContent: replyHtml,
        }),
      }),
    ]).catch(() => {})
  }

  return NextResponse.redirect(new URL('/advertise?success=true#contact', req.url), 303)
}
