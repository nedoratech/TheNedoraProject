'use client'

import { useState } from 'react'
import { createBrowserClient } from '@nedora/db/client'

interface Block {
  id: string
  key: string
  locale: string
  value: string
  type: string
}

interface Props {
  pageSlug: string
  blocks: Block[]
}

export default function ContentBlockEditor({ pageSlug, blocks }: Props) {
  const [editing, setEditing] = useState<string | null>(null)
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(blocks.map((b) => [`${b.key}:${b.locale}`, b.value]))
  )
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const [locale, setLocale] = useState<'en' | 'ro'>('en')

  const visibleBlocks = blocks.filter((b) => b.locale === locale)

  async function handleSave(block: Block) {
    const key = `${block.key}:${block.locale}`
    setSaving(key)

    const supabase = createBrowserClient()
    await supabase
      .from('cms_content_blocks')
      .update({ value: values[key] })
      .eq('id', block.id)

    setSaving(null)
    setSaved(key)
    setEditing(null)
    setTimeout(() => setSaved(null), 2000)
  }

  return (
    <div>
      {/* Locale tabs */}
      <div className="flex gap-1 mb-6 border-b border-white/[0.08] pb-0">
        {(['en', 'ro'] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLocale(l)}
            className={`text-[0.68rem] tracking-[0.14em] uppercase font-bold px-4 py-2 border-b-2 -mb-px transition-colors ${
              l === locale
                ? 'border-nd-accent-mid text-nd-accent-bright'
                : 'border-transparent text-nd-grey-600 hover:text-nd-white'
            }`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Blocks */}
      <div className="flex flex-col gap-3">
        {visibleBlocks.length === 0 ? (
          <div className="text-[0.82rem] text-nd-grey-600 py-8 text-center border border-white/[0.06]">
            No content blocks for locale <strong>{locale.toUpperCase()}</strong>.
          </div>
        ) : (
          visibleBlocks.map((block) => {
            const key = `${block.key}:${block.locale}`
            const isEditing = editing === key
            const isSaving = saving === key
            const isSaved = saved === key

            return (
              <div key={block.id} className="border border-white/[0.08] bg-white/[0.02]">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
                  <span className="text-[0.72rem] font-mono text-nd-accent-bright">{block.key}</span>
                  <span className="text-[0.6rem] tracking-[0.12em] uppercase text-nd-grey-600 border border-white/10 px-1.5 py-0.5">{block.type}</span>
                </div>
                <div className="p-4">
                  {isEditing ? (
                    <div className="flex flex-col gap-2">
                      <textarea
                        value={values[key] ?? ''}
                        onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                        rows={block.type === 'richtext' ? 6 : 2}
                        className="w-full border border-nd-accent-mid/50 bg-nd-black/50 px-3 py-2 text-[0.88rem] text-nd-white resize-y focus:outline-none focus:border-nd-accent-mid transition-colors"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSave(block)}
                          disabled={isSaving}
                          className="text-[0.68rem] tracking-[0.1em] uppercase font-bold px-4 py-1.5 bg-nd-accent-mid text-nd-white hover:bg-nd-accent-bright transition-colors disabled:opacity-50"
                        >
                          {isSaving ? 'Saving…' : 'Save'}
                        </button>
                        <button
                          onClick={() => setEditing(null)}
                          className="text-[0.68rem] tracking-[0.1em] uppercase font-bold px-4 py-1.5 border border-white/20 text-nd-grey-400 hover:text-nd-white transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-[0.85rem] text-nd-grey-400 leading-[1.6] flex-1">
                        {values[key] || <em className="text-nd-grey-600">Empty</em>}
                      </p>
                      <button
                        onClick={() => setEditing(key)}
                        className="shrink-0 text-[0.65rem] tracking-[0.1em] uppercase font-bold text-nd-accent-mid hover:text-nd-accent-bright transition-colors"
                      >
                        {isSaved ? '✓ Saved' : 'Edit'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
