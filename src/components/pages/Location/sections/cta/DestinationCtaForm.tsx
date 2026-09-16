import { Sparkles } from "lucide-react"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { ButtonsField } from "@/components/pages/CMS/shared/ButtonsField"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { FormSection } from "../../shared/fields"
import type { LocationFormSectionProps } from "../../config/locationSections"

export function DestinationCtaForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: LocationFormSectionProps) {
  const ctaData =
    draft?.cta ||
    (draft as any)?.data?.cta ||
    (draft as any)?.destinationCta ||
    (draft as any)?.data?.destinationCta || {
      title: {
        value: "Didn't find your perfect journey?",
        textColor: "#182d09",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      description: {
        value:
          "Our collection is carefully designed but every travel is different.\nIf you'd like something more personal, we'd love to create it together.",
        textColor: "#565e69",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      buttons: [
        {
          label: "Plan a tailor-made journey",
          url: "/contact",
          style: "primary",
          variant: "PRIMARY",
          backgroundColor: "#af6348",
          textColor: "#ffffff",
        },
      ],
      imageMultimedia: null,
      backgroundMultimedia: null,
    }

  const isOpen = Boolean(openSections["cta"])

  const updateCtaField = (fieldKey: string, value: any) => {
    updateField(`cta.${fieldKey}`, value)
  }

  // Handle Decorative Motif Image Change
  const handleMotifMediaChange = (multimedia: any) => {
    updateCtaField("imageMultimedia", multimedia)
  }

  const resolvedButtons =
    Array.isArray(ctaData.buttons) && ctaData.buttons.length > 0
      ? ctaData.buttons
      : ctaData.button
      ? [
          {
            label: ctaData.button?.label || ctaData.buttonText || "Plan a tailor-made journey",
            url: ctaData.button?.url || ctaData.buttonUrl || "/contact",
            style: ctaData.button?.style || "primary",
            variant: "PRIMARY",
            backgroundColor: ctaData.button?.backgroundColor || "#af6348",
            textColor: ctaData.button?.textColor || "#ffffff",
          },
        ]
      : [
          {
            label: "Plan a tailor-made journey",
            url: "/contact",
            style: "primary",
            variant: "PRIMARY",
            backgroundColor: "#af6348",
            textColor: "#ffffff",
          },
        ]

  return (
    <FormSection
      title="10. Destination Call to Action (CTA)"
      active={isOpen}
      onClick={() => toggleSection("cta")}
    >
      <div className="flex flex-col gap-6">
        {/* Section Header & Narrative */}
        <div className="rounded-xl border border-border/70 bg-card/60 p-4 space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Headline & Subtitle
          </h4>

          {/* Main Title Heading */}
          <DynamicStyledField
            type="text"
            label="Banner Heading"
            fieldName="cta.title"
            placeholder="e.g. Didn't find your perfect journey?"
            value={ctaData.title}
            onChange={(val) => updateCtaField("title", val)}
          />

          {/* Narrative Subtitle / Description */}
          <DynamicStyledField
            type="textarea"
            label="Supporting Paragraph / Narrative"
            rows={3}
            fieldName="cta.description"
            placeholder="e.g. Our collection is carefully designed but every travel is different..."
            value={ctaData.description}
            onChange={(val) => updateCtaField("description", val)}
          />
        </div>

        {/* Action Button Controls */}
        <div className="rounded-xl border border-border/70 bg-card/60 p-4">
          <ButtonsField
            label="Action Buttons (CTA)"
            fieldName="cta.buttons"
            buttons={resolvedButtons}
            onChange={(buttons) => {
              updateCtaField("buttons", buttons)
            }}
          />
        </div>

        {/* Right Decorative Motif Image */}
        <UniversalMultimediaForm
          title="Decorative Motif Image (Right Floating Visual)"
          fieldName="cta.imageMultimedia"
          imageFieldName="locationCtaMotifImage"
          hideFieldNameBadge={true}
          allowVideo={false}
          value={ctaData.imageMultimedia}
          onChange={handleMotifMediaChange}
        />

        {/* Section Background Multimedia */}
        <UniversalMultimediaForm
          title="Card Background Media (Color / Image / Video)"
          fieldName="cta.backgroundMultimedia"
          imageFieldName="locationCtaBgImage"
          videoFieldName="locationCtaBgVideo"
          hideFieldNameBadge={true}
          value={ctaData.backgroundMultimedia}
          onChange={(multimedia) =>
            updateCtaField("backgroundMultimedia", multimedia)
          }
        />
      </div>
    </FormSection>
  )
}
