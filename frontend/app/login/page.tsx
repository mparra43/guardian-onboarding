import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="flex items-center justify-center px-4 py-12">
        <LoginForm />
      </main>
    </div>
  )
}
