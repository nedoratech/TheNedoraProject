import { createServerClient } from '@nedora/db/client'

async function getMedia() {
  const supabase = await createServerClient()
  const { data } = await supabase
    .from('cms_media')
    .select('*')
    .order('created_at', { ascending: false })
  return data ?? []
}

export default async function MediaPage() {
  const media = await getMedia()

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[0.65rem] tracking-[0.22em] uppercase font-bold text-nd-accent-bright mb-1">Assets</p>
          <h1 className="text-[1.8rem] font-bold tracking-[-0.025em] text-nd-white">Media</h1>
        </div>
        <button className="text-[0.72rem] tracking-[0.12em] uppercase font-bold px-5 py-2.5 bg-nd-accent-mid text-nd-white hover:bg-nd-accent-bright transition-colors duration-200">
          Upload
        </button>
      </div>

      {media.length === 0 ? (
        <div className="border-2 border-dashed border-white/[0.1] py-24 text-center">
          <p className="text-[0.9rem] text-nd-grey-600">No media uploaded yet.</p>
          <p className="text-[0.78rem] text-nd-grey-600 mt-1">Upload images and files to use in content blocks.</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {media.map((item) => (
            <div key={item.id} className="border border-white/[0.08] hover:border-nd-accent-mid transition-colors group cursor-pointer">
              <div className="aspect-video bg-white/[0.04] flex items-center justify-center">
                {item.mime_type?.startsWith('image/') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.url} alt={item.alt_text ?? item.filename} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-nd-grey-600 text-[0.72rem] tracking-[0.1em] uppercase">{item.mime_type}</span>
                )}
              </div>
              <div className="px-3 py-2.5">
                <p className="text-[0.75rem] text-nd-white truncate">{item.filename}</p>
                <p className="text-[0.65rem] text-nd-grey-600 mt-0.5">{item.alt_text ?? '—'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
