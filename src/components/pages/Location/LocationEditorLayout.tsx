import { Outlet, useParams } from "react-router-dom"
import { LocateIcon } from "lucide-react"

import { LocationPreview } from "./LocationPreview"
import { LocationDraftProvider } from "./shared/LocationDraftContext"
import { UniversalEditorLayout } from "@/components/layout/UniversalEditorLayout"

export function LocationEditorLayout() {
  const { slug = "" } = useParams<{ slug: string }>()

  const formatPageName = (value: string) => {
    if (!value) return "New Location"
    return value
      .replace(/([A-Z])/g, " $1")
      .replace(/[-_]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase())
  }

  return (
    <LocationDraftProvider>
      <UniversalEditorLayout
        backToUrl="/location"
        backToLabel="Back to Locations"
        icon={LocateIcon}
        iconColor="text-accent"
        title={`${formatPageName(slug)} Location`}
        sidebarContent={
          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        }
        previewContent={<LocationPreview />}
        useWorkspaceScale={true}
      />
    </LocationDraftProvider>
  )
}
