'use client'

import { useState } from 'react'

interface AdSubmission {
  id: string | number
  contact_name?: string
  contact_email?: string
  contact_phone?: string
  sites?: string
  package_ffnm?: string
  package_fenm?: string
  total_price?: number
  status?: string
  created_at?: string
  business_name_ffnm?: string
  description_ffnm?: string
  cta_ffnm?: string
  link_type_ffnm?: string
  destination_url_ffnm?: string
  utm_url_ffnm?: string
  geo_ffnm?: string
  images_ffnm?: string[]
  event_name_fenm?: string
  event_date_fenm?: string
  description_fenm?: string
  cta_fenm?: string
  link_type_fenm?: string
  destination_url_fenm?: string
  utm_url_fenm?: string
  geo_fenm?: string
  images_fenm?: string[]
  admin_notes?: string
  stripe_payment_status?: string
  is_bundle?: boolean
}

const STATUS_TABS = ['Pending', 'Approved', 'Live', 'All'] as const
type StatusTab = typeof STATUS_TABS[number]

const STATUS_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  pending: { label: 'Pending', bg: '#FEF3C7', color: '#D97706' },
  approved: { label: 'Approved', bg: '#DBEAFE', color: '#1D4ED8' },
  live: { label: 'Live', bg: '#D1FAE5', color: '#065F46' },
  rejected: { label: 'Rejected', bg: '#FEE2E2', color: '#991B1B' },
  cancelled: { label: 'Cancelled', bg: '#F3F4F6', color: '#6B7280' },
}

function StatusBadge({ status }: { status: string }) {
  const badge = STATUS_BADGE[status] ?? STATUS_BADGE.cancelled
  return (
    <span
      className="text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{ background: badge.bg, color: badge.color }}
    >
      {badge.label}
    </span>
  )
}

function ExpandedRow({ sub }: { sub: AdSubmission }) {
  const [notes, setNotes] = useState(sub.admin_notes || '')

  const ffnmImages = sub.images_ffnm ?? []
  const fenomImages = sub.images_fenm ?? []

  return (
    <tr>
      <td colSpan={7} className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          {sub.business_name_ffnm && (
            <div>
              <p className="font-bold mb-2" style={{ color: '#62438D' }}>🍽️ FFNM Creative</p>
              <div className="space-y-1 text-gray-700">
                <p><span className="font-semibold">Business:</span> {sub.business_name_ffnm}</p>
                {sub.description_ffnm && (
                  <p><span className="font-semibold">Description:</span> {sub.description_ffnm}</p>
                )}
                {sub.cta_ffnm && (
                  <p><span className="font-semibold">CTA:</span> {sub.cta_ffnm}</p>
                )}
                {sub.destination_url_ffnm && (
                  <p>
                    <span className="font-semibold">Destination:</span>{' '}
                    <a href={sub.destination_url_ffnm} target="_blank" rel="noreferrer" className="text-blue-600 underline break-all">
                      {sub.destination_url_ffnm}
                    </a>
                  </p>
                )}
                {sub.utm_url_ffnm && (
                  <p className="font-mono text-xs break-all" style={{ color: '#D1880D' }}>
                    UTM: {sub.utm_url_ffnm}
                  </p>
                )}
                {sub.geo_ffnm && (
                  <p><span className="font-semibold">Geo:</span> {sub.geo_ffnm}</p>
                )}
              </div>
              {ffnmImages.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-3">
                  {ffnmImages.filter(Boolean).map((url, i) => (
                    <img key={i} src={url} alt={`FFNM image ${i + 1}`} className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                  ))}
                </div>
              )}
            </div>
          )}

          {sub.event_name_fenm && (
            <div>
              <p className="font-bold mb-2" style={{ color: '#085041' }}>📅 FENM Creative</p>
              <div className="space-y-1 text-gray-700">
                <p><span className="font-semibold">Event:</span> {sub.event_name_fenm}</p>
                {sub.event_date_fenm && (
                  <p><span className="font-semibold">Date/venue:</span> {sub.event_date_fenm}</p>
                )}
                {sub.description_fenm && (
                  <p><span className="font-semibold">Description:</span> {sub.description_fenm}</p>
                )}
                {sub.cta_fenm && (
                  <p><span className="font-semibold">CTA:</span> {sub.cta_fenm}</p>
                )}
                {sub.destination_url_fenm && (
                  <p>
                    <span className="font-semibold">Destination:</span>{' '}
                    <a href={sub.destination_url_fenm} target="_blank" rel="noreferrer" className="text-blue-600 underline break-all">
                      {sub.destination_url_fenm}
                    </a>
                  </p>
                )}
                {sub.utm_url_fenm && (
                  <p className="font-mono text-xs break-all" style={{ color: '#D1880D' }}>
                    UTM: {sub.utm_url_fenm}
                  </p>
                )}
                {sub.geo_fenm && (
                  <p><span className="font-semibold">Geo:</span> {sub.geo_fenm}</p>
                )}
              </div>
              {fenomImages.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-3">
                  {fenomImages.filter(Boolean).map((url, i) => (
                    <img key={i} src={url} alt={`FENM image ${i + 1}`} className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {sub.contact_phone && (
          <p className="text-sm text-gray-600 mt-3">
            <span className="font-semibold">Phone:</span> {sub.contact_phone}
          </p>
        )}

        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Admin notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
      </td>
    </tr>
  )
}

function SubmissionRow({ sub }: { sub: AdSubmission }) {
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null)
  const [status, setStatus] = useState(sub.status || 'pending')

  const updateStatus = async (newStatus: 'approved' | 'rejected') => {
    setLoading(newStatus === 'approved' ? 'approve' : 'reject')
    try {
      await fetch('/api/admin/ads/update-status', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: sub.id, status: newStatus }),
      })
      setStatus(newStatus)
    } finally {
      setLoading(null)
    }
  }

  const date = sub.created_at
    ? new Date(sub.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '—'

  const pkgs = [sub.package_ffnm, sub.package_fenm].filter(Boolean).join(' + ')

  return (
    <>
      <tr className="border-b border-gray-100 hover:bg-gray-50">
        <td className="px-4 py-3">
          <p className="font-semibold text-sm text-gray-900">{sub.contact_name || '—'}</p>
          <p className="text-xs text-gray-500">{sub.contact_email || ''}</p>
        </td>
        <td className="px-4 py-3 text-sm text-gray-700 capitalize">{sub.sites || '—'}</td>
        <td className="px-4 py-3 text-sm text-gray-700">{pkgs || '—'}</td>
        <td className="px-4 py-3 text-sm font-semibold" style={{ color: '#62438D' }}>
          {sub.total_price != null ? `$${Number(sub.total_price).toFixed(0)}` : '—'}
        </td>
        <td className="px-4 py-3">
          <StatusBadge status={status} />
        </td>
        <td className="px-4 py-3 text-xs text-gray-500">{date}</td>
        <td className="px-4 py-3">
          <div className="flex gap-2">
            {status === 'pending' && (
              <>
                <button
                  onClick={() => updateStatus('approved')}
                  disabled={loading !== null}
                  className="text-xs px-3 py-1.5 rounded-full font-semibold text-white disabled:opacity-60"
                  style={{ background: '#065F46' }}
                >
                  {loading === 'approve' ? '...' : 'Approve'}
                </button>
                <button
                  onClick={() => updateStatus('rejected')}
                  disabled={loading !== null}
                  className="text-xs px-3 py-1.5 rounded-full font-semibold text-white disabled:opacity-60"
                  style={{ background: '#991B1B' }}
                >
                  {loading === 'reject' ? '...' : 'Reject'}
                </button>
              </>
            )}
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs px-3 py-1.5 rounded-full font-semibold border border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              {expanded ? 'Collapse' : 'Details'}
            </button>
          </div>
        </td>
      </tr>
      {expanded && <ExpandedRow sub={sub} />}
    </>
  )
}

export default function AdSubmissionsTable({ submissions }: { submissions: AdSubmission[] }) {
  const [activeTab, setActiveTab] = useState<StatusTab>('Pending')

  const filtered = submissions.filter((s) => {
    if (activeTab === 'All') return true
    return (s.status || '').toLowerCase() === activeTab.toLowerCase()
  })

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex gap-1 p-4 border-b border-gray-200">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
            style={{
              background: activeTab === tab ? '#62438D' : '#f3f4f6',
              color: activeTab === tab ? '#fff' : '#374151',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Contact</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Sites</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Package(s)</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Submitted</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-400 text-sm">
                  No submissions in this category.
                </td>
              </tr>
            ) : (
              filtered.map((sub) => (
                <SubmissionRow key={String(sub.id)} sub={sub} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
