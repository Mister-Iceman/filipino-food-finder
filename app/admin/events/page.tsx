'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const ADMIN_PASSWORD = 'FilipinoDirect2026!'

export default function EventsAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [events, setEvents] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    event_time: '',
    end_date: '',
    location_name: '',
    address_street: '',
    city: '',
    state: '',
    zip: '',
    event_url: '',
    ticket_url: '',
    image_url: '',
    category: 'festival',
    is_featured: false,
    is_sponsored: false
  })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    if (isAuthenticated) {
      loadEvents()
    }
  }, [isAuthenticated])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
    } else {
      alert('Incorrect password')
    }
  }

  const loadEvents = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: false })
    
    if (data) setEvents(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingId) {
      const { error } = await supabase
        .from('events')
        .update(formData)
        .eq('id', editingId)
      
      if (!error) {
        alert('Event updated!')
        resetForm()
        loadEvents()
      } else {
        alert('Error: ' + error.message)
      }
    } else {
      const { error } = await supabase
        .from('events')
        .insert([formData])
      
      if (!error) {
        alert('Event added!')
        resetForm()
        loadEvents()
      } else {
        alert('Error: ' + error.message)
      }
    }
  }

  const handleEdit = (event: any) => {
    setFormData({
      title: event.title || '',
      description: event.description || '',
      event_date: event.event_date || '',
      event_time: event.event_time || '',
      end_date: event.end_date || '',
      location_name: event.location_name || '',
      address_street: event.address_street || '',
      city: event.city || '',
      state: event.state || '',
      zip: event.zip || '',
      event_url: event.event_url || '',
      ticket_url: event.ticket_url || '',
      image_url: event.image_url || '',
      category: event.category || 'festival',
      is_featured: event.is_featured || false,
      is_sponsored: event.is_sponsored || false
    })
    setEditingId(event.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)
      
      if (!error) {
        alert('Event deleted!')
        loadEvents()
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      event_date: '',
      event_time: '',
      end_date: '',
      location_name: '',
      address_street: '',
      city: '',
      state: '',
      zip: '',
      event_url: '',
      ticket_url: '',
      image_url: '',
      category: 'festival',
      is_featured: false,
      is_sponsored: false
    })
    setEditingId(null)
    setShowForm(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Events Admin Login</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg"
            >
              Login
            </button>
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
            <Link href="/admin" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
              ← Back to Listings Admin
            </Link>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold"
          >
            {showForm ? 'Cancel' : '+ Add Event'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? 'Edit Event' : 'Add New Event'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Event Title *"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />

              <textarea
                placeholder="Event Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.event_date}
                    onChange={(e) => setFormData({...formData, event_date: e.target.value})}
                    className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Time</label>
                  <input
                    type="time"
                    value={formData.event_time}
                    onChange={(e) => setFormData({...formData, event_time: e.target.value})}
                    className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date (Optional)</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                    className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="festival">🎉 Festival</option>
                  <option value="grand_opening">🏪 Grand Opening</option>
                  <option value="pop_up">🍽️ Pop-Up</option>
                  <option value="cooking_class">🎓 Cooking Class</option>
                  <option value="community">🎊 Community Event</option>
                  <option value="tasting">🎤 Tasting & Demo</option>
                </select>
              </div>

              <input
                type="text"
                placeholder="Location Name (e.g., Jollibee Downtown)"
                value={formData.location_name}
                onChange={(e) => setFormData({...formData, location_name: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                placeholder="Street Address"
                value={formData.address_street}
                onChange={(e) => setFormData({...formData, address_street: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="grid md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="State (CA)"
                  maxLength={2}
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value.toUpperCase()})}
                  className="px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Zip Code"
                  value={formData.zip}
                  onChange={(e) => setFormData({...formData, zip: e.target.value})}
                  className="px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="url"
                  placeholder="Event URL (Learn More Link)"
                  value={formData.event_url}
                  onChange={(e) => setFormData({...formData, event_url: e.target.value})}
                  className="px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="url"
                  placeholder="Ticket URL (Buy Tickets Link)"
                  value={formData.ticket_url}
                  onChange={(e) => setFormData({...formData, ticket_url: e.target.value})}
                  className="px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <input
                type="url"
                placeholder="Image URL (Optional)"
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex gap-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                    className="mr-2 w-5 h-5"
                  />
                  <span className="font-medium">⭐ Featured Event</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_sponsored}
                    onChange={(e) => setFormData({...formData, is_sponsored: e.target.checked})}
                    className="mr-2 w-5 h-5"
                  />
                  <span className="font-medium">💰 Sponsored</span>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg"
                >
                  {editingId ? 'Update Event' : 'Add Event'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-8 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-3 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-8">
          {/* Upcoming Events */}
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
                    <th className="px-6 py-3 text-right text-sm font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {upcomingEvents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No upcoming events.
                      </td>
                    </tr>
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
                        <td className="px-6 py-4 text-right text-sm space-x-2">
                          <button
                            onClick={() => handleEdit(event)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Past Events */}
          {pastEvents.length > 0 && (
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
                      <th className="px-6 py-3 text-right text-sm font-bold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {pastEvents.map((event) => (
                      <tr key={event.id} className="hover:bg-gray-50 opacity-60">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{event.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(event.event_date)}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{event.city}, {event.state}</td>
                        <td className="px-6 py-4 text-right text-sm space-x-2">
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            Delete
                          </button>
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
    </div>
  )
}