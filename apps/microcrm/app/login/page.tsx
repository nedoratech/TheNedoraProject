import LoginForm from '../_components/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-nd-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 text-[0.9rem] font-bold tracking-[0.22em] uppercase text-nd-white mb-10">
          <span className="w-1.5 h-1.5 bg-nd-accent-bright rounded-full" />
          NEDORA <span className="text-nd-grey-400 font-normal">/ CRM</span>
        </div>
        <h1 className="text-[1.6rem] font-bold tracking-[-0.025em] text-nd-white mb-2">Sign in</h1>
        <p className="text-[0.85rem] text-nd-grey-400 mb-8">microCRM access is restricted to Nedora team members.</p>
        <LoginForm />
      </div>
    </div>
  )
}
