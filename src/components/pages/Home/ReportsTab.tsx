import RecentTransactions from "./RecentTransactions"
import ExportReports from "./ExportReports"

export default function ReportsTab() {
  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <RecentTransactions className="md:col-span-2 lg:col-span-5" />
        <ExportReports className="md:col-span-2 lg:col-span-2" />
      </div>
    </div>
  )
}
