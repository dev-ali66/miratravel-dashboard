import { LayoutDashboard } from "lucide-react"
import { PageHeader } from "@/components/shared/PageHeader"
import StatCards from "./StatCards"
import CockpitDeck from "./CockpitDeck"

export default function Home() {
  return (
    <div className="flex w-full flex-col gap-2 pt-2 pb-4">
      {/* Universal Page Header (30% Title & Subtitle / 70% Real Compact Stats) */}
      <PageHeader
        className="p-0 gap-2"
        icon={LayoutDashboard}
        title="Dashboard"
        subtitle="Mira Travel administration & telemetry control center."
        stats={<StatCards />}
      />

      {/* Unified 5-Card Cockpit Deck (Row 1: 3 Cards 33.3% + Row 2: 2 Wide Cards 50/50) */}
      <CockpitDeck />
    </div>
  )
}
