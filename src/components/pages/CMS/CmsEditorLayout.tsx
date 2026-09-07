import { Outlet, useParams } from "react-router-dom"
import { FileText } from "lucide-react"

import { HomePreview } from "./Home/HomePreview"
import { NavbarPreview } from "./Navbar/NavbarPreview"
import { FooterPreview } from "./Footer/FooterPreview"
import { FaqPreviewShell } from "./Faq/FaqPreviewShell"
import { ContactPreviewShell } from "./Contact/ContactPreviewShell"
import { CtaPreview } from "./Cta/CtaPreview"

import { CmsDraftProvider } from "./shared/CmsDraftContext"
import { UniversalEditorLayout } from "@/components/layout/UniversalEditorLayout"

export function CmsEditorLayout() {
  const { slug } = useParams<{ slug: string }>()
  const [pageSlug] = slug?.split("&&") || [""]

  const formatPageName = (value: string) => {
    if (!value) return "CMS"
    return value
      .replace(/([A-Z])/g, " $1")
      .replace(/[-_]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase())
  }

  const renderPreview = () => {
    if (pageSlug === "home") return <HomePreview />
    if (pageSlug === "navbar") return <NavbarPreview />
    if (pageSlug === "footer") return <FooterPreview />
    if (pageSlug === "faq") return <FaqPreviewShell />
    if (pageSlug === "contact-us") return <ContactPreviewShell />
    if (pageSlug === "cta") return <CtaPreview />

    return (
      <div className="flex h-full items-center justify-center p-8">
        <p className="text-sm text-muted-foreground">
          No preview available for this page.
        </p>
      </div>
    )
  }

  return (
    <CmsDraftProvider key={pageSlug}>
      <UniversalEditorLayout
        backToUrl="/cms"
        backToLabel="Back to CMS"
        icon={FileText}
        title={`Edit ${formatPageName(pageSlug)} Page`}
        sidebarContent={
          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        }
        previewContent={renderPreview()}
        useWorkspaceScale={true}
      />
    </CmsDraftProvider>
  )
}
