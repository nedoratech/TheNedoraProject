import Topbar from '../../_components/Topbar'
import MfaSection from './MfaSection'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShield } from '@fortawesome/free-solid-svg-icons'

export default function SettingsPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <Topbar title="Settings" subtitle="Manage your account security and preferences" />

      <div className="p-7 max-w-2xl">
        <div className="bg-panel rounded-2xl shadow-card border b-bdr overflow-hidden">
          {/* Section header */}
          <div className="px-6 py-5 border-b b-bdr bg-panel2">
            <div className="w-10 h-10 rounded-xl bg-[#eff6ff] flex items-center justify-center mb-4">
              <FontAwesomeIcon icon={faShield} className="w-5 h-5 text-[#2563eb]" />
            </div>
            <h2 className="text-[0.78rem] tracking-[0.08em] font-bold c1 mb-0.5">
              Two-factor authentication
            </h2>
            <p className="text-[0.76rem] c3">
              Add a second layer of security with a TOTP authenticator app. Required on next sign-in once enabled.
            </p>
          </div>

          <div className="p-6">
            <MfaSection />
          </div>
        </div>
      </div>
    </div>
  )
}
