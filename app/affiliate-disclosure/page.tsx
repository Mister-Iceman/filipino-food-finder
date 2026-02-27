import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Affiliate Disclosure | FilipinoFoodNearMe.org',
  description: 'FilipinoFoodNearMe.org participates in the Amazon Associates affiliate program. Learn how we use affiliate links and how they support this free community resource.',
}

export default function AffiliateDisclosurePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <nav className="text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-purple-700">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">Affiliate Disclosure</span>
        </nav>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Affiliate Disclosure</h1>
          <p className="text-sm text-gray-400 mb-8">Last updated: February 2026</p>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Amazon Associates Program</h2>
              <p>
                FilipinoFoodNearMe.org is a participant in the Amazon Services LLC Associates Program,
                an affiliate advertising program designed to provide a means for sites to earn advertising
                fees by advertising and linking to Amazon.com.
              </p>
              <p>
                When you click an Amazon link on this site and make a qualifying purchase, we may earn
                a small commission at no additional cost to you.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">How We Choose Affiliate Links</h2>
              <p>
                All affiliate links on FilipinoFoodNearMe.org are editorially chosen by our team. We
                only link to products we genuinely recommend — ingredients, cookbooks, and kitchen tools
                that are relevant to Filipino cooking and culture.
              </p>
              <p>
                We are not paid by brands or sellers to feature specific products, and no manufacturer
                has editorial influence over the products we recommend. Our recommendations are based on
                cultural relevance, quality, and usefulness to home cooks.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Our Directory Listings Are Never Affected</h2>
              <p>
                Affiliate relationships have <strong>no influence whatsoever</strong> on our Filipino
                food directory. Businesses are listed based on their presence in the community, not on
                any commercial relationship with FilipinoFoodNearMe.org. We do not accept payment for
                directory placement, rankings, or editorial coverage.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">How Affiliate Revenue Supports This Site</h2>
              <p>
                FilipinoFoodNearMe.org is a free, community-driven resource. The small commissions we
                earn from qualifying purchases help us cover hosting, maintenance, and the time required
                to research and write cultural content — so we can keep the directory free and
                independent.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">FTC Compliance</h2>
              <p>
                In accordance with the Federal Trade Commission's guidelines on endorsements and
                testimonials, we disclose affiliate relationships at the point of use. Any page
                containing affiliate links will include the notice: <em>"As an Amazon Associate,
                FilipinoFoodNearMe.org earns from qualifying purchases."</em>
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Questions?</h2>
              <p>
                If you have questions about our affiliate relationships, please{' '}
                <Link href="/contact" className="text-purple-700 underline hover:text-purple-900">
                  contact us
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
