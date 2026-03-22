import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { PACKAGES, calculateOrderTotal } from '../../../lib/ad-packages'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      sites,
      package_ffnm,
      package_fenm,
      is_founding,
      is_bundle,
      contact_email,
      contact_name,
      contact_phone,
      business_name_ffnm,
      description_ffnm,
      cta_ffnm,
      link_type_ffnm,
      destination_url_ffnm,
      geo_ffnm,
      event_name_fenm,
      event_date_fenm,
      description_fenm,
      cta_fenm,
      link_type_fenm,
      destination_url_fenm,
      geo_fenm,
      images_ffnm,
      images_fenm,
    } = body

    // Build line items
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = []

    if (sites === 'ffnm' || sites === 'both') {
      const pkg = PACKAGES.ffnm.find((p) => p.val === package_ffnm)
      if (pkg) {
        line_items.push({ price: pkg.stripePrice, quantity: 1 })
      }
    }

    if (sites === 'fenm' || sites === 'both') {
      const pkg = PACKAGES.fenm.find((p) => p.val === package_fenm)
      if (pkg) {
        line_items.push({ price: pkg.stripePrice, quantity: 1 })
      }
    }

    // Bundle discount coupon
    let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined
    if (is_bundle) {
      const coupon = await stripe.coupons.create({
        percent_off: 15,
        duration: 'once',
        name: 'FFNM+FENM Bundle 15% Off',
      })
      discounts = [{ coupon: coupon.id }]
    }

    // UTM URLs
    const utm_url_ffnm =
      destination_url_ffnm && business_name_ffnm
        ? `${destination_url_ffnm}?utm_source=filipinofoodnearme&utm_medium=featured&utm_campaign=${toSlug(business_name_ffnm)}`
        : ''

    const utm_url_fenm =
      destination_url_fenm && event_name_fenm
        ? `${destination_url_fenm}?utm_source=filipinoeventsnearm&utm_medium=featured&utm_campaign=${toSlug(event_name_fenm)}`
        : ''

    // Mode: subscription if ffnm or both, payment if fenm only
    const mode: Stripe.Checkout.SessionCreateParams.Mode =
      sites === 'fenm' ? 'payment' : 'subscription'

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.filipinofoodnearme.org'

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode,
      line_items,
      success_url: `${siteUrl}/advertise/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/advertise`,
      customer_email: contact_email,
      metadata: {
        sites,
        package_ffnm: package_ffnm || '',
        package_fenm: package_fenm || '',
        is_founding: 'true',
        is_bundle: String(is_bundle),
        contact_name,
      },
    }

    if (discounts) {
      sessionParams.discounts = discounts
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    // Calculate total for recording
    const ffnmPkg = PACKAGES.ffnm.find((p) => p.val === package_ffnm) ?? null
    const fenomPkg = PACKAGES.fenm.find((p) => p.val === package_fenm) ?? null
    const { total } = calculateOrderTotal(ffnmPkg, fenomPkg, !!is_bundle)

    // Insert into ad_submissions
    await supabase.from('ad_submissions').insert([
      {
        sites,
        package_ffnm: package_ffnm || null,
        package_fenm: package_fenm || null,
        is_founding: true,
        is_bundle: !!is_bundle,
        contact_email,
        contact_name,
        contact_phone: contact_phone || null,
        business_name_ffnm: business_name_ffnm || null,
        description_ffnm: description_ffnm || null,
        cta_ffnm: cta_ffnm || null,
        link_type_ffnm: link_type_ffnm || null,
        destination_url_ffnm: destination_url_ffnm || null,
        geo_ffnm: geo_ffnm || null,
        event_name_fenm: event_name_fenm || null,
        event_date_fenm: event_date_fenm || null,
        description_fenm: description_fenm || null,
        cta_fenm: cta_fenm || null,
        link_type_fenm: link_type_fenm || null,
        destination_url_fenm: destination_url_fenm || null,
        geo_fenm: geo_fenm || null,
        images_ffnm: images_ffnm || [],
        images_fenm: images_fenm || [],
        stripe_session_id: session.id,
        total_price: total,
        status: 'pending',
        utm_url_ffnm,
        utm_url_fenm,
      },
    ])

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout session error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
