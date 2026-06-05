import { Fragment } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHospital,
  faBalanceScale,
  faHotel,
  faBuilding,
  faCarSide,
} from '@fortawesome/free-solid-svg-icons'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import ScrollReveal from './ScrollReveal'

interface Industry {
  icon: IconDefinition
  title: string
  body: string
  tag: string
  accent: boolean
}

const INDUSTRIES: Industry[] = [
  {
    icon: faHospital,
    title: 'Private Healthcare',
    body: 'Clinics, specialist networks, diagnostic centres. NedAI started here — it knows the complexity of medical scheduling, urgency detection, and patient privacy.',
    tag: 'Where NedAI was born',
    accent: true,
  },
  {
    icon: faCarSide,
    title: 'Automotive Dealerships',
    body: 'Test drive bookings, service appointments, parts availability, and finance enquiries — handled instantly, freeing your showroom staff to close deals.',
    tag: 'High fit',
    accent: false,
  },
  {
    icon: faBalanceScale,
    title: 'Professional Services',
    body: 'Law firms, accounting practices, consultancies. Appointment scheduling, intake qualification, and FAQ coverage — without a full-time receptionist.',
    tag: 'High fit',
    accent: false,
  },
  {
    icon: faHotel,
    title: 'Hospitality',
    body: 'Hotels, restaurants, wellness centres. Reservation handling, availability queries, and concierge FAQs — 24/7, in any language your SIP provider supports.',
    tag: 'High fit',
    accent: false,
  },
  {
    icon: faBuilding,
    title: 'Enterprise Operations',
    body: 'Any business with a central contact number and a team that spends too much time on routine inbound calls. If volume exists, NedAI can automate it.',
    tag: 'Custom assessment',
    accent: false,
  },
]

export default function IndustriesSection() {
  return (
    <section className="py-14 sm:py-18 lg:py-24 bg-white border-t border-[rgba(124,58,237,0.1)]" id="industries">
      <div className="max-w-[1160px] mx-auto px-5 sm:px-8">
        <ScrollReveal>
          <div className="text-[0.65rem] lg:text-[0.75rem] tracking-[0.22em] uppercase font-bold text-[#7c3aed] mb-5 flex items-center gap-2 before:content-[''] before:w-6 before:h-0.5 before:bg-[#7c3aed]">
            Who NedAI works for
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-end mb-10 sm:mb-12">
            <h2 className="text-[clamp(2rem,3.5vw,3rem)] font-bold tracking-[-0.035em] leading-[1.05] text-[#0d0d2b]">
              Built for healthcare.{' '}
              <em className="not-italic text-[#7c3aed]">Ready for any business</em>{' '}
              that answers phones.
            </h2>
            <p className="text-[0.95rem] lg:text-[1rem] leading-[1.6] text-[#5a5780]">
              If your business books appointments, answers recurring questions, or handles routine
              inbound calls — NedAI can automate a significant portion of that volume from day one.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0.5">
          {INDUSTRIES.map((ind, i) => (
            <Fragment key={ind.title}>
              <ScrollReveal key={ind.title} delay={(i % 3) as 0 | 1 | 2}>
                <div
                  className={`p-7 sm:p-9 h-full border transition-all duration-200 flex flex-col gap-4 ${
                    ind.accent
                      ? 'bg-[#e91e8c] border-[#e91e8c] hover:bg-[#c2177a]'
                      : 'bg-white border-[rgba(124,58,237,0.12)] hover:border-[rgba(124,58,237,0.3)] hover:shadow-[0_4px_20px_rgba(124,58,237,0.08)]'
                  }`}
                >
                  <div
                    className={`w-10 h-10 flex items-center justify-center border ${
                      ind.accent
                        ? 'border-white/30 text-white'
                        : 'border-[rgba(124,58,237,0.25)] text-[#7c3aed] bg-[rgba(124,58,237,0.04)]'
                    }`}
                  >
                    <FontAwesomeIcon icon={ind.icon} className="w-4 h-4" />
                  </div>
                  <div>
                    <div
                      className="inline-block text-[0.58rem] tracking-[0.18em] uppercase font-bold px-2 py-0.5 mb-3"
                      style={
                        ind.accent
                          ? { background: 'rgba(255,255,255,0.2)', color: '#ffffff' }
                          : { background: 'rgba(124,58,237,0.08)', color: '#7c3aed' }
                      }
                    >
                      {ind.tag}
                    </div>
                    <h3
                      className={`text-[1.05rem] font-bold tracking-[-0.01em] leading-[1.25] mb-2 ${
                        ind.accent ? 'text-white' : 'text-[#0d0d2b]'
                      }`}
                    >
                      {ind.title}
                    </h3>
                    <p
                      className={`text-[0.88rem] leading-[1.6] ${
                        ind.accent ? 'text-white/80' : 'text-[#5a5780]'
                      }`}
                    >
                      {ind.body}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
              {i === 3 && (
                <ScrollReveal key="industries-cta" delay={((i + 1) % 3) as 0 | 1 | 2}>
                  <div className="p-7 sm:p-9 h-full bg-[#7c3aed] border border-[#7c3aed] flex flex-col justify-between gap-6">
                    <p className="text-[1.1rem] font-bold text-white leading-[1.3]">
                      Not sure if NedAI fits your operation?
                    </p>
                    <div>
                      <p className="text-[0.88rem] text-white/75 leading-[1.6] mb-6">
                        Book a 30-minute session and we'll tell you exactly what we can automate, what we can't, and what the ROI looks like for your specific case.
                      </p>
                      <a
                        href="#demo"
                        className="inline-block text-[0.7rem] tracking-[0.14em] uppercase font-bold px-6 py-3 bg-white text-[#7c3aed] hover:bg-[#e91e8c] hover:text-white transition-all duration-200"
                      >
                        Let's find out →
                      </a>
                    </div>
                  </div>
                </ScrollReveal>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}
