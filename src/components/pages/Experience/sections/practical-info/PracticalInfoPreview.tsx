import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { Clock, Calendar, Activity, Users, MapPin } from "lucide-react"
import type { ExperiencePreviewSectionProps } from "../../config/experienceSections"

export function PracticalInfoPreview({ draft }: ExperiencePreviewSectionProps) {
  const practical = draft?.practicalInfo

  if (!practical) return null

  const items = [
    {
      icon: Clock,
      label: "Duration",
      data: practical.duration,
    },
    {
      icon: Calendar,
      label: "Best Season",
      data: practical.season,
    },
    {
      icon: Activity,
      label: "Activity Level",
      data: practical.activityLevel,
    },
    {
      icon: Users,
      label: "Group Size",
      data: practical.groupSize,
    },
  ].filter((it) => it.data?.value)

  return (
    <section
      data-section="practical-info"
      className="relative w-full py-14 px-6 md:px-12 lg:px-20 bg-card border-y border-border/50 text-foreground"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <h3 className="font-serif text-2xl font-normal text-foreground">
          Practical Information
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((it, idx) => {
            const Icon = it.icon
            return (
              <div key={idx} className="flex flex-col gap-2 p-4 rounded-md bg-card border border-border/60 shadow-xs">
                <div className="flex items-center gap-2 text-accent">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="text-xs uppercase tracking-wider font-semibold">
                    {it.label}
                  </span>
                </div>
                <DynamicStyledTextPreview
                  as="div"
                  data={it.data}
                  className="text-sm font-medium text-foreground"
                />
              </div>
            )
          })}
        </div>

        {practical.locationNotes?.value && (
          <div className="flex items-start gap-3 p-4 rounded-md bg-muted/30 border border-border/50 text-sm">
            <MapPin className="h-4 w-4 text-accent shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Meeting & Logistics
              </span>
              <DynamicStyledTextPreview
                as="div"
                data={practical.locationNotes}
                className="text-xs text-muted-foreground leading-relaxed"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default PracticalInfoPreview
