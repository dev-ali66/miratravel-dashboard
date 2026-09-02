import ConversionRate from "./ConversionRate"
import TrafficSources from "./TrafficSources"
import UserDemographics from "./UserDemographics"

export default function AnalyticsTab() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <ConversionRate className="md:col-span-2 lg:col-span-4" />
        <TrafficSources className="md:col-span-2 lg:col-span-3" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <UserDemographics className="md:col-span-2 lg:col-span-7" />
      </div>
    </div>
  )
}
