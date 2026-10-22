import { Outlet, useParams } from "react-router-dom"
import { Sparkles } from "lucide-react"

import { ExperiencePreview } from "./ExperiencePreview"
import { ExperienceDraftProvider } from "./shared/ExperienceDraftContext"
import { UniversalEditorLayout } from "@/components/layout/UniversalEditorLayout"

export function ExperienceEditorLayout() {
  const { slug = "" } = useParams<{ slug: string }>()

  const formatPageName = (value: string) => {
    if (!value) return "New Experience"
    return value
      .replace(/([A-Z])/g, " $1")
      .replace(/[-_]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase())
  }

  return (
    <ExperienceDraftProvider>
      <UniversalEditorLayout
        backToUrl="/experiences"
        backToLabel="Back to Experiences"
        icon={Sparkles}
        iconColor="text-accent"
        title={`${formatPageName(slug)} Experience`}
        sidebarContent={
          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        }
        previewContent={<ExperiencePreview />}
        useWorkspaceScale={true}
      />
    </ExperienceDraftProvider>
  )
}

export default ExperienceEditorLayout
