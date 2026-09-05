export function PrivacyPolicySkeleton() {
  return (
    <div className="mx-auto w-full max-w-5xl animate-in space-y-6 pt-6 duration-700 fade-in slide-in-from-bottom-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 h-9 w-48 animate-pulse rounded-md bg-muted" />
          <div className="h-5 w-64 animate-pulse rounded-md bg-muted" />
        </div>
        <div className="h-10 w-32 animate-pulse rounded-xl bg-muted" />
      </div>
      <div className="h-24 w-full animate-pulse rounded-2xl bg-muted/50" />
      <div className="h-24 w-full animate-pulse rounded-2xl bg-muted/50" />
      <div className="rounded-2xl border border-border/60 bg-background/50 p-6 backdrop-blur-xl">
        <div className="h-100 w-full animate-pulse rounded-xl bg-muted/50" />
      </div>
    </div>
  )
}
