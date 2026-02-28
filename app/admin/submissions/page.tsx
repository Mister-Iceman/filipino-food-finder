'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function AddedBanner() {
  const searchParams = useSearchParams()
  if (searchParams.get('added') !== '1') return null
  return (
    <div className="bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded-lg mb-6 font-medium">
      Business listing added successfully!
    </div>
  )
}

export default function AdminSubmissionsPage() {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('pending')
  const [infoModal, setInfoModal] = useState<{ id: number; name: string } | null>(null)
  const [infoMessage, setInfoMessage] = useState('')
  const [approveModal, setApproveModal] = useState<{ id: number; name: string } | null>(null)
  const [isPickupOnly, setIsPickupOnly] = useState(false)

  const ADMIN_PASSWORD = 'R@ikkonenProjpagkain2026'

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      loadSubmissions()
    } else {
      alert('Incorrect password')
    }
  }

  const loadSubmissions = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/get-submissions?status=${filter}`)
      const data = await response.json()
      setSubmissions(data.submissions || [])
    } catch (error) {
      console.error('Error loading submissions:', error)
      setSubmissions([])
    }
    setLoading(false)
  }

  useEffect(() => {
    if (isAuthenticated) loadSubmissions()
  }, [filter, isAuthenticated])

  const handleAction = async (submissionId: number, action: 'approve' | 'reject' | 'request_info', message?: string, pickupOnly?: boolean) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/${action}-submission`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId, message, is_pickup_only: pickupOnly ?? false })
      })
      if (response.ok) {
        alert('Action completed successfully!')
        loadSubmissions()
      } else {
        const error = await response.json()
        alert('Action failed: ' + (error.error || 'Unknown error'))
      }
    } catch (error) {
      alert('Error: ' + error)
    }
    setLoading(false)
  }

  const handleInfoSubmit = async () => {
    if (!infoMessage.trim()) { alert('Please enter a message'); return }
    await handleAction(infoModal!.id, 'request_info', infoMessage)
    setInfoModal(null)
    setInfoMessage('')
  }

  const handleApproveSubmit = async () => {
    await handleAction(approveModal!.id, 'approve', undefined, isPickupOnly)
    setApproveModal(null)
    setIsPickupOnly(false)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Admin Login</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter admin password"
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Suspense fallback={null}>
          <AddedBanner />
        </Suspense>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Business Submissions</h1>
            <p className="text-gray-600 mt-1">Review and manage incoming business listing requests</p>
          </div>
          <div className="flex gap-3">
            <a href="/admin/submissions/new" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold">
              + Add Business
            </a>
            <a href="/admin/events" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium text-sm">
              Events Admin →
            </a>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['pending', 'info_requested', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium capitalize ${filter === status ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border hover:bg-gray-50'}`}
            >
              {status === 'info_requested' ? 'Info Requested' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading submissions...</div>
        ) : submissions.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center text-gray-500">
            No {filter} submissions found.
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div key={submission.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h2 className="text-xl font-bold text-gray-900">{submission.business_name}</h2>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">{submission.primary_category}</span>
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        submission.status === 'approved' ? 'bg-green-100 text-green-800' :
                        submission.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>{submission.status}</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                      <p>📍 {submission.address_street}, {submission.city}, {submission.state} {submission.zip}</p>
                      <p>📞 {submission.phone}</p>
                      <p>✉️ {submission.contact_email}</p>
                      {submission.website && <p>🌐 <a href={submission.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{submission.website}</a></p>}
                    </div>
                    {submission.description && <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg mb-3">{submission.description}</p>}
                    {submission.status === 'info_requested' && submission.admin_notes && (
                      <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg mb-3">
                        <p className="text-sm text-blue-800"><strong>Info Requested:</strong> {submission.admin_notes}</p>
                      </div>
                    )}
                    {submission.is_pickup_only && (
                      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded">🛍️ Pickup & Pre-Order</span>
                    )}
                  </div>

                  {(submission.status === 'pending' || submission.status === 'info_requested') && (
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => { setApproveModal({ id: submission.id, name: submission.business_name }); setIsPickupOnly(false) }}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm disabled:opacity-50"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => { setInfoModal({ id: submission.id, name: submission.business_name }); setInfoMessage('') }}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm disabled:opacity-50"
                      >
                        ? Request Info
                      </button>
                      <button
                        onClick={() => { if (confirm('Reject this submission? The submitter will be notified.')) handleAction(submission.id, 'reject') }}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium text-sm disabled:opacity-50"
                      >
                        ✗ Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Requested Modal */}
      {infoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Request Additional Information</h2>
            <p className="text-sm text-gray-600 mb-4">For: <strong>{infoModal.name}</strong></p>
            <p className="text-sm text-gray-700 mb-2">Enter your message — this will be emailed to the submitter:</p>
            <textarea
              value={infoMessage}
              onChange={(e) => setInfoMessage(e.target.value)}
              rows={5}
              placeholder="e.g. Could you please confirm your business hours and provide a menu link or photo? We also need to verify your physical address before we can approve your listing."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-4 text-sm"
            />
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setInfoModal(null); setInfoMessage('') }} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium text-sm">Cancel</button>
              <button onClick={handleInfoSubmit} disabled={loading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm disabled:opacity-50">
                {loading ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {approveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Approve Listing</h2>
            <p className="text-sm text-gray-600 mb-4">Approving: <strong>{approveModal.name}</strong></p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPickupOnly}
                  onChange={(e) => setIsPickupOnly(e.target.checked)}
                  className="mt-0.5 w-5 h-5 accent-amber-500"
                />
                <div>
                  <p className="font-bold text-amber-900 text-sm">🛍️ Mark as Pickup & Pre-Order Only</p>
                  <p className="text-amber-700 text-xs mt-1">Check this for businesses operating from a shared/commercial kitchen, preorder-only bakeries, or pickup-only models — not traditional walk-in storefronts.</p>
                </div>
              </label>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setApproveModal(null); setIsPickupOnly(false) }} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium text-sm">Cancel</button>
              <button onClick={handleApproveSubmit} disabled={loading} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm disabled:opacity-50">
                {loading ? 'Approving...' : '✓ Confirm Approve'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
