import Nav from './_components/Nav'
import Hero from './_components/Hero'
import ProblemSection from './_components/ProblemSection'
import CapabilitiesSection from './_components/CapabilitiesSection'
import HowItWorksSection from './_components/HowItWorksSection'
import TransferSection from './_components/TransferSection'
import RoiSection from './_components/RoiSection'
import IndustriesSection from './_components/IndustriesSection'
import DemoSection from './_components/DemoSection'
import NewsletterSection from './_components/NewsletterSection'
import Footer from './_components/Footer'

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ProblemSection />
        <CapabilitiesSection />
        <HowItWorksSection />
        <TransferSection />
        <RoiSection />
        <IndustriesSection />
        <DemoSection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  )
}
