import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { FormSection } from "@/components/pages/Location/shared/fields"
import type { ExperienceFormSectionProps } from "../../config/experienceSections"
import { emptyPracticalInfo } from "../../shared/emptyExperience"
import { Clock, Calendar, Activity, Users, MapPin } from "lucide-react"

export function PracticalInfoForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: ExperienceFormSectionProps) {
  const practical = draft?.practicalInfo || emptyPracticalInfo
  const isOpen = Boolean(openSections["practical-info"])

  const updatePracticalField = (fieldKey: string, value: any) => {
    updateField(`practicalInfo.${fieldKey}`, value)
  }

  return (
    <FormSection
      title="Practical Information (Duration, Season, Pace)"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("practical-info")}
    >
      <div className="flex flex-col gap-5">
        <p className="text-xs text-muted-foreground">
          Essential operational details travelers and travel designers consult when planning their journey rhythm.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Duration */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Clock className="h-3.5 w-3.5 text-primary" />
              Duration
            </div>
            <DynamicStyledField
              type="text"
              label=""
              fieldName="practicalInfo.duration"
              placeholder="e.g. Half Day (~4 hours) or Full Day (~7 hours)"
              value={practical.duration}
              onChange={(val) => updatePracticalField("duration", val)}
            />
          </div>

          {/* Best Season */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              Best Season / Seasonality
            </div>
            <DynamicStyledField
              type="text"
              label=""
              fieldName="practicalInfo.season"
              placeholder="e.g. May – October (Optimal weather conditions)"
              value={practical.season}
              onChange={(val) => updatePracticalField("season", val)}
            />
          </div>

          {/* Activity Level */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Activity className="h-3.5 w-3.5 text-primary" />
              Activity Level / Pace
            </div>
            <DynamicStyledField
              type="text"
              label=""
              fieldName="practicalInfo.activityLevel"
              placeholder="e.g. Moderate — comfortable walking on uneven terrain"
              value={practical.activityLevel}
              onChange={(val) => updatePracticalField("activityLevel", val)}
            />
          </div>

          {/* Group Size / Suitability */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Users className="h-3.5 w-3.5 text-primary" />
              Group Size & Suitability
            </div>
            <DynamicStyledField
              type="text"
              label=""
              fieldName="practicalInfo.groupSize"
              placeholder="e.g. Private (2–8 guests) • Recommended for adults & teens"
              value={practical.groupSize}
              onChange={(val) => updatePracticalField("groupSize", val)}
            />
          </div>
        </div>

        {/* Location & Rendezvous Notes */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            Meeting Point & Location Notes
          </div>
          <DynamicStyledField
            type="textarea"
            label=""
            fieldName="practicalInfo.locationNotes"
            placeholder="e.g. Direct private chauffeur transfer from your villa or hotel. Helicopter departure from Tirana Heliport."
            value={practical.locationNotes}
            onChange={(val) => updatePracticalField("locationNotes", val)}
          />
        </div>
      </div>
    </FormSection>
  )
}

export default PracticalInfoForm
