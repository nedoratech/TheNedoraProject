'use client'

import { useState } from 'react'
import { createBrowserClient } from '@nedora/db/client'

interface Props {
  id: string
  flagKey: string
  enabled: boolean
}

export default function FlagToggle({ id, flagKey, enabled: initial }: Props) {
  const [enabled, setEnabled] = useState(initial)
  const [saving, setSaving] = useState(false)

  async function toggle() {
    setSaving(true)
    const supabase = createBrowserClient()
    await supabase
      .from('cms_feature_flags')
      .update({ enabled: !enabled })
      .eq('id', id)
    setEnabled(!enabled)
    setSaving(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={saving}
      title={enabled ? 'Disable flag' : 'Enable flag'}
      className={`relative w-10 h-5 transition-colors duration-200 focus:outline-none disabled:opacity-50 ${
        enabled ? 'bg-nd-accent-mid' : 'bg-white/[0.1]'
      }`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 bg-nd-white transition-transform duration-200 ${
          enabled ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}
