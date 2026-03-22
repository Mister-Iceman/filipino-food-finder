import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function sendConfirmationEmail(contactEmail: string, contactName: string) {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) return

  await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: {
        name: 'FilipinoFoodNearMe.org',
        email: 'advertise@filipinofoodnearme.org',
      },
      to: [{ email: contactEmail, name: contactName }],
      subject: 'We received your ad submission — FilipinoFoodNearMe.org',
      htmlContent: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:linear-gradient(135deg,#62438D 0%,#92345A 40%,#BF2F26 100%);height:6px;border-radius:6px 6px 0 0;"></div>
          <div style="background:#ffffff;padding:32px 40px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">
            <p style="font-size:13px;font-weight:700;letter-spacing:0.05em;color:#92345A;text-transform:uppercase;margin:0 0 16px 0;">FilipinoFoodNearMe.org</p>
            <h1 style="font-size:22px;font-weight:700;color:#111827;margin:0 0 16px 0;">We received your ad submission! 🎉</h1>
            <p style="font-size:15px;color:#374151;line-height:1.6;margin:0 0 16px 0;">
              Hi ${contactName}, thank you for submitting your featured ad! Your Founding Advertiser rate is locked in.
            </p>
            <p style="font-size:15px;color:#374151;line-height:1.6;margin:0 0 16px 0;">
              We'll review your submission and go live within 1 business day. You'll receive a confirmation email when your ad is live.
            </p>
            <p style="font-size:15px;color:#374151;line-height:1.6;margin:0 0 24px 0;">
              Questions? Email <a href="mailto:advertise@filipinofoodnearme.org" style="color:#62438D;">advertise@filipinofoodnearme.org</a>
            </p>
            <p style="font-size:15px;color:#374151;margin:0;">Salamat! 🙏<br/>— The FilipinoFoodNearMe.org team</p>
          </div>
        </div>
      `,
    }),
  })
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await supabase
          .from('ad_submissions')
          .update({ stripe_payment_status: 'paid' })
          .eq('stripe_session_id', session.id)

        const contactEmail = session.customer_email || ''
        const contactName = (session.metadata?.contact_name as string) || 'Advertiser'

        if (contactEmail) {
          try {
            await sendConfirmationEmail(contactEmail, contactName)
          } catch (emailErr) {
            console.error('Confirmation email error (non-fatal):', emailErr)
          }
        }
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        await supabase
          .from('ad_submissions')
          .update({ status: 'cancelled' })
          .eq('stripe_session_id', session.id)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        // Find by matching payment intent metadata if available
        console.error('Payment failed for intent:', paymentIntent.id)
        break
      }

      default:
        break
    }
  } catch (err) {
    console.error('Webhook handler error:', err)
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
