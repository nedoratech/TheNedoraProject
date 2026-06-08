import LoginForm from '../_components/LoginForm'
import NedoraLogo from '../_components/NedoraLogo'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-4">
      <div className="bg-panel rounded-2xl shadow-card-md border b-bdr p-8 w-full max-w-[400px] animate-fade-up">
        <div className="flex flex-col items-center text-center mb-8">
          <NedoraLogo className="h-5 c1 mb-6" />
          <h1 className="text-[1.5rem] font-bold c1 mb-1.5">Welcome back</h1>
          <p className="text-sm c3">Sign in to Nedora microCRM</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
