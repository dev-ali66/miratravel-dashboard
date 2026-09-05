import { Save, Loader2 } from "lucide-react"

interface PrivacyPolicyHeaderProps {
  onSave: () => void
  isSaving: boolean
}

export function PrivacyPolicyHeader({
  onSave,
  isSaving,
}: PrivacyPolicyHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          GETSURF PRIVACY POLICY
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage document dates and navigate sections using the document tabs
          below.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 font-medium text-primary-foreground shadow-sm shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95 disabled:pointer-events-none disabled:opacity-70"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  )
}
