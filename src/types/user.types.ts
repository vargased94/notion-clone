export type ThemePreference = 'light' | 'dark' | 'system'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  preferred_theme: ThemePreference
  locale: string
  timezone: string
  created_at: string
  updated_at: string
}
