import { SlideRight, SlideLeft } from "@/components/animation"
import StatCards from "./StatCards"
import OverviewChart from "./OverviewChart"
import RecentActivity from "./RecentActivity"
import MonthlyBookingsChart from "./MonthlyBookingsChart"
import BookingStatus from "./BookingStatus"
import DateRangePicker from "./DateRangePicker"
import DownloadReportButton from "./DownloadReportButton"

export default function Home() {
  return (
    <div className="flex w-full flex-col gap-8 pb-8">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SlideRight>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back to Mira Travel administration center.
          </p>
        </SlideRight>

        <SlideLeft className="flex flex-wrap items-center gap-3">
          <DateRangePicker />
          <DownloadReportButton />
        </SlideLeft>
      </div>

      <div className="animate-fade-in flex flex-col gap-8">
        {/* KPI Stats Cards */}
        <StatCards />

        {/* Main Content Grid 1 */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <OverviewChart className="md:col-span-2 lg:col-span-4" />
          <RecentActivity className="md:col-span-2 lg:col-span-3" />
        </div>

        {/* Main Content Grid 2 */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <MonthlyBookingsChart className="md:col-span-2 lg:col-span-4" />
          <BookingStatus className="md:col-span-2 lg:col-span-3" />
        </div>
      </div>
    </div>
  )
}
