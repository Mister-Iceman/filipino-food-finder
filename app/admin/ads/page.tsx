import { createClient } from '@supabase/supabase-js'
import AdSubmissionsTable from './AdSubmissionsTable'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function AdminAdsPage() {
  const { data: submissions } = await supabase
    .from('ad_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  const rows = submissions ?? []

  const pending = rows.filter((r) => r.status === 'pending').length
  const live = rows.filter((r) => r.status === 'live').length

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const revenue = rows
    .filter((r) => r.stripe_payment_status === 'paid' && r.created_at >= startOfMonth)
    .reduce((sum: number, r) => sum + (r.total_price || 0), 0)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Ad Submissions</h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
            <p className="text-3xl font-bold text-yellow-600">{pending}</p>
            <p className="text-sm text-gray-500 mt-1">Pending</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
            <p className="text-3xl font-bold text-green-600">{live}</p>
            <p className="text-sm text-gray-500 mt-1">Live</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
            <p className="text-3xl font-bold" style={{ color: '#62438D' }}>${revenue.toFixed(0)}</p>
            <p className="text-sm text-gray-500 mt-1">Revenue this month</p>
          </div>
        </div>

        <AdSubmissionsTable submissions={rows} />
      </div>
    </div>
  )
}
