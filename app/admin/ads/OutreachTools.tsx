'use client'

import { useState } from 'react'

const ADVERTISE_URL = 'https://filipinofoodnearme.org/advertise'

const OUTREACH_TEMPLATE = `Hey [name] 👋

We'd love to feature [Business Name] on FilipinoFoodNearMe.org — a Filipino food directory with 1,237+ listings nationwide across the U.S.

Check out our quick page showing exactly how it works, what your featured ad looks like, and our current Founding Advertiser pricing (30% off, locked in for life):

filipinofoodnearme.org/advertise

Takes 5 minutes to set up, no commitment, no sales call needed. Salamat! 🙏`

export default function OutreachTools() {
  const [linkCopied, setLinkCopied] = useState(false)
  const [templateOpen, setTemplateOpen] = useState(false)
  const [templateCopied, setTemplateCopied] = useState(false)

  const copyLink = async () => {
    await navigator.clipboard.writeText(ADVERTISE_URL)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  const copyTemplate = async () => {
    await navigator.clipboard.writeText(OUTREACH_TEMPLATE)
    setTemplateCopied(true)
    setTimeout(() => setTemplateCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Outreach Tools</h2>

      {/* Share link */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-500 mb-2">Advertise page link (share this)</p>
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
          <span className="text-sm text-gray-700 font-mono flex-1 min-w-0 truncate">
            filipinofoodnearme.org/advertise
          </span>
          <button
            onClick={copyLink}
            className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-all whitespace-nowrap"
            style={{
              borderColor: '#62438D',
              color: linkCopied ? '#fff' : '#62438D',
              background: linkCopied ? '#62438D' : 'transparent',
            }}
          >
            {linkCopied ? 'Copied!' : 'Copy link'}
          </button>
        </div>
      </div>

      {/* DM/Email template */}
      <div>
        <button
          onClick={() => setTemplateOpen(!templateOpen)}
          className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide hover:text-gray-700"
        >
          DM / Email template <span>{templateOpen ? '▴' : '▾'}</span>
        </button>

        {templateOpen && (
          <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
              {OUTREACH_TEMPLATE}
            </pre>
            <button
              onClick={copyTemplate}
              className="mt-3 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all"
              style={{
                borderColor: '#62438D',
                color: templateCopied ? '#fff' : '#62438D',
                background: templateCopied ? '#62438D' : 'transparent',
              }}
            >
              {templateCopied ? 'Copied!' : 'Copy template'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
