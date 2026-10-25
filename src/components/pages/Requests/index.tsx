import { useState } from "react"
import { Compass, Users } from "lucide-react"
import JourneyWizardTable from "./JourneyWizardTable"
import RequestListTable from "./RequestListTable"
import { FilterToolbar, FilterGroup, FilterTabs } from "@/components/shared/FilterToolbar"

export default function RequestsPage() {
  const [activeTab, setActiveTab] = useState<"wizard" | "instructor">("wizard")

  return (
    <div className="w-full space-y-4 pt-2">
      <FilterToolbar>
        <FilterGroup>
          <FilterTabs
            tabs={[
              { key: "wizard", label: "Journey Requests (Wizard)", icon: Compass },
              { key: "instructor", label: "Instructor Requests", icon: Users },
            ]}
            activeTab={activeTab}
            onChange={(tab) => setActiveTab(tab as "wizard" | "instructor")}
          />
        </FilterGroup>
      </FilterToolbar>

      {activeTab === "wizard" ? <JourneyWizardTable /> : <RequestListTable />}
    </div>
  )
}
