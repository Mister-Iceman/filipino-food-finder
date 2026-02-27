interface AffiliateLink {
  label: string
  url: string
  note?: string
}

interface MakeItAtHomeProps {
  title?: string
  links: AffiliateLink[]
}

export default function MakeItAtHome({ title = 'Make It At Home', links }: MakeItAtHomeProps) {
  if (!links || links.length === 0) return null

  return (
    <aside
      className="my-10 rounded-xl border border-orange-200 bg-orange-50 overflow-hidden"
      aria-label="Make it at home — affiliate links"
    >
      {/* Header bar */}
      <div
        className="flex items-center gap-3 px-5 py-3"
        style={{ backgroundColor: '#CB5B16' }}
      >
        <span className="text-xl" aria-hidden="true">🛍️</span>
        <h3 className="text-white font-bold text-base tracking-wide">{title}</h3>
      </div>

      {/* Links */}
      <ul className="divide-y divide-orange-100 list-none m-0 p-0">
        {links.map((link) => (
          <li key={link.url} className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-sm hover:underline"
              style={{ color: '#CB5B16' }}
            >
              {link.label} →
            </a>
            {link.note && (
              <span className="text-gray-500 text-xs sm:before:content-['·'] sm:before:mr-2 sm:before:text-gray-400">
                {link.note}
              </span>
            )}
          </li>
        ))}
      </ul>

      {/* FTC disclosure */}
      <p className="px-5 py-2.5 text-xs text-gray-400 border-t border-orange-100 leading-relaxed">
        As an Amazon Associate, FilipinoFoodNearMe.org earns from qualifying purchases.{' '}
        <a href="/affiliate-disclosure" className="underline hover:text-gray-600">
          Learn more
        </a>
        .
      </p>
    </aside>
  )
}
