import { Link } from '@/i18n/navigation'

export interface PrivacySection {
  id: string
  title: string
  paragraphs: string[]
  list?: string[]
}

export interface PrivacyPolicyContent {
  label: string
  title: string
  updated: string
  intro: string
  sections: PrivacySection[]
  contactTitle: string
  contactBody: string
  contactEmail: string
  backLabel: string
}

export default function PrivacyPolicy({
  label,
  title,
  updated,
  intro,
  sections,
  contactTitle,
  contactBody,
  contactEmail,
  backLabel,
}: PrivacyPolicyContent) {
  return (
    <article className="max-w-[720px] mx-auto px-5 sm:px-8 py-14 sm:py-18 lg:py-24">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-[0.68rem] tracking-[0.14em] uppercase font-bold text-nd-grey-400 hover:text-nd-accent-mid transition-colors duration-200 mb-10"
      >
        <span aria-hidden>←</span>
        {backLabel}
      </Link>

      <div className="text-[0.65rem] tracking-[0.22em] uppercase font-bold text-nd-accent-mid mb-6 flex items-center gap-2 before:content-[''] before:w-6 before:h-0.5 before:bg-nd-accent-mid">
        {label}
      </div>

      <h1 className="text-[2.25rem] sm:text-[2.5rem] font-bold tracking-[-0.035em] leading-[1.08] text-nd-black mb-4">
        {title}
      </h1>
      <p className="text-[0.75rem] tracking-[0.08em] text-nd-grey-400 mb-10">{updated}</p>

      <p className="text-[0.95rem] text-nd-grey-600 leading-[1.8] mb-12">{intro}</p>

      <div className="flex flex-col gap-10">
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-[calc(var(--nd-nav-h)+1.5rem)]">
            <h2 className="text-[1.05rem] font-bold tracking-[-0.02em] text-nd-black mb-4">{section.title}</h2>
            {section.paragraphs.map((paragraph, index) => (
              <p
                key={`${section.id}-p-${index}`}
                className="text-[0.9rem] text-nd-grey-600 leading-[1.75] mb-4 last:mb-0"
              >
                {paragraph}
              </p>
            ))}
            {section.list && section.list.length > 0 && (
              <ul className="flex flex-col gap-2 mt-2 border-l-2 border-nd-accent-mid/40 pl-5">
                {section.list.map((item, index) => (
                  <li key={`${section.id}-l-${index}`} className="text-[0.9rem] text-nd-grey-600 leading-[1.7]">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <div className="mt-14 border border-nd-grey-200 bg-nd-grey-50 px-6 py-8">
        <h2 className="text-[0.72rem] tracking-[0.16em] uppercase font-bold text-nd-grey-600 mb-3">{contactTitle}</h2>
        <p className="text-[0.9rem] text-nd-grey-600 leading-[1.75] mb-4">{contactBody}</p>
        <a
          href={`mailto:${contactEmail}`}
          className="text-[0.88rem] font-bold text-nd-accent-mid hover:text-nd-accent-bright transition-colors duration-200"
        >
          {contactEmail}
        </a>
      </div>
    </article>
  )
}
