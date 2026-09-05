import type { ReactNode } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

type CollapsibleSectionCardProps = {
  title: string
  meta?: string
  indexLabel?: string
  isOpen: boolean
  onToggle: () => void
  children: ReactNode
}

export const CollapsibleSectionCard = ({
  title,
  meta,
  indexLabel,
  isOpen,
  onToggle,
  children,
}: CollapsibleSectionCardProps) => {
  return (
    <div className="overflow-hidden rounded-lg border border-border/60">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40"
      >
        <div className="flex min-w-0 items-center gap-3">
          {indexLabel && (
            <span className="flex h-7 min-w-7 items-center justify-center rounded-md bg-muted px-2 text-[10px] font-semibold text-muted-foreground">
              {indexLabel}
            </span>
          )}

          <div className="min-w-0">
            <p className="text-sm font-semibold">{title}</p>

            {meta && (
              <p className="truncate text-[10px] text-muted-foreground">
                {meta}
              </p>
            )}
          </div>
        </div>

        {isOpen ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
      </button>

      {isOpen && (
        <div className="border-t border-border/60 p-4">{children}</div>
      )}
    </div>
  )
}
