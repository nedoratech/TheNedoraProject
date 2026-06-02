import { createServerClient } from '@nedora/db/client'
import FlagToggle from '../../_components/FlagToggle'

async function getFlags() {
  const supabase = await createServerClient()
  const { data } = await supabase
    .from('cms_feature_flags')
    .select('*')
    .order('flag_key')
  return data ?? []
}

export default async function FlagsPage() {
  const flags = await getFlags()

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <p className="text-[0.65rem] tracking-[0.22em] uppercase font-bold text-nd-accent-bright mb-1">Configuration</p>
        <h1 className="text-[1.8rem] font-bold tracking-[-0.025em] text-nd-white">Feature Flags</h1>
        <p className="text-[0.85rem] text-nd-grey-400 mt-1">Toggle sections, features, and locale availability on the landing page.</p>
      </div>

      <div className="border border-white/[0.08] divide-y divide-white/[0.06]">
        {flags.length === 0 ? (
          <div className="px-6 py-10 text-center text-[0.82rem] text-nd-grey-600">
            No flags yet. Run <code className="font-mono text-nd-accent-bright">supabase db reset</code> to seed.
          </div>
        ) : (
          flags.map((flag) => (
            <div key={flag.id} className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors">
              <div className="flex-1">
                <div className="text-[0.82rem] font-mono text-nd-white">{flag.flag_key}</div>
                {flag.description && (
                  <div className="text-[0.75rem] text-nd-grey-600 mt-0.5">{flag.description}</div>
                )}
              </div>
              <FlagToggle id={flag.id} flagKey={flag.flag_key} enabled={flag.enabled} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
