import { Suspense } from 'react'
import DirectoryContent from './DirectoryContent'

export const metadata = {
  title: 'Filipino Restaurant Directory | Filipino Food Near Me',
  description: 'Browse our complete directory of Filipino restaurants, bakeries, grocery stores, and food trucks across America.',
}

export default function DirectoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    }>
      <DirectoryContent />
    </Suspense>
  )
}