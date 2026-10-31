import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Plus } from "lucide-react"
import type { PolicyItem } from "./types"

interface PrivacyPolicyTabsProps {
  items: PolicyItem[]
  activeTab: string
  setActiveTab: (id: string) => void
  onAddItem: () => void
}

export function PrivacyPolicyTabs({
  items,
  activeTab,
  setActiveTab,
  onAddItem,
}: PrivacyPolicyTabsProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
        <Label className="text-xs font-bold tracking-wider text-foreground uppercase">
          Document Sections ({items.length})
        </Label>
        <span className="text-xs text-muted-foreground italic">
          Select a section tab below to edit its content or add a new section.
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border/70 bg-muted/20 p-2.5">
        {items.map((item) => {
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "group relative flex min-w-[120px] max-w-[200px] flex-1 cursor-pointer flex-col overflow-hidden rounded-md border p-2.5 text-left transition-all",
                isActive
                  ? "bg-background text-foreground shadow-2xs border-primary/40 ring-1 ring-primary/20 font-medium"
                  : "border-transparent text-muted-foreground hover:bg-background/60 hover:text-foreground"
              )}
            >
              <span
                className={cn(
                  "mb-0.5 text-[10px] font-bold tracking-wider uppercase transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-primary"
                )}
              >
                {item.tabTitle || "Untitled"}
              </span>
              <span className="line-clamp-1 text-xs font-semibold leading-snug">
                {item.fullTitle || "No Title"}
              </span>
            </button>
          )
        })}

        <button
          type="button"
          onClick={onAddItem}
          className="flex min-w-[110px] items-center justify-center gap-1.5 rounded-md border border-dashed border-border/80 bg-background/50 p-2.5 text-xs font-medium text-muted-foreground transition hover:border-primary hover:bg-background/80 hover:text-primary cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Section</span>
        </button>
      </div>
    </div>
  )
}

