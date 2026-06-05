import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faClock,
  faArrowsRotate,
  faMoon,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons'
import ScrollReveal from './ScrollReveal'

const PAIN_POINTS = [
  {
    icon: faClock,
    title: 'Long wait times destroy first impressions',
    body: 'Customers call during peak hours and wait 8–12 minutes — or give up. Every abandoned call is a lost opportunity you never even knew about.',
  },
  {
    icon: faArrowsRotate,
    title: 'Your team repeats the same answers all day',
    body: 'Up to 60% of incoming calls are routine: appointment booking, hours of operation, document requirements. High-skill staff doing low-skill work.',
  },
  {
    icon: faMoon,
    title: 'Calls after hours go nowhere',
    body: "When your office closes, demand doesn't. Customers who can't reach you at 7pm call your competitor in the morning.",
  },
  {
    icon: faChartLine,
    title: 'Growth creates a hiring treadmill',
    body: 'Every time your business expands, call volume grows proportionally. Scaling through headcount means 2–3 months per hire, plus training and risk.',
  },
]

export default function ProblemSection() {
  return (
    <section className="py-14 sm:py-18 lg:py-24 bg-[#f7f5ff] border-t border-[rgba(124,58,237,0.1)]" id="problem">
      <div className="max-w-[1160px] mx-auto px-5 sm:px-8">
        <ScrollReveal>
          <div className="text-[0.65rem] lg:text-[0.75rem] tracking-[0.22em] uppercase font-bold text-[#7c3aed] mb-5 flex items-center gap-2 before:content-[''] before:w-6 before:h-0.5 before:bg-[#7c3aed]">
            The real cost of the status quo
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-end mb-0">
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-bold tracking-[-0.04em] leading-[1.05] text-[#0d0d2b]">
              Every missed call is a{' '}
              <em className="not-italic text-[#e91e8c]">missed opportunity.</em>
            </h2>
            <p className="text-[0.95rem] lg:text-[1rem] leading-[1.6] text-[#5a5780]">
              Businesses that rely solely on human receptionists face a structural problem: demand
              is unpredictable, humans have limits, and growth compounds the pressure. NedAI was
              built to solve exactly this.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0.5 mt-10 sm:mt-12">
          {PAIN_POINTS.map((point, i) => (
            <ScrollReveal key={point.title} delay={(i % 2) as 0 | 1}>
              <div className="p-8 sm:p-10 bg-white border border-[rgba(124,58,237,0.12)] hover:border-[rgba(124,58,237,0.3)] hover:shadow-[0_4px_24px_rgba(124,58,237,0.08)] transition-all duration-200 h-full">
                <div className="w-10 h-10 flex items-center justify-center border border-[rgba(124,58,237,0.25)] text-[#7c3aed] bg-[rgba(124,58,237,0.04)] mb-5">
                  <FontAwesomeIcon icon={point.icon} className="w-4 h-4" />
                </div>
                <h3 className="text-[1.05rem] font-bold tracking-[-0.01em] text-[#0d0d2b] mb-3 leading-[1.25]">
                  {point.title}
                </h3>
                <p className="text-[0.88rem] leading-[1.6] text-[#5a5780]">
                  {point.body}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
