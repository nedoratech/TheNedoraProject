import { createServerClient } from '@nedora/db/client'
import { notFound } from 'next/navigation'
import ContentBlockEditor from '../../../_components/ContentBlockEditor'

async function getPage(id: string) {
  const supabase = await createServerClient()
  const { data: page } = await supabase
    .from('cms_pages')
    .select('*')
    .eq('id', id)
    .single()

  if (!page) return null

  const { data: blocks } = await supabase
    .from('cms_content_blocks')
    .select('*')
    .eq('page_slug', page.slug)
    .order('block_key')

  return { page, blocks: blocks ?? [] }
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function PageEditorPage({ params }: Props) {
  const { id } = await params
  const result = await getPage(id)

  if (!result) notFound()

  const { page, blocks } = result

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <p className="text-[0.65rem] tracking-[0.22em] uppercase font-bold text-nd-accent-bright mb-1">
          Pages / {page.slug}
        </p>
        <h1 className="text-[1.8rem] font-bold tracking-[-0.025em] text-nd-white">{page.title}</h1>
        <div className="flex items-center gap-3 mt-2">
          <span className={`text-[0.62rem] tracking-[0.12em] uppercase font-bold px-2 py-0.5 ${page.published ? 'bg-green-900/40 text-green-400' : 'bg-nd-grey-600/20 text-nd-grey-400'}`}>
            {page.published ? 'Published' : 'Draft'}
          </span>
          <span className="text-[0.72rem] text-nd-grey-600">
            {blocks.length} content block{blocks.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <ContentBlockEditor pageSlug={page.slug} blocks={blocks} />
    </div>
  )
}
