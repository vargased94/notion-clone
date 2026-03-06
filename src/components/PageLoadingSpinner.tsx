export function PageLoadingSpinner() {
  return (
    <div className="flex flex-1 items-center justify-center py-32">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-notion-green-primary border-t-transparent" />
    </div>
  )
}
