import { Outlet, useParams } from "react-router-dom"
import { Compass } from "lucide-react"

import { JourneyPreview } from "./preview/JourneyPreview"
import { JourneyDraftProvider } from "./shared/JourneyDraftContext"
import { UniversalEditorLayout } from "@/components/layout/UniversalEditorLayout"

export function JourneyEditorLayout() {
  const { slug = "" } = useParams<{ slug?: string }>()

  const formatTitle = (val: string) => {
    if (!val || val === "new") return "New Journey"
    return val
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
        iconColor="text-[#af6348]"
        title={formatTitle(slug)}
        sidebarContent={
          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        }
        previewContent={<JourneyPreview />}
        useWorkspaceScale={false}
      />
    </JourneyDraftProvider>
  )
}
