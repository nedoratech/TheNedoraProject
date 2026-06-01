import ScrollReveal from './ScrollReveal'
import ContactForm from './ContactForm'

export default function ContactSection() {
  return (
    <section className="py-32 bg-nd-white border-t border-nd-grey-100" id="contact">
      <div className="max-w-[1160px] mx-auto px-8">
        <div className="grid grid-cols-[1fr_1.6fr] gap-24 items-start">
          {/* Left info */}
          <ScrollReveal>
            <div className="text-[0.65rem] tracking-[0.22em] uppercase font-bold text-nd-accent-mid mb-6 flex items-center gap-2 before:content-[''] before:w-6 before:h-0.5 before:bg-nd-accent-mid">
              Contact
            </div>
            <h2 className="text-[2rem] font-bold tracking-[-0.035em] leading-[1.1] mb-5">Request an offer</h2>
            <p className="text-[0.9rem] text-nd-grey-600 leading-[1.75] mb-10">
              Tell us about your project. We typically respond within two business days. For straightforward enquiries, we&apos;ll often suggest a 30-minute call before preparing a written proposal.
            </p>
            <div className="flex flex-col gap-5">
              {[
                { icon: '📍', title: 'Location', val: 'Bucharest, Romania' },
                { icon: '↗', title: 'LinkedIn', val: 'linkedin.com/company/nedora-tech' },
                { icon: '⏱', title: 'Response time', val: 'Within two business days' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-9 h-9 border border-nd-grey-200 flex items-center justify-center text-nd-grey-600 shrink-0 text-sm">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-[0.65rem] tracking-[0.14em] uppercase font-bold text-nd-grey-400">{item.title}</div>
                    <div className="text-[0.88rem] text-nd-black mt-0.5">{item.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Right form */}
          <ScrollReveal delay={1}>
            <ContactForm />
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
