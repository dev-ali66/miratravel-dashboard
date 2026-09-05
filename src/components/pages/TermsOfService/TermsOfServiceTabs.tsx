import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { TermsPart } from "./types"

interface TermsOfServiceTabsProps {
  parts: TermsPart[]
  activeTab: string
  setActiveTab: (id: string) => void
}

export function TermsOfServiceTabs({
  parts,
  activeTab,
  setActiveTab,
}: TermsOfServiceTabsProps) {
  return (
    <div className="mb-6 space-y-2.5">
      <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
        <Label className="text-xs font-bold tracking-wider text-foreground uppercase">
          Document Structure
        </Label>
        <span className="text-xs text-muted-foreground italic">
          Click a document tab to view and edit that specific section
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2.5 rounded-2xl border border-border/40 bg-muted/20 p-2 sm:grid-cols-2 lg:grid-cols-5">
        {parts.map((part) => {
          const isActive = activeTab === part.id
          return (
            <button
              key={part.id}
              type="button"
              onClick={() => setActiveTab(part.id)}
              className={cn(
                "group relative flex cursor-pointer flex-col overflow-hidden rounded-xl p-3.5 text-left transition-all",
                isActive
                  ? "bg-background font-medium text-foreground shadow-sm ring-1 ring-border"
                  : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
              )}
            >
              <span
                className={cn(
                  "mb-1 text-xs font-bold tracking-wider uppercase transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-primary"
                )}
              >
                {part.tabTitle}
              </span>
              <span className="line-clamp-2 text-xs leading-snug font-medium">
                {part.fullTitle.replace(/^Part \d+ — /, "")}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
