import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import PartnerForm from './PartnerForm'

export const metadata: Metadata = {
  title: 'Community Partners | FilipinoFoodNearMe.org',
  description: 'FilipinoFoodNearMe.org partners with Filipino American organizations, nonprofits, and community groups to celebrate and preserve Filipino culture across America.',
}

export const revalidate = 3600

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Partner {
  id: string
  org_name: string
  website: string | null
  description: string | null
  category: string
}

export default async function CommunityPartnersPage() {
  const { data: partners } = await supabase
    .from('community_partners')
    .select('id, org_name, website, description, category')
    .eq('status', 'approved')
    .order('org_name', { ascending: true })

  const approvedPartners: Partner[] = partners ?? []

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#62438D] via-[#7B3F6E] to-[#92345A] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-purple-200 text-sm font-semibold uppercase tracking-widest mb-3">
            Community Partners
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
            Together for the Filipino Community
          </h1>
          <p className="text-purple-100 text-lg max-w-2xl mx-auto leading-relaxed">
            We partner with Filipino American organizations, nonprofits, and civic groups to
            celebrate, preserve, and grow the Filipino food and cultural community across America.
          </p>
        </div>
      </div>

      {/* Partners Grid */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        {approvedPartners.length > 0 ? (
          <>
            <h2 className="text-xs font-bold text-purple-700 uppercase tracking-widest mb-8 text-center">
              Our Partners
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {approvedPartners.map((partner) => (
                <div
                  key={partner.id}
                  className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                    {partner.category}
                  </span>
                  <h3 className="font-bold text-gray-900 mt-3 mb-2 leading-snug">
                    {partner.org_name}
                  </h3>
                  {partner.description && (
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">{partner.description}</p>
                  )}
                  {partner.website && (
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-purple-700 hover:text-purple-900 font-medium"
                    >
                      Visit website →
                    </a>
                  )}
                </div>
              ))}
            </div>
            <hr className="border-gray-100 mb-16" />
          </>
        ) : (
          <div className="text-center py-12 mb-16">
            <p className="text-gray-500 text-lg">Partner announcements coming soon.</p>
          </div>
        )}

        {/* Become a Partner form */}
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Become a Partner</h2>
            <p className="text-gray-600 leading-relaxed">
              Is your organization supporting the Filipino community in America? We'd love to
              collaborate. Fill out the form below and we'll be in touch.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8">
            <PartnerForm />
          </div>
        </div>
      </div>

      {/* Badge CTA */}
      <div className="bg-gray-50 border-t border-gray-100 py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold text-purple-700 uppercase tracking-widest mb-3">
            For Listed Businesses
          </p>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Show Your Community Pride
          </h2>
          <p className="text-gray-600 mb-6">
            If your business is listed in our directory, display our free badge on your website.
          </p>
          <Link
            href="/badge"
            className="inline-block bg-purple-700 hover:bg-purple-800 text-white font-bold px-8 py-3 rounded-lg transition-colors"
          >
            Get the Badge
          </Link>
        </div>
      </div>

    </div>
  )
}
