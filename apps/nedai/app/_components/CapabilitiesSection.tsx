import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faComments,
  faCalendarCheck,
  faCircleQuestion,
  faCalendarXmark,
  faRightLeft,
  faMoon,
} from '@fortawesome/free-solid-svg-icons'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import ScrollReveal from './ScrollReveal'

interface Capability {
  num: string
  icon: IconDefinition
  title: string
  body: string
  accent: boolean
}

const CAPABILITIES: Capability[] = [
  {
    num: '01',
    icon: faComments,
    title: 'Natural conversation',
    body: 'Identifies intent, speciality, urgency, and location from a single sentence — no DTMF menus, no scripted flows.',
    accent: true,
  },
  {
    num: '02',
    icon: faCalendarCheck,
    title: 'Real-time appointment booking',
    body: 'Checks live availability across all your locations, books the slot, and offers alternatives when the requested time is unavailable.',
    accent: false,
  },
  {
    num: '03',
    icon: faCircleQuestion,
    title: 'FAQ & knowledge base answers',
    body: 'Hours, locations, required documents, accepted insurance, procedure preparation — delivered with relevant context, not generic scripts.',
    accent: false,
  },
  {
    num: '04',
    icon: faCalendarXmark,
    title: 'Reschedule & cancellations',
    body: 'Handles changes and cancellations end-to-end, syncing directly to your booking system without manual intervention.',
    accent: false,
  },
  {
    num: '05',
    icon: faRightLeft,
    title: 'Smart transfer with full context',
    body: 'Complex or sensitive calls are transferred immediately, with a complete conversation summary so your team picks up exactly where NedAI left off.',
    accent: false,
  },
  {
    num: '06',
    icon: faMoon,
    title: '24/7 after-hours coverage',
    body: 'Captures and books calls when your office is closed. New centre openings get full support from day one — no extra onboarding.',
    accent: false,
  },
]

export default function CapabilitiesSection() {
  return (
    <section className="py-14 sm:py-18 lg:py-24 bg-white border-t border-[rgba(124,58,237,0.1)]" id="capabilities">
      <div className="max-w-[1160px] mx-auto px-5 sm:px-8">
        <ScrollReveal>
          <div className="text-[0.65rem] lg:text-[0.75rem] tracking-[0.22em] uppercase font-bold text-[#7c3aed] mb-5 flex items-center gap-2 before:content-[''] before:w-6 before:h-0.5 before:bg-[#7c3aed]">
            What NedAI does
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-end">
            <h2 className="text-[clamp(2rem,3.5vw,3rem)] font-bold tracking-[-0.035em] leading-[1.05] text-[#0d0d2b]">
              Everything your receptionist handles,{' '}
              <em
                className="not-italic"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed 0%, #e91e8c 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                done automatically.
              </em>
            </h2>
            <p className="text-[0.95rem] lg:text-[1rem] leading-[1.6] text-[#5a5780]">
              NedAI integrates directly with your existing booking system and telephony infrastructure.
              No rip-and-replace. No retraining your team. Up and running in 90 days.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0.5 mt-10 sm:mt-12">
          {CAPABILITIES.map((cap, i) => (
            <ScrollReveal key={cap.num} delay={(i % 3) as 0 | 1 | 2}>
              <div
                className={`p-7 sm:p-9 h-full border transition-all duration-200 group ${
                  cap.accent
                    ? 'bg-[#7c3aed] border-[#7c3aed] hover:bg-[#6a30c8]'
                    : 'bg-white border-[rgba(124,58,237,0.12)] hover:border-[rgba(124,58,237,0.3)] hover:shadow-[0_4px_20px_rgba(124,58,237,0.08)]'
                }`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={`w-9 h-9 flex items-center justify-center border ${
                      cap.accent
                        ? 'border-white/30 text-white'
                        : 'border-[rgba(124,58,237,0.25)] text-[#7c3aed] bg-[rgba(124,58,237,0.04)]'
                    }`}
                  >
                    <FontAwesomeIcon icon={cap.icon} className="w-3.5 h-3.5" />
                  </div>
                  <span
                    className={`text-[0.72rem] tracking-[0.2em] font-bold ${
                      cap.accent ? 'text-white/50' : 'text-[#9493b0]'
                    }`}
                  >
                    {cap.num}
                  </span>
                </div>
                <h3
                  className={`text-[1.1rem] font-bold tracking-[-0.01em] leading-[1.25] mb-3 ${
                    cap.accent ? 'text-white' : 'text-[#0d0d2b]'
                  }`}
                >
                  {cap.title}
                </h3>
                <p
                  className={`text-[0.88rem] leading-[1.6] ${
                    cap.accent ? 'text-white/75' : 'text-[#5a5780]'
                  }`}
                >
                  {cap.body}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Integration callout */}
        <ScrollReveal className="mt-0.5">
          <div className="p-7 sm:p-10 bg-[#f7f5ff] border border-[rgba(233,30,140,0.2)] flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="text-[0.65rem] tracking-[0.2em] uppercase font-bold text-[#e91e8c] mb-2">Integrations</div>
              <p className="text-[0.95rem] font-bold text-[#0d0d2b] leading-[1.3]">
                Connects to your booking system and any SIP-compatible telephony provider
              </p>
              <p className="text-[0.82rem] text-[#5a5780] mt-2 leading-[1.6]">
                NedAI works with providers like Telnyx and any standard SIP trunk. Your existing phone numbers stay unchanged.
              </p>
            </div>
            <a
              href="#demo"
              className="shrink-0 text-[0.7rem] tracking-[0.14em] uppercase font-bold px-7 py-3.5 bg-[#e91e8c] text-white hover:bg-[#c2177a] hover:shadow-[0_4px_20px_rgba(233,30,140,0.3)] transition-all duration-200"
            >
              Discuss Your Stack →
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
