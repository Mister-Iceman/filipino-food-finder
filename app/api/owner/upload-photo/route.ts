// SQL: alter table listing_photos add column if not exists caption text;

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'

const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

interface OwnerSession {
  email: string
  listing_slug: string
  used: boolean
  expires_at: string
}

async function validateToken(token: string, listingSlug: string): Promise<OwnerSession | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data } = await supabase
    .from('owner_sessions')
    .select('email, listing_slug, used, expires_at')
    .eq('token', token)
    .single()
  const session = data as OwnerSession | null
  if (!session || session.used || session.listing_slug !== listingSlug) return null
  if (new Date(session.expires_at) < new Date()) return null
  return session
}

export async function POST(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const formData = await request.formData()
  const token = formData.get('token') as string | null
  const listingSlug = formData.get('listingSlug') as string | null
  const file = formData.get('file') as File | null

  if (!token || !listingSlug || !file) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const session = await validateToken(token, listingSlug)
  if (!session) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Only JPEG, PNG, and WebP images are allowed' }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File must be under 5MB' }, { status: 400 })
  }

  // Check photo count (approved + pending)
  const { count } = await supabase
    .from('listing_photos')
    .select('id', { count: 'exact', head: true })
    .eq('listing_id', listingSlug)
    .in('status', ['approved', 'pending'])

  if ((count ?? 0) >= 5) {
    return NextResponse.json({ error: 'Photo limit reached (5 max)' }, { status: 400 })
  }

  // Resize with sharp: max 1200px wide, JPEG 80%
  const buffer = Buffer.from(await file.arrayBuffer())
  const resized = await sharp(buffer)
    .resize({ width: 1200, withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toBuffer()

  const photoId = crypto.randomUUID()
  const storagePath = `${listingSlug}/${photoId}.jpg`

  const { error: uploadError } = await supabase.storage
    .from('listing-photos')
    .upload(storagePath, resized, { contentType: 'image/jpeg', upsert: false })

  if (uploadError) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }

  const { data: photo, error: dbError } = await supabase
    .from('listing_photos')
    .insert({
      listing_id: listingSlug,
      owner_email: session.email,
      storage_path: storagePath,
      status: 'pending',
    })
    .select()
    .single()

  if (dbError) {
    // Clean up storage if DB insert fails
    await supabase.storage.from('listing-photos').remove([storagePath])
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  return NextResponse.json({ success: true, photo })
}
