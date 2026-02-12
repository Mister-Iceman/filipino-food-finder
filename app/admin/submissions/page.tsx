'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminSubmissionsPage() {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('pending')

  const ADMIN_PASSWORD = 'Filipino2026!' // Change this to your secure password

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
    const { data } = await supabase
      .from('business_submissions')
      .select('*')
      .eq('status', filter)
      .order('created_at', { ascending: false })
    
    setSubmissions(data || [])
    setLoading(false)
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadSubmissions()
    }
  }, [filter, isAuthenticated])

  const handleAction = async (submissionId: number, action: 'approve' | 'reject' | 'request_info', message?: string) => {
    setLoading(true)
    
    try {
      const response = await fetch(`/api/admin/${action}-submission`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId, message })
      })

      if (response.ok) {
        alert('Action completed successfully!')
        loadSubmissions()
      } else {
        alert('Action failed. Please try again.')
      }
    } catch (error) {
      alert('Error: ' + error)
    }
    
    setLoading(false)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Admin Login</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter admin password"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Business Submissions</h1>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium ${filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('info_requested')}
              className={`px-4 py-2 rounded-lg font-medium ${filter === 'info_requested' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Info Requested
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg font-medium ${filter === 'approved' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg font-medium ${filter === 'rejected' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Rejected
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No {filter} submissions
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div key={submission.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{submission.business_name}</h3>
                      <p className="text-gray-600">{submission.category_primary}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      submission.status === 'approved' ? 'bg-green-100 text-green-800' :
                      submission.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {submission.status}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p><strong>Address:</strong> {submission.address_street}, {submission.city}, {submission.state} {submission.zip}</p>
                      <p><strong>Phone:</strong> {submission.phone}</p>
                      <p><strong>Contact Email:</strong> {submission.contact_email}</p>
                      {submission.website && <p><strong>Website:</strong> <a href={submission.website} target="_blank" className="text-blue-600">{submission.website}</a></p>}
                    </div>
                    <div>
                      {submission.instagram_url && <p><strong>Instagram:</strong> <a href={submission.instagram_url} target="_blank" className="text-blue-600">Link</a></p>}
                      {submission.facebook_url && <p><strong>Facebook:</strong> <a href={submission.facebook_url} target="_blank" className="text-blue-600">Link</a></p>}
                      {submission.tiktok_url && <p><strong>TikTok:</strong> <a href={submission.tiktok_url} target="_blank" className="text-blue-600">Link</a></p>}
                      {submission.x_url && <p><strong>X:</strong> <a href={submission.x_url} target="_blank" className="text-blue-600">Link</a></p>}
                    </div>
                  </div>

                  {submission.description && (
                    <div className="mb-4">
                      <p className="text-sm"><strong>Description:</strong> {submission.description}</p>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 mb-4">
                    Submitted: {new Date(submission.created_at).toLocaleString()}
                  </div>

                  {submission.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(submission.id, 'approve')}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium disabled:bg-gray-400"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => {
                          const message = prompt('Enter message to request info:')
                          if (message) handleAction(submission.id, 'request_info', message)
                        }}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium disabled:bg-gray-400"
                      >
                        ? Request Info
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to reject this submission?')) {
                            handleAction(submission.id, 'reject')
                          }
                        }}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium disabled:bg-gray-400"
                      >
                        ✗ Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}