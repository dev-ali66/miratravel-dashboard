import { Outlet, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Compass } from "lucide-react"
import { cn } from "@/lib/utils"

import { JourneyPreview } from "./preview/JourneyPreview"
import { JourneyDraftProvider } from "./shared/JourneyDraftContext"

export function JourneyEditorLayout() {
  const navigate = useNavigate()

  const { slug = "" } = useParams<{
    slug?: string
  }>()

  const formatTitle = (val: string) => {
    if (!val || val === "new") return "New Journey"
    return val
      .replace(/[-_]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase())
  }

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background">
      {/* =========================
          Top Header
      ========================== */}
      <header className="z-10 flex h-14 flex-none items-center justify-between border-b border-border/60 bg-card px-4">
        {/* Left */}
        <div className="flex min-w-0 items-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/journeys")}
            className="shrink-0 rounded-full p-2 transition-colors hover:bg-muted"
            title="Back to Journeys"
          >
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>

          <div className="h-6 w-px shrink-0 bg-border/60" />

          <div className="flex items-center gap-2 min-w-0">
            <Compass className="h-4 w-4 text-[#af6348] shrink-0" />
            <h1 className="truncate text-sm font-semibold text-foreground">
              {formatTitle(slug)}
            </h1>
          </div>
        </div>

        {/* Live Preview indicator */}
        <div className="flex shrink-0 items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-600 dark:text-green-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          Live Preview
        </div>
      </header>

      {/* =========================
          Main Content: 25% Editor / 75% Live Preview
      ========================== */}
      <main className="relative flex flex-1 overflow-hidden">
        <JourneyDraftProvider>
          {/* Left: Editor */}
          <aside className="relative z-10 flex w-full min-w-0 flex-none flex-col overflow-hidden border-r border-border/60 bg-card/50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] md:w-[25%] md:basis-[25%]">
            <div className="custom-scrollbar flex-1 overflow-y-auto">
              <Outlet />
            </div>
          </aside>

          {/* Right: Live Preview */}
          <section className="relative hidden min-w-0 flex-1 items-start justify-center overflow-hidden bg-muted/30 p-1 md:flex md:w-[75%] md:basis-[75%]">
            <div
              className={cn(
                "h-full w-full overflow-y-auto overflow-x-hidden bg-background shadow-md",
                "rounded-lg border border-border/60 custom-scrollbar"
              )}
            >
              <JourneyPreview />
            </div>
          </section>
        </JourneyDraftProvider>
      </main>
    </div>
  )
}
