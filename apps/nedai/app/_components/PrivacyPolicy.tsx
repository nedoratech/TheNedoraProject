export default function PrivacyPolicy() {
  return (
    <article className="max-w-[720px] mx-auto px-5 sm:px-8 py-14 sm:py-18 lg:py-24">
      <a
        href="/"
        className="inline-flex items-center gap-2 text-[0.68rem] tracking-[0.14em] uppercase font-bold text-[#9493b0] hover:text-[#7c3aed] transition-colors duration-200 mb-10"
      >
        <span aria-hidden>←</span>
        Back to NedAI
      </a>

      <div className="text-[0.65rem] tracking-[0.22em] uppercase font-bold text-[#7c3aed] mb-6 flex items-center gap-2 before:content-[''] before:w-6 before:h-0.5 before:bg-[#7c3aed]">
        Legal
      </div>

      <h1 className="text-[2.2rem] sm:text-[2.5rem] font-bold tracking-[-0.035em] leading-[1.05] text-[#0d0d2b] mb-4">
        Privacy Policy
      </h1>
      <p className="text-[0.72rem] tracking-[0.08em] text-[#9493b0] mb-10">
        Last updated: June 2026
      </p>

      <p className="text-[0.95rem] text-[#5a5780] leading-[1.6] mb-12">
        NedAI is a product of Nedora SRL, Bucharest, Romania. We take data privacy seriously
        and comply with the EU General Data Protection Regulation (GDPR). This policy describes
        what data we collect, why, how we protect it, and your rights.
      </p>

      <div className="flex flex-col gap-10">
        {[
          {
            id: 'data-collected',
            title: '1. What data we collect',
            paragraphs: [
              'When you submit a demo request, we collect your name, work email address, phone number (optional), company name, industry, and company size.',
              'When you subscribe to our newsletter, we collect your email address and your explicit consent.',
              "When NedAI handles calls on behalf of our clients, we process caller data (voice, intent, and booking information) as a data processor under our clients' data controller responsibility.",
            ],
          },
          {
            id: 'data-use',
            title: '2. How we use your data',
            paragraphs: [
              'Demo request data is used solely to prepare and conduct your demo session, and to follow up with you on the NedAI product.',
              'Newsletter email addresses are used to send product updates, case studies, and AI insights. We send roughly twice per month.',
              'We do not sell, rent, or share your personal data with third parties for marketing purposes.',
            ],
          },
          {
            id: 'encryption',
            title: '3. How we protect your data',
            paragraphs: [
              'All personally identifiable information (PII) is encrypted at rest using AES-256-GCM encryption with per-subject keys. This means your data is encrypted before it reaches our database.',
              'Emails are stored as HMAC-SHA256 hashes for lookup purposes; the plaintext email is separately encrypted and accessible only via authenticated server-side operations.',
              'All data is stored on servers located within the European Union (Microsoft Azure, EU data centres), ensuring GDPR jurisdictional compliance.',
              'We use role-based access controls and Row Level Security (RLS) to ensure that only authorised personnel can access your data.',
            ],
          },
          {
            id: 'data-rights',
            title: '4. Your rights under GDPR',
            paragraphs: [
              'You have the right to access, rectify, erase, restrict, or port your personal data at any time. To exercise any of these rights, contact us at privacy@nedora.co.',
              'You have the right to withdraw consent for newsletter communications at any time, without affecting the lawfulness of processing based on consent before withdrawal.',
              'You have the right to lodge a complaint with your local data protection authority if you believe your rights have been violated.',
            ],
            list: [
              'Right of access — request a copy of the data we hold about you',
              'Right to rectification — correct inaccurate personal data',
              'Right to erasure — request deletion of your data ("right to be forgotten")',
              'Right to restriction — limit how we use your data',
              'Right to data portability — receive your data in a machine-readable format',
              'Right to object — object to processing based on legitimate interests',
            ],
          },
          {
            id: 'retention',
            title: '5. How long we keep your data',
            paragraphs: [
              'Demo request data is retained for 24 months from the date of submission, or until you request deletion.',
              "Newsletter subscriber data is retained until you unsubscribe or request deletion. Unsubscribed records are marked as inactive and purged after 6 months.",
              "Call interaction data processed by NedAI on behalf of clients is retained according to each client's data retention policy.",
            ],
          },
          {
            id: 'cookies',
            title: '6. Cookies and analytics',
            paragraphs: [
              'We use Vercel Analytics for page view statistics. This service collects anonymised, aggregated data and does not use cookies or track individual users across sites.',
              'We do not use advertising cookies or third-party tracking pixels on this website.',
            ],
          },
          {
            id: 'contact-privacy',
            title: '7. Contact us',
            paragraphs: [
              'For any privacy-related questions, data subject requests, or concerns, contact our data protection contact at: privacy@nedora.co',
              'Nedora SRL · Bucharest, Romania · EU',
            ],
          },
        ].map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-[calc(var(--na-nav-h)+1.5rem)]">
            <h2 className="text-[1.05rem] font-bold tracking-[-0.02em] text-[#0d0d2b] mb-4">
              {section.title}
            </h2>
            {section.paragraphs.map((p, idx) => (
              <p key={idx} className="text-[0.9rem] text-[#5a5780] leading-[1.6] mb-4 last:mb-0">
                {p}
              </p>
            ))}
            {section.list && (
              <ul className="flex flex-col gap-2 mt-3 border-l-2 border-[rgba(124,58,237,0.3)] pl-5">
                {section.list.map((item, idx) => (
                  <li key={idx} className="text-[0.88rem] text-[#5a5780] leading-[1.6]">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <div className="mt-14 border border-[rgba(124,58,237,0.18)] bg-[#f7f5ff] px-6 py-8">
        <h3 className="text-[0.88rem] font-bold text-[#0d0d2b] mb-2">Questions about this policy?</h3>
        <p className="text-[0.85rem] text-[#5a5780] leading-[1.6] mb-4">
          We're happy to explain anything in plain language. Email us or book a call.
        </p>
        <a
          href="mailto:privacy@nedora.co"
          className="inline-block text-[0.68rem] tracking-[0.14em] uppercase font-bold px-5 py-2.5 bg-[#7c3aed] text-white hover:bg-[#9b5cf6] transition-colors duration-200"
        >
          privacy@nedora.co
        </a>
      </div>
    </article>
  )
}
