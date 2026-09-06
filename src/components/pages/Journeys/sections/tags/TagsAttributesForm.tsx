/* =====================================================
   JOURNEYS — TAGS & ATTRIBUTES FORM SECTION
===================================================== */

import {
  FormSection,
  JourneyMultiBadgeSelect,
} from "../../shared/fields"
import {
  JOURNEY_TYPES,
  TRAVEL_STYLES,
  PERFECT_FOR,
  type Journey,
  type JourneyType,
  type TravelStyle,
  type PerfectFor,
} from "../../journeyTypes"

export type TagsAttributesFormProps = {
  draft: Journey
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export function TagsAttributesForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: TagsAttributesFormProps) {
  return (
    <FormSection
      title="Categories & Target Audience"
      active={!!openSections["tags"]}
      onClick={() => toggleSection("tags")}
    >
      <div className="space-y-4">
        <JourneyMultiBadgeSelect<JourneyType>
          label="Journey Types"
          selected={draft.journeyType || []}
          options={JOURNEY_TYPES}
          onChange={(val) => updateField("journeyType", val)}
          description="High-level category classifying this itinerary."
        />

        <div className="h-px bg-border/60" />

        <JourneyMultiBadgeSelect<TravelStyle>
          label="Travel Styles"
          selected={draft.travelStyle || []}
          options={TRAVEL_STYLES}
          onChange={(val) => updateField("travelStyle", val)}
          description="Vibe and rhythm of the experience."
        />

        <div className="h-px bg-border/60" />

        <JourneyMultiBadgeSelect<PerfectFor>
          label="Perfect For"
          selected={draft.perfectFor || []}
          options={PERFECT_FOR}
          onChange={(val) => updateField("perfectFor", val)}
          description="Target traveler profile & party configuration."
        />
      </div>
    </FormSection>
  )
}
