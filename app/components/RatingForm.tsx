'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase-client'
import AvailableDishesSelector from './AvailableDishesSelector'

interface RatingFormProps {
  listingId: number
  listingName: string
  listingSlug: string
  category: 'restaurant' | 'grocery'
  businessType: string | undefined | null
}

export default function RatingForm({ listingId, listingName, listingSlug, category, businessType }: RatingFormProps) {
  const supabase = useMemo(() => createClient(), [])
  const [step, setStep] = useState<'email' | 'verify' | 'rate'>('email')
  const [email, setEmail] = useState('')
  const [newsletterOptIn, setNewsletterOptIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [justVerified, setJustVerified] = useState(false)

  // Restaurant state
  const [tasteStyle, setTasteStyle] = useState('')
  const [price, setPrice] = useState(0)
  const [portionSize, setPortionSize] = useState(0)
  const [goodFor, setGoodFor] = useState<string[]>([])
  const [parking, setParking] = useState('')

  // Grocery state
  const [whatTheyHave, setWhatTheyHave] = useState<string[]>([])
  const [selection, setSelection] = useState(0)
  const [readyToEat, setReadyToEat] = useState('')

  // Dish tags state (restaurant types only)
  const [selectedDishIds, setSelectedDishIds] = useState<number[]>([])

  // Food tag pills — hardcoded dish names that update review_keywords
  const [selectedFoodTags, setSelectedFoodTags] = useState<string[]>([])

  // Check for active session on mount and listen for magic link sign-in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        setEmail(session.user.email)
        setStep('rate')
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.email) {
        setEmail(session.user.email)
        setStep('rate')
        setJustVerified(true)
        setTimeout(() => {
          setJustVerified(false)
          window.history.replaceState({}, '', window.location.pathname)
        }, 5000)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.href,
      },
    })

    if (otpError) {
      setError(otpError.message || 'Failed to send magic link')
      setLoading(false)
      return
    }

    setStep('verify')
    setLoading(false)
  }

  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const ratingData: any = {
      listing_id: listingId,
      listing_category: category,
      dish_tag_ids: selectedDishIds,
      dish_tags: selectedFoodTags,
      newsletter_opt_in: newsletterOptIn,
    }

    if (category === 'restaurant') {
      if (!tasteStyle || !price || !portionSize || !parking) {
        setError('Please answer all questions')
        setLoading(false)
        return
      }
      ratingData.taste_style = tasteStyle
      ratingData.price = price
      ratingData.portion_size = portionSize
      ratingData.good_for = goodFor
      ratingData.parking = parking
    } else {
      if (!selection || !price || !readyToEat || !parking) {
        setError('Please answer all questions')
        setLoading(false)
        return
      }
      ratingData.what_they_have = whatTheyHave
      ratingData.selection = selection
      ratingData.price = price
      ratingData.ready_to_eat = readyToEat
      ratingData.parking = parking
    }

    try {
      const res = await fetch('/api/submit-rating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ratingData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to submit rating')
        setLoading(false)
        return
      }

      setSuccess(true)
    } catch (err) {
      setError('Network error. Please try again.')
    }

    setLoading(false)
  }

  const toggleGoodFor = (value: string) => {
    setGoodFor(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    )
  }

  const toggleWhatTheyHave = (value: string) => {
    setWhatTheyHave(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    )
  }

  const toggleFoodTag = (tag: string) => {
    setSelectedFoodTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank you!</h3>
        <p className="text-gray-700">Your rating has been submitted and will help others in the community.</p>
      </div>
    )
  }

  if (step === 'email') {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Rate {listingName}</h2>
        <p className="text-gray-600 mb-6">Help the community by sharing your experience</p>

        <form onSubmit={handleEmailSubmit}>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Why verify your email?</strong>
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ One rating per person (keeps it fair)</li>
              <li>✓ Prevents spam and fake reviews</li>
              <li>✓ Protects local businesses</li>
              <li>✓ Your email stays 100% private</li>
            </ul>
          </div>

          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-4"
            placeholder="your@email.com"
          />

          <label className="flex items-start gap-3 mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={newsletterOptIn}
              onChange={(e) => setNewsletterOptIn(e.target.checked)}
              className="mt-1 shrink-0"
            />
            <span className="text-sm text-gray-600">
              Send me updates about new Filipino restaurants and events (optional)
            </span>
          </label>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>

          <p className="text-xs text-gray-500 mt-4 text-center">
            By continuing, you agree to our{' '}
            <a href="/community-guidelines" className="text-blue-600 hover:underline">
              Community Guidelines
            </a>
          </p>
        </form>
      </div>
    )
  }

  if (step === 'verify') {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">✉️ Check Your Email</h2>
        <p className="text-gray-700 mb-6">
          We sent a magic link to <strong>{email}</strong>
        </p>
        <p className="text-gray-600 text-sm mb-6">
          Click the magic link in your email and you'll be brought back here to complete your rating.
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-4">
          <p className="text-gray-700 text-sm mb-2">
            📬 Didn't receive it?
          </p>
          <ul className="text-gray-600 text-sm space-y-1 mb-3">
            <li>• Check your spam/junk folder</li>
            <li>• Wait a few minutes (emails can be delayed)</li>
          </ul>
          <button
            onClick={() => setStep('email')}
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            ← Try a different email address
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 mt-4">
            {error}
          </div>
        )}
      </div>
    )
  }

  // Rating form (step === 'rate')
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      {/* Success message after email verification */}
      {justVerified && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 font-medium flex items-center">
            <span className="text-2xl mr-2">✓</span>
            Email verified! You can now submit your rating for {listingName}.
          </p>
        </div>
      )}

      <h2 className="text-3xl font-bold text-gray-900 mb-2">Rate {listingName}</h2>
      <p className="text-gray-600 mb-6">
        {category === 'restaurant' ? '5 quick questions' : '5 quick questions about this market'}
      </p>

      <form onSubmit={handleRatingSubmit} className="space-y-6">
        {category === 'restaurant' ? (
          <>
            {/* Taste Style */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                1. How would you describe the taste?
              </label>
              <div className="space-y-2">
                {[
                  { value: 'traditional', label: '🇵🇭 Traditional/Authentic', desc: 'Just like back home' },
                  { value: 'fusion', label: '🔄 Fusion', desc: 'Filipino meets other flavors' },
                  { value: 'americanized', label: '🍔 Americanized', desc: 'Adapted to Western taste' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                      tasteStyle === option.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="taste_style"
                      value={option.value}
                      checked={tasteStyle === option.value}
                      onChange={(e) => setTasteStyle(e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-semibold">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                2. What's the price range?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 1, label: '💵 Budget', desc: 'Great value' },
                  { value: 2, label: '💵💵 Moderate', desc: 'Fair pricing' },
                  { value: 3, label: '💵💵💵 Premium', desc: 'Splurge-worthy' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                      price === option.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="price"
                      value={option.value}
                      checked={price === option.value}
                      onChange={(e) => setPrice(parseInt(e.target.value))}
                      className="sr-only"
                    />
                    <div className="text-2xl mb-2">{option.label.split(' ')[0]}</div>
                    <div className="font-semibold text-sm">{option.label.split(' ')[1]}</div>
                    <div className="text-xs text-gray-600">{option.desc}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* Portion Size */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                3. How are the portions?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 1, emoji: '🍽️', label: 'Just right', desc: 'Perfect amount' },
                  { value: 2, emoji: '🍽️🍽️', label: 'Generous', desc: 'Filling!' },
                  { value: 3, emoji: '🍽️🍽️🍽️', label: 'Huge', desc: 'Leftovers guaranteed!' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                      portionSize === option.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="portion_size"
                      value={option.value}
                      checked={portionSize === option.value}
                      onChange={(e) => setPortionSize(parseInt(e.target.value))}
                      className="sr-only"
                    />
                    <div className="text-3xl mb-2">{option.emoji}</div>
                    <div className="font-semibold text-sm">{option.label}</div>
                    <div className="text-xs text-gray-600 text-center">{option.desc}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* Good For */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                4. Good for: <span className="text-sm text-gray-600 font-normal">(select all that apply)</span>
              </label>
              <div className="space-y-2">
                {[
                  { value: 'families', label: '👨‍👩‍👧‍👦 Families with kids' },
                  { value: 'takeout', label: '🥡 Takeout/Delivery' },
                  { value: 'date_night', label: '💑 Date night' },
                  { value: 'large_groups', label: '👥 Large groups/parties' },
                  { value: 'quick_bite', label: '⚡ Quick bite' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition ${
                      goodFor.includes(option.value)
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={goodFor.includes(option.value)}
                      onChange={() => toggleGoodFor(option.value)}
                      className="mr-3"
                    />
                    <span className="font-medium">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Parking */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                5. Parking situation?
              </label>
              <div className="space-y-2">
                {[
                  { value: 'easy', label: '🅿️ Easy', desc: 'Lot or valet available' },
                  { value: 'street', label: '🚗 Street parking', desc: 'May take a few tries' },
                  { value: 'limited', label: '⚠️ Limited', desc: 'Plan ahead or carpool' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                      parking === option.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="parking"
                      value={option.value}
                      checked={parking === option.value}
                      onChange={(e) => setParking(e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-semibold">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Available Dishes — shown only for Restaurant / Quick Bites / Food Truck */}
            <AvailableDishesSelector
              businessType={businessType}
              selectedIds={selectedDishIds}
              onChange={setSelectedDishIds}
            />
          </>
        ) : (
          <>
            {/* Grocery: What They Have */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                1. What does this market have? <span className="text-sm text-gray-600 font-normal">(select all that apply)</span>
              </label>
              <div className="space-y-2">
                {[
                  { value: 'produce', label: '🥬 Fresh produce (Filipino vegetables)' },
                  { value: 'meat', label: '🥩 Meat/seafood counter' },
                  { value: 'frozen', label: '🧊 Frozen Filipino meals' },
                  { value: 'dry_goods', label: '🍚 Dry goods/pantry staples' },
                  { value: 'bakery', label: '🥖 Bakery/pastries' },
                  { value: 'ready_to_eat', label: '🍱 Ready-to-eat section' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition ${
                      whatTheyHave.includes(option.value)
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={whatTheyHave.includes(option.value)}
                      onChange={() => toggleWhatTheyHave(option.value)}
                      className="mr-3"
                    />
                    <span className="font-medium">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Selection */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                2. How's the selection/variety?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 1, emoji: '🛒', label: 'Basic', desc: 'Essential items' },
                  { value: 2, emoji: '🛒🛒', label: 'Good variety', desc: 'Solid selection' },
                  { value: 3, emoji: '🛒🛒🛒', label: 'Everything!', desc: 'One-stop shop' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                      selection === option.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="selection"
                      value={option.value}
                      checked={selection === option.value}
                      onChange={(e) => setSelection(parseInt(e.target.value))}
                      className="sr-only"
                    />
                    <div className="text-3xl mb-2">{option.emoji}</div>
                    <div className="font-semibold text-sm">{option.label}</div>
                    <div className="text-xs text-gray-600 text-center">{option.desc}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* Price (same as restaurant) */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                3. Price range?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 1, label: '💵 Budget', desc: 'Great value' },
                  { value: 2, label: '💵💵 Moderate', desc: 'Fair pricing' },
                  { value: 3, label: '💵💵💵 Premium', desc: 'Higher-end' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                      price === option.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="price"
                      value={option.value}
                      checked={price === option.value}
                      onChange={(e) => setPrice(parseInt(e.target.value))}
                      className="sr-only"
                    />
                    <div className="text-2xl mb-2">{option.label.split(' ')[0]}</div>
                    <div className="font-semibold text-sm">{option.label.split(' ')[1]}</div>
                    <div className="text-xs text-gray-600">{option.desc}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* Ready-to-Eat */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                4. Ready-to-eat Filipino meals?
              </label>
              <div className="space-y-2">
                {[
                  { value: 'full_restaurant', label: '🍽️ Full restaurant/food court', desc: 'Like Grill City or PhilHouse' },
                  { value: 'hot_counter', label: '🥡 Hot food counter', desc: 'Grab-and-go, no seating' },
                  { value: 'frozen_only', label: '🧊 Frozen meals only', desc: 'Reheat at home' },
                  { value: 'none', label: '❌ No ready-to-eat', desc: 'Groceries only' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                      readyToEat === option.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="ready_to_eat"
                      value={option.value}
                      checked={readyToEat === option.value}
                      onChange={(e) => setReadyToEat(e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-semibold">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Parking (same as restaurant) */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                5. Parking situation?
              </label>
              <div className="space-y-2">
                {[
                  { value: 'easy', label: '🅿️ Easy', desc: 'Lot or valet available' },
                  { value: 'street', label: '🚗 Street parking', desc: 'May take a few tries' },
                  { value: 'limited', label: '⚠️ Limited', desc: 'Plan ahead or carpool' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                      parking === option.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="parking"
                      value={option.value}
                      checked={parking === option.value}
                      onChange={(e) => setParking(e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-semibold">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        {/* What did you try here? — optional food tag pills */}
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-1">
            What did you try here?{' '}
            <span className="text-sm text-gray-600 font-normal">(optional)</span>
          </label>
          <p className="text-sm text-gray-500 mb-3">Select any dishes you ordered</p>
          <div className="flex flex-wrap gap-2">
            {['Adobo', 'Lechon', 'Sisig', 'Lumpia', 'Halo-Halo', 'Pancit', 'Sinigang', 'Kare-Kare', 'Ube', 'Silog', 'Breakfast', 'Kamayan'].map((dish) => (
              <button
                key={dish}
                type="button"
                onClick={() => toggleFoodTag(dish)}
                className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition ${
                  selectedFoodTags.includes(dish)
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                {dish}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-lg disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Rating'}
        </button>

        <p className="text-xs text-gray-500 text-center">
          By submitting, you confirm this rating reflects your genuine experience and agree to our{' '}
          <a href="/community-guidelines" className="text-blue-600 hover:underline">
            Community Guidelines
          </a>
        </p>
      </form>
    </div>
  )
}