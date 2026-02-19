"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function OwnerEditPage() {
  const params = useParams()
  const slug = params.slug as string
  const [listing, setListing] = useState<{id: string, name: string, city: string, state: string} | null>(null)
  const [ownerName, setOwnerName] = useState("")
  const [ownerEmail, setOwnerEmail] = useState("")
  const [newHours, setNewHours] = useState("")
  const [newWebsite, setNewWebsite] = useState("")
  const [newPhone, setNewPhone] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [newInstagram, setNewInstagram] = useState("")
  const [newFacebook, setNewFacebook] = useState("")
  const [newTiktok, setNewTiktok] = useState("")
  const [notes, setNotes] = useState("")
  const [status, setStatus] = useState("idle")
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    if (!slug) return
    fetch("/api/listing-info?slug=" + slug).then(r => r.json()).then(data => { if (data.id) setListing(data) })
  }, [slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    const res = await fetch("/api/owner-update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listing_id: listing?.id, listing_name: listing?.name, listing_city: listing?.city, listing_state: listing?.state, owner_name: ownerName, owner_email: ownerEmail, new_hours: newHours || null, new_website: newWebsite || null, new_phone: newPhone || null, new_description: newDescription || null, new_instagram_url: newInstagram || null, new_facebook_url: newFacebook || null, new_tiktok_url: newTiktok || null, notes: notes || null })
    })
    const data = await res.json()
    if (res.ok) { setStatus("success") } else { setStatus("error"); setErrorMsg(data.error || "Something went wrong.") }
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-xl shadow-lg p-12 max-w-md w-full text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Salamat! Update Submitted</h1>
          <p className="text-gray-600 mb-2">We received your update for <strong>{listing?.name}</strong>.</p>
          <p className="text-gray-500 text-sm mb-6">Our team will review and apply changes within 2-3 business days.</p>
          <Link href={"/listings/" + slug} className="text-blue-600 hover:underline text-sm">Back to listing</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <nav className="text-sm mb-6 text-gray-600">
          <Link href="/" className="hover:underline hover:text-blue-600">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href={"/listings/" + slug} className="hover:underline hover:text-blue-600">{listing?.name || "Listing"}</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">Update Listing Info</span>
        </nav>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">📝</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Update Your Listing</h1>
            {listing && <p className="text-blue-600 font-semibold">{listing.name}</p>}
            {listing && <p className="text-gray-500 text-sm">{listing.city}, {listing.state}</p>}
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">Only fill in the fields you want to update. All changes are reviewed before going live.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4 pb-5 border-b border-gray-200">
              <p className="text-sm font-bold text-gray-700 uppercase tracking-wide">Your Info</p>
              <input type="text" value={ownerName} onChange={e => setOwnerName(e.target.value)} required placeholder="Your Name *" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
              <input type="email" value={ownerEmail} onChange={e => setOwnerEmail(e.target.value)} required placeholder="Your Email *" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>
            <div className="space-y-4">
              <p className="text-sm font-bold text-gray-700 uppercase tracking-wide">Business Info</p>
              <input type="text" value={newHours} onChange={e => setNewHours(e.target.value)} placeholder="Hours (e.g. Mon-Fri 10am-9pm)" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
              <input type="url" value={newWebsite} onChange={e => setNewWebsite(e.target.value)} placeholder="Website URL" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
              <input type="tel" value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="Phone Number" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
              <textarea value={newDescription} onChange={e => setNewDescription(e.target.value)} rows={3} placeholder="Description - tell the community about your business..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none" />
            </div>
            <div className="space-y-4 border-t border-gray-200 pt-5">
              <p className="text-sm font-bold text-gray-700 uppercase tracking-wide">Social Media</p>
              <input type="url" value={newInstagram} onChange={e => setNewInstagram(e.target.value)} placeholder="Instagram URL" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
              <input type="url" value={newFacebook} onChange={e => setNewFacebook(e.target.value)} placeholder="Facebook URL" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
              <input type="url" value={newTiktok} onChange={e => setNewTiktok(e.target.value)} placeholder="TikTok URL" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>
            <div className="border-t border-gray-200 pt-5">
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Anything else? e.g. we moved, menu changed..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none" />
            </div>
            {status === "error" && <div className="bg-red-50 border border-red-200 rounded-lg p-3"><p className="text-red-700 text-sm">{errorMsg}</p></div>}
            <button type="submit" disabled={status === "loading"} className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-60">{status === "loading" ? "Submitting..." : "Submit Update Request"}</button>
            <p className="text-xs text-gray-400 text-center">Changes reviewed within 2-3 business days.</p>
          </form>
        </div>
      </div>
    </div>
  )
}
