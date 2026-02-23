export default function Loading() {
  return (
    <div className="bg-background fixed inset-0 z-50 flex items-center justify-center">
      <div className="border-t-primary border-primary-foreground h-10 w-10 animate-spin rounded-full border-4" />
    </div>
  )
}
