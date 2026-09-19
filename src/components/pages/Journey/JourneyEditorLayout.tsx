import { Outlet, useParams } from "react-router-dom"
import { Compass } from "lucide-react"

import { JourneyPreview } from "./JourneyPreview"
import { JourneyDraftProvider } from "./shared/JourneyDraftContext"
import { UniversalEditorLayout } from "@/components/layout/UniversalEditorLayout"

export function JourneyEditorLayout() {
  const { slug = "" } = useParams<{ slug: string }>()

  const formatPageName = (value: string) => {
    if (!value) return "New Journey"
    return value
      .replace(/([A-Z])/g, " $1")
      .replace(/[-_]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase())
  }

  return (
    <JourneyDraftProvider>
      <UniversalEditorLayout
        backToUrl="/journeys"
        backToLabel="Back to Journeys"
        icon={Compass}
        iconColor="text-amber-500"
        title={`${formatPageName(slug)} Journey`}
        sidebarContent={
          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        }
        previewContent={<JourneyPreview />}
        useWorkspaceScale={true}
      />
    </JourneyDraftProvider>
  )
}
