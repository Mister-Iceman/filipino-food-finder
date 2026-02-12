import CityPageClient from './CityPageClient'

export default async function CityPage({ 
  params 
}: { 
  params: Promise<{ state: string; city: string }> 
}) {
  const { state, city } = await params
  
  return <CityPageClient state={state} city={city} />
}