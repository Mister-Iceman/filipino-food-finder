import dynamic from 'next/dynamic'

const CityPageContent = dynamic(() => import('./CityPageContent'), { 
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center"><div className="text-xl">Loading...</div></div>
})

export default function CityPage({ params }: { params: Promise<{ state: string; city: string }> }) {
  return <CityPageContent params={params} />
}