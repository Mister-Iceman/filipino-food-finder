import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

// Called by the admin client after a direct Supabase listing insert to bust
// the /directory data cache immediately, without waiting for the 2-minute TTL.
export async function POST() {
  revalidatePath('/directory')
  return NextResponse.json({ revalidated: true })
}
