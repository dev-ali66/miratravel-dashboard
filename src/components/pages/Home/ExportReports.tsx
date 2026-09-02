import { SlideLeft } from "@/components/animation"
import { FileText, Download, FileSpreadsheet } from "lucide-react"

const availableReports = [
  {
    title: "Financial Summary",
    description: "Detailed breakdown of revenue, refunds, and net income.",
    type: "PDF",
    icon: FileText,
  },
  {
    title: "Booking History",
    description: "Complete list of all bookings with their current statuses.",
    type: "CSV",
    icon: FileSpreadsheet,
  },
  {
    title: "Instructor Performance",
    description: "Ratings, review counts, and total bookings per instructor.",
    type: "CSV",
    icon: FileSpreadsheet,
  },
  {
    title: "User Demographics",
    description: "Data export of user age, location, and booking frequency.",
    type: "PDF",
    icon: FileText,
  },
]

export default function ExportReports({ className }: { className?: string }) {
  return (
    <SlideLeft 
      delay={0.4}
      className={`rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col ${className || ''}`}
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">Available Reports</h3>
        <p className="text-sm text-muted-foreground mt-1">Generate and download detailed reports</p>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        {availableReports.map((report, i) => (
          <div 
            key={i} 
            className="group flex items-start gap-4 rounded-lg border border-border/50 p-4 transition-all hover:border-primary/50 hover:bg-muted/30"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <report.icon className="size-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground">{report.title}</h4>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                  {report.type}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {report.description}
              </p>
              <button className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                <Download className="size-3.5" />
                Generate {report.type}
              </button>
            </div>
          </div>
        ))}
      </div>
    </SlideLeft>
  )
}
