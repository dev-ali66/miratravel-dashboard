import { Outlet, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

import { ScaledWorkspace } from "@/components/shared/AutoScale"
import { HomePreview } from "../pages/CMS/Home/HomePreview"
import { NavbarPreview } from "../pages/CMS/Navbar/NavbarPreview"
import { FooterPreview } from "../pages/CMS/Footer/FooterPreview"
import { FaqPreviewShell } from "../pages/CMS/Faq/FaqPreviewShell"
import { ContactPreviewShell } from "../pages/CMS/Contact/ContactPreviewShell"
import { CtaPreview } from "../pages/CMS/Cta/CtaPreview"

import { CmsDraftProvider } from "../pages/CMS/shared/CmsDraftContext"

export function CMSEditorLayout() {
  const navigate = useNavigate()
  const { slug } = useParams<{ slug: string }>()

  const [pageSlug] = slug?.split("&&") || [""]

  const formatPageName = (value: string) => {
    return value
      .replace(/([A-Z])/g, " $1")
      .replace(/[-_]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase())
  }

  const renderPreview = () => {
    if (pageSlug === "home") {
      return <HomePreview />
    }

    if (pageSlug === "navbar") {
      return <NavbarPreview />
    }

    if (pageSlug === "footer") {
      return <FooterPreview />
    }

    if (pageSlug === "faq") {
      return <FaqPreviewShell />
    }

    if (pageSlug === "contact-us") {
      return <ContactPreviewShell />
    }

    if (pageSlug === "cta") {
      return <CtaPreview />
    }

    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-muted-foreground">
          No preview available for this page.
        </p>
      </div>
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
            onClick={() => navigate("/cms")}
            className="shrink-0 rounded-full p-2 transition-colors hover:bg-muted"
            title="Back to CMS"
          >
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>

          <div className="h-6 w-px shrink-0 bg-border/60" />

          <h1 className="truncate text-sm font-semibold text-foreground capitalize">
            Edit {formatPageName(pageSlug)} Page
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

      <main className="relative flex flex-1 flex-col overflow-hidden md:flex-row">
        <CmsDraftProvider key={pageSlug}>
          <aside className="relative z-10 flex w-full min-w-0 flex-none flex-col overflow-hidden border-b border-border/60 bg-card/50 shadow-[0_4px_24px_rgba(0,0,0,0.02)] md:w-[30%] md:basis-[30%] md:border-r md:border-b-0 md:shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
            <div className="custom-scrollbar flex-1 overflow-y-auto">
              <Outlet />
            </div>
          </aside>

          {/* =========================
                            Preview
                        ========================== */}

          <section className="relative flex min-w-0 flex-1 items-start justify-center overflow-auto bg-muted/30 p-1">
            <div
              className={cn(
                "w-full min-w-0 overflow-y-auto bg-background shadow-md",
                "rounded-lg border border-border/60",
                "min-h-full"
              )}
            >
              <ScaledWorkspace>{renderPreview()}</ScaledWorkspace>
            </div>
          </section>
        </CmsDraftProvider>
      </main>
    </div>
  )
}
