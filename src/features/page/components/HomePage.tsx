export function HomePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-b from-notion-green-primary to-notion-green-dark">
        <span className="font-mono text-3xl font-bold text-white">N</span>
      </div>
      <h1 className="font-mono text-xl font-bold text-notion-text-primary">Welcome to Notion Clone</h1>
      <p className="font-mono text-sm text-notion-text-secondary">Select a page or create a new one to get started.</p>
    </div>
  )
}
