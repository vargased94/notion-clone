import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { AuthLayout } from '@/features/auth/components/AuthLayout'
import { AuthGuard } from '@/features/auth/components/AuthGuard'
import { GuestGuard } from '@/features/auth/components/GuestGuard'
import { AppLayout } from '@/components/AppLayout'
import { PageLoadingSpinner } from '@/components/PageLoadingSpinner'

// Lazy-loaded route components
const LoginPage = lazy(() => import('@/features/auth/components/LoginPage').then((m) => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('@/features/auth/components/RegisterPage').then((m) => ({ default: m.RegisterPage })))
const HomePage = lazy(() => import('@/features/page/components/HomePage').then((m) => ({ default: m.HomePage })))
const PageView = lazy(() => import('@/features/page/components/PageView').then((m) => ({ default: m.PageView })))
const TrashPage = lazy(() => import('@/features/trash/components/TrashPage').then((m) => ({ default: m.TrashPage })))
const SettingsPage = lazy(() => import('@/features/settings/components/SettingsPage').then((m) => ({ default: m.SettingsPage })))

function LazyRoute({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoadingSpinner />}>{children}</Suspense>
}

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LazyRoute><GuestGuard><LoginPage /></GuestGuard></LazyRoute> },
      { path: '/register', element: <LazyRoute><GuestGuard><RegisterPage /></GuestGuard></LazyRoute> },
    ],
  },
  {
    element: <AuthGuard><AppLayout /></AuthGuard>,
    children: [
      { path: '/', element: <LazyRoute><HomePage /></LazyRoute> },
      { path: '/:pageId', element: <LazyRoute><PageView /></LazyRoute> },
      { path: '/trash', element: <LazyRoute><TrashPage /></LazyRoute> },
      { path: '/settings', element: <LazyRoute><SettingsPage /></LazyRoute> },
    ],
  },
])
