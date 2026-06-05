import Nav from '../_components/Nav'
import Footer from '../_components/Footer'
import PrivacyPolicy from '../_components/PrivacyPolicy'

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="bg-white pt-[var(--na-nav-h)]">
        <PrivacyPolicy />
      </main>
      <Footer />
    </>
  )
}
