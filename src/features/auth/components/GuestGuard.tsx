import { useEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

interface GuestGuardProps {
  children: ReactNode
}

export function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated, isLoading, initialize } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isLoading, isAuthenticated, navigate])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-notion-bg-primary">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-notion-green-primary border-t-transparent" />
      </div>
    )
  }

  if (isAuthenticated) return null

  return <>{children}</>
}
