import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, CircleCheck } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const features = [
  'Block-based editor',
  'Real-time collaboration',
  'Powerful databases',
  'AI-powered assistance',
]

export function LoginPage() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const result = await signIn(email, password)
    if (result.error) {
      setError(result.error)
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen dark">
      {/* Left Panel - Branding */}
      <div className="hidden w-1/2 flex-col items-center justify-center gap-6 bg-[#0D0D0D] p-16 lg:flex">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-b from-notion-green-primary to-notion-green-dark">
          <span className="font-mono text-3xl font-bold text-white">N</span>
        </div>
        <h1 className="font-mono text-3xl font-bold text-notion-text-primary">Notion Clone</h1>
        <p className="font-mono text-sm text-notion-text-secondary">Your workspace. Your way.</p>
        <div className="mt-4 flex flex-col gap-4">
          {features.map((feature) => (
            <div key={feature} className="flex items-center gap-3">
              <CircleCheck className="h-4 w-4 text-notion-green-primary" />
              <span className="font-mono text-xs text-notion-text-secondary">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex w-full flex-col items-center justify-center bg-notion-bg-primary p-8 lg:w-1/2 lg:p-16">
        <form onSubmit={handleSubmit} className="flex w-full max-w-[380px] flex-col gap-6">
          <div>
            <h2 className="font-mono text-2xl font-bold text-notion-text-primary">Welcome back</h2>
            <p className="mt-1 font-mono text-sm text-notion-text-secondary">Sign in to your workspace</p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-500/10 px-4 py-3 font-mono text-xs text-red-400">
              {error}
            </div>
          )}

          <button
            type="button"
            className="flex h-11 w-full items-center justify-center gap-3 rounded-lg bg-notion-bg-input font-mono text-sm text-notion-text-primary ring-1 ring-notion-border transition-colors hover:bg-notion-bg-hover"
          >
            <span className="text-base font-bold text-[#4285F4]">G</span>
            Continue with Google
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-notion-divider" />
            <span className="font-mono text-xs text-notion-text-muted">or</span>
            <div className="h-px flex-1 bg-notion-divider" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs text-notion-text-secondary">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email..."
              required
              className="h-[42px] w-full rounded-lg bg-notion-bg-input px-3.5 font-mono text-sm text-notion-text-primary placeholder-notion-text-placeholder ring-1 ring-notion-border outline-none transition-colors focus:ring-notion-green-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between">
              <label className="font-mono text-xs text-notion-text-secondary">Password</label>
              <button type="button" className="font-mono text-xs text-notion-green-primary hover:underline">
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password..."
                required
                className="h-[42px] w-full rounded-lg bg-notion-bg-input px-3.5 pr-10 font-mono text-sm text-notion-text-primary placeholder-notion-text-placeholder ring-1 ring-notion-border outline-none transition-colors focus:ring-notion-green-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-notion-text-muted"
              >
                {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-11 w-full items-center justify-center rounded-lg bg-notion-green-primary font-mono text-sm font-semibold text-white transition-colors hover:bg-notion-green-dark disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <p className="text-center font-mono text-xs text-notion-text-muted">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-notion-green-primary hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
