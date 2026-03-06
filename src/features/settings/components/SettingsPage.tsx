import { ThemeToggle } from '@/components/ThemeToggle'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useWorkspace } from '@/features/workspace/hooks/useWorkspace'

export function SettingsPage() {
  const { profile } = useAuth()
  const { workspace } = useWorkspace()

  return (
    <div className="mx-auto w-full max-w-2xl px-8 py-12">
      <h1 className="font-mono text-2xl font-bold text-notion-text-primary">Settings</h1>

      {/* Profile section */}
      <section className="mt-8">
        <h2 className="font-mono text-xs font-semibold tracking-wider text-notion-text-muted">
          PROFILE
        </h2>
        <div className="mt-3 rounded-xl border border-notion-border bg-notion-bg-secondary p-4">
          <div className="flex items-center gap-3">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-notion-bg-hover font-mono text-sm font-semibold text-notion-text-muted">
                {(profile?.full_name ?? profile?.email ?? '?')[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-mono text-sm font-medium text-notion-text-primary">
                {profile?.full_name || 'No name'}
              </p>
              <p className="font-mono text-xs text-notion-text-muted">{profile?.email}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Workspace section */}
      <section className="mt-8">
        <h2 className="font-mono text-xs font-semibold tracking-wider text-notion-text-muted">
          WORKSPACE
        </h2>
        <div className="mt-3 rounded-xl border border-notion-border bg-notion-bg-secondary p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-notion-green-primary font-mono text-xs font-bold text-white">
              {workspace?.name?.[0]?.toUpperCase() ?? 'W'}
            </div>
            <p className="font-mono text-sm font-medium text-notion-text-primary">
              {workspace?.name ?? 'Workspace'}
            </p>
          </div>
        </div>
      </section>

      {/* Appearance */}
      <section className="mt-8">
        <h2 className="font-mono text-xs font-semibold tracking-wider text-notion-text-muted">
          APPEARANCE
        </h2>
        <div className="mt-3 rounded-xl border border-notion-border bg-notion-bg-secondary p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-sm font-medium text-notion-text-primary">Theme</p>
              <p className="font-mono text-xs text-notion-text-muted">Choose light, dark, or system</p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </section>

      {/* Keyboard shortcuts */}
      <section className="mt-8">
        <h2 className="font-mono text-xs font-semibold tracking-wider text-notion-text-muted">
          KEYBOARD SHORTCUTS
        </h2>
        <div className="mt-3 rounded-xl border border-notion-border bg-notion-bg-secondary p-2">
          {[
            { keys: '⌘ + K', desc: 'Search' },
            { keys: '⌘ + \\', desc: 'Toggle sidebar' },
            { keys: '⌘ + Shift + D', desc: 'Cycle theme' },
            { keys: '⌘ + Shift + N', desc: 'Go to home' },
            { keys: '⌘ + B', desc: 'Bold' },
            { keys: '⌘ + I', desc: 'Italic' },
            { keys: '⌘ + U', desc: 'Underline' },
            { keys: '⌘ + E', desc: 'Inline code' },
            { keys: '⌘ + Shift + S', desc: 'Strikethrough' },
            { keys: '/', desc: 'Slash commands' },
          ].map((s) => (
            <div key={s.keys} className="flex items-center justify-between rounded-md px-3 py-2">
              <span className="font-mono text-xs text-notion-text-secondary">{s.desc}</span>
              <kbd className="rounded border border-notion-border bg-notion-bg-primary px-2 py-0.5 font-mono text-[10px] text-notion-text-muted">
                {s.keys}
              </kbd>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
