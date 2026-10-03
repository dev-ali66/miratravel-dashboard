import {
  FormSection,
  DynamicStyledField,
} from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { RepeaterList } from "@/components/pages/CMS/shared/RepeaterList"
import type { NewsletterCmsFormSectionProps } from "../../newsletterCmsTypes"

export function UnsubscribeForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: NewsletterCmsFormSectionProps) {
  const unsubscribe = draft?.unsubscribe || draft?.data?.unsubscribe || {}
  const isOpen = Boolean(openSections["unsubscribe"])

  const updateUnsubscribeField = (fieldKey: string, value: any) => {
    updateField(`unsubscribe.${fieldKey}`, value)
  }

  const reasonsList: string[] = Array.isArray(unsubscribe.reasonsList)
    ? unsubscribe.reasonsList
    : [
        "Emails are too frequent",
        "Content is no longer relevant",
        "Taking a break from travel planning",
        "I never signed up for this",
        "Other reasons",
      ]

  return (
    <FormSection
      title="Newsletter Unsubscribe Section"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("unsubscribe")}
    >
      <div className="flex flex-col gap-5">
        {/* Main Form Titles */}
        <div className="rounded-lg border border-border/70 bg-card p-3.5 flex flex-col gap-3">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Headings & Subtitles
          </p>

          {/* Title */}
          <DynamicStyledField
            type="textarea"
            rows={2}
            label="Unsubscribe Form Main Title"
            fieldName="unsubscribe.title"
            placeholder="e.g. We're Sorry to See You Go"
            value={unsubscribe.title}
            onChange={(val) => updateUnsubscribeField("title", val)}
            enableStyle
          />

          {/* Subtitle / Paragraph */}
          <DynamicStyledField
            type="textarea"
            rows={3}
            label="Form Subtitle / Intro Paragraph"
            fieldName="unsubscribe.subtitle"
            placeholder="e.g. If our travel dispatches no longer inspire your adventures..."
            value={unsubscribe.subtitle}
            onChange={(val) => updateUnsubscribeField("subtitle", val)}
            enableStyle
          />

          {/* Confirmation Screen Title */}
          <DynamicStyledField
            type="text"
            label="Success State Title (After Unsubscribing)"
            fieldName="unsubscribe.unsubscribedTitle"
            placeholder="e.g. You're Unsubscribed"
            value={unsubscribe.unsubscribedTitle}
            onChange={(val) => updateUnsubscribeField("unsubscribedTitle", val)}
            enableStyle
          />

          {/* Confirmation Screen Subtitle */}
          <DynamicStyledField
            type="textarea"
            rows={2}
            label="Success State Description (After Unsubscribing)"
            fieldName="unsubscribe.unsubscribedSubtitle"
            placeholder="e.g. You have been removed from our dispatch list..."
            value={unsubscribe.unsubscribedSubtitle}
            onChange={(val) => updateUnsubscribeField("unsubscribedSubtitle", val)}
            enableStyle
          />
        </div>

        {/* Unsubscribe Reasons List */}
        <div className="rounded-lg border border-border/70 bg-card p-3.5 flex flex-col gap-3">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Unsubscribe Feedback Reasons
          </p>

          <DynamicStyledField
            type="text"
            label="Reasons Section Title"
            fieldName="unsubscribe.reasonsTitle"
            placeholder="e.g. Help us understand why (optional):"
            value={unsubscribe.reasonsTitle}
            onChange={(val) => updateUnsubscribeField("reasonsTitle", val)}
            enableStyle
          />

          <div className="pt-2">
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Feedback Options List
            </label>
            <RepeaterList<string>
              items={reasonsList}
              onChange={(nextItems) => updateUnsubscribeField("reasonsList", nextItems)}
              addLabel="Add Feedback Reason"
              emptyLabel="No reasons defined."
              itemLabel={(item, idx) => item || `Reason #${idx + 1}`}
              renderItem={(item, update) => (
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-medium text-muted-foreground">
                    Reason Text
                  </label>
                  <input
                    type="text"
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    value={item}
                    onChange={(e) => update(e.target.value)}
                    placeholder="Enter reason..."
                  />
                </div>
              )}
            />
          </div>
        </div>

        {/* Showcase Image / Media */}
        <UniversalMultimediaForm
          title="Left Column Showcase Image"
          fieldName="unsubscribe.leftSideMultimedia"
          allowImage={true}
          allowVideo={true}
          allowColor={true}
          defaultShow="image"
          imageTitle="Showcase Image"
          imageLabel="Reflective Moment Image"
          value={unsubscribe.leftSideMultimedia}
          onChange={(val) => {
            updateUnsubscribeField("leftSideMultimedia", val)
          }}
        />

        {/* Background Multimedia */}
        <UniversalMultimediaForm
          title="Background Multimedia"
          fieldName="unsubscribe.backgroundMultimedia"
          allowImage={true}
          allowVideo={true}
          allowColor={true}
          defaultShow="color"
          imageTitle="Background Image"
          imageLabel="Page Background Image"
          value={unsubscribe.backgroundMultimedia}
          onChange={(val) => {
            updateUnsubscribeField("backgroundMultimedia", val)
          }}
        />
      </div>
    </FormSection>
  )
}

export default UnsubscribeForm
