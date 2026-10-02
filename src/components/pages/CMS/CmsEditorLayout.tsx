import { Outlet, useParams } from "react-router-dom"
import { FileText } from "lucide-react"

import { HomePreview } from "./Home/HomePreview"
import { AboutPreview } from "./About/AboutPreview"
import { JourneyCMSPreview } from "./Journey/JourneyCMSPreview"
import { StoriesCMSPreview } from "./Stories/StoriesCMSPreview"
import { NewsletterCMSPreview } from "./Newsletter/NewsletterCMSPreview"
import { FaqPreview } from "./Faq/FaqPreview"
import { ContactPreview } from "./Contact/ContactPreview"
import { FooterPreview } from "./Footer/FooterPreview"

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
    if (pageSlug === "about-us" || pageSlug === "about") return <AboutPreview />
    if (pageSlug === "journey" || pageSlug === "journeys") return <JourneyCMSPreview />
    if (pageSlug === "stories") return <StoriesCMSPreview />
    if (pageSlug === "newsletter") return <NewsletterCMSPreview />
    if (pageSlug === "faq") return <FaqPreview />
    if (pageSlug === "contact-us" || pageSlug === "contact") return <ContactPreview />
    if (pageSlug === "footer") return <FooterPreview />

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
