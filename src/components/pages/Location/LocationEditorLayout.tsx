import {
    Outlet,
    useNavigate,
    useParams,
} from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

import { LocationPreview } from "./LocationPreview"
import { LocationDraftProvider } from "./shared/LocationDraftContext"

export function LocationEditorLayout() {
    const navigate = useNavigate()

    const { slug = "" } = useParams<{
        slug: string
    }>()

    const formatPageName = (value: string) => {
        return value
            .replace(/([A-Z])/g, " $1")
            .replace(/[-_]/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .replace(/\b\w/g, (char) =>
                char.toUpperCase()
            )
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
                        onClick={() =>
                            navigate("/location")
                        }
                        className="shrink-0 rounded-full p-2 transition-colors hover:bg-muted"
                        title="Back to Location Pages"
                    >
                        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                    </button>

                    <div className="h-6 w-px shrink-0 bg-border/60" />

                    <h1 className="truncate text-sm font-semibold capitalize text-foreground">
                        {formatPageName(slug)} Location
                    </h1>
                </div>

                {/* Live Preview */}
                <div className="flex shrink-0 items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-600 dark:text-green-400">
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />

                        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                    </span>

                    Live Preview
                </div>
            </header>

            {/* =========================
                Main Content
                30% Editor / 70% Preview
            ========================== */}
            <main className="relative flex flex-1 overflow-hidden">
                <LocationDraftProvider>
                    {/* =========================
                        Left: Editor
                    ========================== */}
                    <aside
                        className="
                            w-full
                            md:w-[20%]
                            md:basis-[20%]
                            min-w-0
                            flex-none
                            border-r
                            border-border/60
                            bg-card/50
                            flex
                            flex-col
                            overflow-hidden
                            relative
                            z-10
                            shadow-[4px_0_24px_rgba(0,0,0,0.02)]
                        "
                    >
                        <div className="custom-scrollbar flex-1 overflow-y-auto">
                            <Outlet />
                        </div>
                    </aside>

                    {/* =========================
                        Right: Preview
                    ========================== */}
                    <section
                        className="
                            hidden
                            md:flex
                            md:w-[80%]
                            md:basis-[80%]
                            min-w-0
                            flex-1
                            bg-muted/30
                            items-start
                            justify-center
                            overflow-auto
                            p-1
                            relative
                        "
                    >
                        <div
                            className={cn(
                                "min-h-full w-full overflow-y-auto bg-background shadow-md",
                                "rounded-lg border border-border/60"
                            )}
                        >
                            <LocationPreview />
                        </div>
                    </section>
                </LocationDraftProvider>
            </main>
        </div>
    )
}