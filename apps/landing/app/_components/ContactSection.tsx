import ScrollReveal from './ScrollReveal'
import ContactForm from './ContactForm'

export interface ContactInfoContent {
  label: string
  heading: string
  description: string
  locationTitle: string
  locationValue: string
  linkedinTitle: string
  linkedinValue: string
  responseTitle: string
  responseValue: string
}

export default function ContactSection(props: ContactInfoContent) {
  const infoItems = [
    { icon: '📍', title: props.locationTitle, val: props.locationValue },
    { icon: '↗', title: props.linkedinTitle, val: props.linkedinValue },
    { icon: '⏱', title: props.responseTitle, val: props.responseValue },
  ]

  return (
    <section className="py-32 bg-nd-white border-t border-nd-grey-100" id="contact">
      <div className="max-w-[1160px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-24 items-start">
          <ScrollReveal>
            <div className="text-[0.65rem] tracking-[0.22em] uppercase font-bold text-nd-accent-mid mb-6 flex items-center gap-2 before:content-[''] before:w-6 before:h-0.5 before:bg-nd-accent-mid">
              {props.label}
            </div>
            <h2 className="text-[2rem] font-bold tracking-[-0.035em] leading-[1.1] mb-5 text-nd-black">{props.heading}</h2>
            <p className="text-[0.9rem] text-nd-grey-600 leading-[1.75] mb-10">{props.description}</p>
            <div className="flex flex-col gap-5">
              {infoItems.map((item) => (
                <div key={item.title} className="flex gap-4 items-start">
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

          <ScrollReveal delay={1}>
            <ContactForm />
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
