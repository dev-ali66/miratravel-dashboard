import { Sparkles, MessageSquare, Image as ImageIcon, MousePointerClick } from "lucide-react"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
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
      line1: "Our collection is carefully designed but every travel is different.",
      line2: "If you'd like something more personal, we'd love to create it together.",
      buttonText: "Plan a tailor-made journey",
      buttonUrl: "/contact",
      button: {
        label: "Plan a tailor-made journey",
        url: "/contact",
        style: "primary",
        backgroundColor: "#af6348",
        textColor: "#ffffff",
      },
      image: "/images/cta.png",
      imageMultimedia: null,
      backgroundMultimedia: null,
    }

  const isOpen = Boolean(openSections["cta"])

  const updateCtaField = (fieldKey: string, value: any) => {
    updateField(`cta.${fieldKey}`, value)
  }

  // Handle Decorative Motif Image Change
  const handleMotifMediaChange = (multimedia: any) => {
    const resolvedUrl =
      multimedia?.image?.url ||
      multimedia?.url ||
      multimedia?.imageData?.url ||
      ""

    updateField("cta", {
      ...ctaData,
      imageMultimedia: multimedia,
      image: resolvedUrl,
    })
  }

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
        <div className="rounded-xl border border-border/70 bg-card/60 p-4 space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <MousePointerClick className="h-4 w-4 text-primary" />
            Action Button Settings
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Button Label
              </label>
              <input
                type="text"
                value={ctaData.button?.label || ctaData.buttonText || ""}
                onChange={(e) => {
                  const newLabel = e.target.value
                  updateField("cta", {
                    ...ctaData,
                    buttonText: newLabel,
                    button: {
                      ...(ctaData.button || {}),
                      label: newLabel,
                    },
                  })
                }}
                placeholder="Plan a tailor-made journey"
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Target URL / Modal Action
              </label>
              <input
                type="text"
                value={ctaData.button?.url || ctaData.buttonUrl || ""}
                onChange={(e) => {
                  const newUrl = e.target.value
                  updateField("cta", {
                    ...ctaData,
                    buttonUrl: newUrl,
                    button: {
                      ...(ctaData.button || {}),
                      url: newUrl,
                    },
                  })
                }}
                placeholder="/contact or wizard"
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Right Decorative Motif Image */}
        <UniversalMultimediaForm
          title="Decorative Motif Image (Right Floating Visual)"
          fieldName="cta.imageMultimedia"
          imageFieldName="locationCtaMotifImage"
          hideFieldNameBadge={true}
          allowVideo={false}
          value={
            ctaData.imageMultimedia ||
            (ctaData.image
              ? {
                  show: "image",
                  image: {
                    url: ctaData.image,
                    alt: "CTA Motif",
                    opacity: 100,
                    overlayColor: "#000000",
                    overlayOpacity: 0,
                    width: "100%",
                    height: "100%",
                    aspectRatio: "auto",
                    fit: "contain",
                  },
                }
              : null)
          }
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
