'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const ADMIN_PASSWORD = 'R@ikkonenProjpagkain2026'

export default function EventsAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [events, setEvents] = useState<any[]>([])
  const [submissions, setSubmissions] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'submissions' | 'upcoming' | 'past'>('submissions')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [togglingFenm, setTogglingFenm] = useState<Set<number>>(new Set())

  const [formData, setFormData] = useState({
    title: '', description: '', event_date: '', event_time: '', end_date: '',
    location_name: '', address_street: '', city: '', state: '', zip: '',
    event_url: '', ticket_url: '', image_url: '', category: 'festival',
    is_featured: false, is_sponsored: false
  })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    if (isAuthenticated) {
      loadEvents()
      loadSubmissions()
    }
  }, [isAuthenticated])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) setIsAuthenticated(true)
    else alert('Incorrect password')
  }

  const loadEvents = async () => {
    setLoading(true)
    const { data } = await supabase.from('events').select('*').order('event_date', { ascending: false })
    if (data) setEvents(data)
    setLoading(false)
  }

  const loadSubmissions = async () => {
    const { data } = await supabase
      .from('event_submissions')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    if (data) setSubmissions(data)
  }

  const handleApprove = async (id: number) => {
    setActionLoading(id)
    const response = await fetch('/api/admin/approve-event-submission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submissionId: id })
    })
    if (response.ok) {
      alert('Event approved and published!')
      loadSubmissions()
      loadEvents()
    } else {
      alert('Error approving event')
    }
    setActionLoading(null)
  }

  const handleReject = async (id: number) => {
    if (!confirm('Reject this event submission? The submitter will be notified by email.')) return
    setActionLoading(id)
    const response = await fetch('/api/admin/reject-event-submission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submissionId: id })
    })
    if (response.ok) {
      alert('Event rejected. Submitter notified.')
      loadSubmissions()
    } else {
      alert('Error rejecting event')
    }
    setActionLoading(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const endpoint = editingId ? '/api/admin/events/update' : '/api/admin/events/create'
    const body = editingId
      ? { password: ADMIN_PASSWORD, eventId: editingId, eventData: Object.fromEntries(Object.entries(formData).map(([k, v]) => [k, v === '' ? null : v])) }
      : { password: ADMIN_PASSWORD, eventData: Object.fromEntries(Object.entries(formData).map(([k, v]) => [k, v === '' ? null : v])) }
    const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (response.ok) { alert(editingId ? 'Event updated!' : 'Event added!'); resetForm(); loadEvents() }
    else { const err = await response.json(); alert('Error: ' + err.error) }
    setLoading(false)
  }

  const handleEdit = (event: any) => {
    setFormData({
      title: event.title || '', description: event.description || '',
      event_date: event.event_date || '', event_time: event.event_time || '',
      end_date: event.end_date || '', location_name: event.location_name || '',
      address_street: event.address_street || '', city: event.city || '',
      state: event.state || '', zip: event.zip || '',
      event_url: event.event_url || '', ticket_url: event.ticket_url || '',
      image_url: event.image_url || '', category: event.category || 'festival',
      is_featured: event.is_featured || false, is_sponsored: event.is_sponsored || false
    })
    setEditingId(event.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return
    setLoading(true)
    const response = await fetch('/api/admin/events/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: ADMIN_PASSWORD, eventId: id })
    })
    if (response.ok) { alert('Event deleted!'); loadEvents() }
    else { const err = await response.json(); alert('Error: ' + err.error) }
    setLoading(false)
  }

  const handleFenmToggle = async (eventId: number, currentValue: boolean) => {
    setTogglingFenm(prev => new Set(prev).add(eventId))
    const { error } = await supabase
      .from('events')
      .update({ show_on_fenm: !currentValue })
      .eq('id', eventId)
    if (error) {
      alert('Error updating FENM toggle: ' + error.message)
    } else {
      await loadEvents()
    }
    setTogglingFenm(prev => { const next = new Set(prev); next.delete(eventId); return next })
  }

  const resetForm = () => {
    setFormData({ title: '', description: '', event_date: '', event_time: '', end_date: '', location_name: '', address_street: '', city: '', state: '', zip: '', event_url: '', ticket_url: '', image_url: '', category: 'festival', is_featured: false, is_sponsored: false })
    setEditingId(null)
    setShowForm(false)
  }

  const formatDate = (date: string) => {
    const [year, month, day] = date.split('-').map(Number)
    return new Date(year, month - 1, day).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Events Admin Login</h1>
          <form onSubmit={handleLogin}>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter admin password" className="w-full px-4 py-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none" />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg">Login</button>
          </form>
        </div>
      </div>
    )
  }

  const upcomingEvents = events.filter(e => new Date(e.event_date) >= new Date())
  const pastEvents = events.filter(e => new Date(e.event_date) < new Date())

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Events Management</h1>
            <Link href="/admin/submissions" className="text-blue-600 hover:underline text-sm mt-2 inline-block">← Back to Listings Admin</Link>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold">
            {showForm ? 'Cancel' : '+ Add Event'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Event' : 'Add New Event'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Event Title *" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
              <textarea placeholder="Event Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={4} className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
              <div className="grid md:grid-cols-3 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Event Date *</label><input type="date" required value={formData.event_date} onChange={(e) => setFormData({...formData, event_date: e.target.value})} className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Event Time</label><input type="time" value={formData.event_time} onChange={(e) => setFormData({...formData, event_time: e.target.value})} className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">End Date</label><input type="date" value={formData.end_date} onChange={(e) => setFormData({...formData, end_date: e.target.value})} className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" /></div>
              </div>
              <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
                <option value="festival">🎉 Festival</option>
                <option value="grand_opening">🏪 Grand Opening</option>
                <option value="pop_up">🍽️ Pop-Up</option>
                <option value="cooking_class">🎓 Cooking Class</option>
                <option value="community">🎊 Community Event</option>
                <option value="tasting">🎤 Tasting & Demo</option>
              </select>
              <input type="text" placeholder="Location Name" value={formData.location_name} onChange={(e) => setFormData({...formData, location_name: e.target.value})} className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" placeholder="Street Address" value={formData.address_street} onChange={(e) => setFormData({...formData, address_street: e.target.value})} className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
              <div className="grid md:grid-cols-3 gap-4">
                <input type="text" placeholder="City" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" placeholder="State (CA)" maxLength={2} value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value.toUpperCase()})} className="px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" placeholder="Zip Code" value={formData.zip} onChange={(e) => setFormData({...formData, zip: e.target.value})} className="px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <input type="text" placeholder="Event URL" value={formData.event_url} onChange={(e) => setFormData({...formData, event_url: e.target.value})} className="px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" placeholder="Ticket URL" value={formData.ticket_url} onChange={(e) => setFormData({...formData, ticket_url: e.target.value})} className="px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <input type="text" placeholder="Image URL (Optional)" value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
              <div className="flex gap-6">
                <label className="flex items-center"><input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({...formData, is_featured: e.target.checked})} className="mr-2 w-5 h-5" /><span className="font-medium">⭐ Featured</span></label>
                <label className="flex items-center"><input type="checkbox" checked={formData.is_sponsored} onChange={(e) => setFormData({...formData, is_sponsored: e.target.checked})} className="mr-2 w-5 h-5" /><span className="font-medium">💰 Sponsored</span></label>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg disabled:bg-gray-400">{loading ? 'Processing...' : (editingId ? 'Update Event' : 'Add Event')}</button>
                <button type="button" onClick={resetForm} className="px-8 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-3 rounded-lg">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setActiveTab('submissions')} className={`px-6 py-3 rounded-lg font-bold text-sm ${activeTab === 'submissions' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border hover:bg-gray-50'}`}>
            Pending Submissions {submissions.length > 0 && <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{submissions.length}</span>}
          </button>
          <button onClick={() => setActiveTab('upcoming')} className={`px-6 py-3 rounded-lg font-bold text-sm ${activeTab === 'upcoming' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border hover:bg-gray-50'}`}>
            Upcoming ({upcomingEvents.length})
          </button>
          <button onClick={() => setActiveTab('past')} className={`px-6 py-3 rounded-lg font-bold text-sm ${activeTab === 'past' ? 'bg-gray-600 text-white' : 'bg-white text-gray-700 border hover:bg-gray-50'}`}>
            Past ({pastEvents.length})
          </button>
        </div>

        {/* Pending Submissions Tab */}
        {activeTab === 'submissions' && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 bg-purple-50 border-b">
              <h2 className="text-2xl font-bold">Pending Event Submissions ({submissions.length})</h2>
              <p className="text-sm text-gray-600 mt-1">Review and approve or reject community-submitted events</p>
            </div>
            {submissions.length === 0 ? (
              <div className="p-12 text-center text-gray-500">No pending event submissions.</div>
            ) : (
              <div className="divide-y">
                {submissions.map((sub) => (
                  <div key={sub.id} className="p-6">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{sub.title}</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-2">
                          <span>📅 {sub.event_date}</span>
                          <span>📍 {sub.city}, {sub.state}</span>
                          <span>🏷️ {sub.category}</span>
                          <span>👤 {sub.submitter_name} — {sub.submitter_email}</span>
                        </div>
                        {sub.description && <p className="text-sm text-gray-700 mb-2">{sub.description}</p>}
                        {sub.event_url && <p className="text-sm text-blue-600"><a href={sub.event_url} target="_blank" rel="noopener noreferrer">{sub.event_url}</a></p>}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleApprove(sub.id)}
                          disabled={actionLoading === sub.id}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold text-sm disabled:opacity-50"
                        >
                          {actionLoading === sub.id ? '...' : '✓ Approve'}
                        </button>
                        <button
                          onClick={() => handleReject(sub.id)}
                          disabled={actionLoading === sub.id}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-sm disabled:opacity-50"
                        >
                          {actionLoading === sub.id ? '...' : '✗ Reject'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Upcoming Events Tab */}
        {activeTab === 'upcoming' && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 bg-green-50 border-b">
              <h2 className="text-2xl font-bold">Upcoming Events ({upcomingEvents.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Title</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Location</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Category</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-gray-700">FENM</th>
                    <th className="px-6 py-3 text-right text-sm font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {upcomingEvents.length === 0 ? (
                    <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500">No upcoming events.</td></tr>
                  ) : (
                    upcomingEvents.map((event) => (
                      <tr key={event.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{event.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(event.event_date)}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{event.city}, {event.state}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{event.category}</td>
                        <td className="px-6 py-4 text-sm">
                          {event.is_featured && <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs mr-1">⭐ Featured</span>}
                          {event.is_sponsored && <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">💰 Sponsored</span>}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleFenmToggle(event.id, event.show_on_fenm)}
                            disabled={togglingFenm.has(event.id)}
                            title={event.show_on_fenm ? 'Shown on FENM — click to hide' : 'Hidden from FENM — click to show'}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 focus:outline-none ${event.show_on_fenm ? 'bg-green-500' : 'bg-gray-300'}`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${togglingFenm.has(event.id) ? 'animate-pulse' : ''} ${event.show_on_fenm ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right text-sm space-x-2">
                          <button onClick={() => handleEdit(event)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                          <button onClick={() => handleDelete(event.id)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Past Events Tab */}
        {activeTab === 'past' && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 bg-gray-50 border-b">
              <h2 className="text-2xl font-bold">Past Events ({pastEvents.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Title</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Location</th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-gray-700">FENM</th>
                    <th className="px-6 py-3 text-right text-sm font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pastEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50 opacity-60">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{event.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDate(event.event_date)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{event.city}, {event.state}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleFenmToggle(event.id, event.show_on_fenm)}
                          disabled={togglingFenm.has(event.id)}
                          title={event.show_on_fenm ? 'Shown on FENM — click to hide' : 'Hidden from FENM — click to show'}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 focus:outline-none ${event.show_on_fenm ? 'bg-green-500' : 'bg-gray-300'}`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${togglingFenm.has(event.id) ? 'animate-pulse' : ''} ${event.show_on_fenm ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right text-sm">
                        <button onClick={() => handleDelete(event.id)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
