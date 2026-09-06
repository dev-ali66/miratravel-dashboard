/* =====================================================
   JOURNEYS — HERO FIELDS COMPONENT
   Single Source of Truth compliant field form for Hero section.
   Directly bound to `data.hero` and `journeyHeroImage`.
===================================================== */

import { Plus, Trash2, CheckCircle2, Sparkles, DollarSign } from "lucide-react"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { ButtonsField, type CmsButton } from "@/components/pages/CMS/shared/ButtonsField"
import type { Journey } from "../../journeyTypes"

export const DEFAULT_HERO_BUTTONS: CmsButton[] = [
  {
    label: "Request This Journey",
    url: "#request",
    style: "primary",
    backgroundColor: "#235347",
    textColor: "#FFFFFF",
  },
  {
    label: "Questions on this journey?",
    url: "/contact-us",
    style: "link",
    textColor: "#464136",
  },
  {
    label: "Contact our travel experts",
    url: "/contact-us",
    style: "link",
    textColor: "#af6348",
  },
]

export type HeroFieldsProps = {
  draft: Journey
  updateField: (path: string, value: unknown) => void
}

export function HeroFields({ draft, updateField }: HeroFieldsProps) {
  const heroData = ((draft.data?.hero as any) || {}) as Record<string, any>
  const benefits: string[] = Array.isArray(heroData.benefits) ? heroData.benefits : []

  // Benefit item handlers
  const handleAddBenefit = () => {
    const nextBenefits = [...benefits, ""]
    updateField("data.hero.benefits", nextBenefits)
  }

  const handleUpdateBenefit = (index: number, val: string) => {
    const nextBenefits = [...benefits]
    nextBenefits[index] = val
    updateField("data.hero.benefits", nextBenefits)
  }

  const handleRemoveBenefit = (index: number) => {
    const nextBenefits = benefits.filter((_, i) => i !== index)
    updateField("data.hero.benefits", nextBenefits)
  }

  return (
    <div className="space-y-6">
      {/* 1. Core Titles & Subtitle */}
      <div className="rounded-xl border border-border/60 bg-card/40 p-4 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 border-b border-border/50 pb-2.5">
          <Sparkles className="h-4 w-4 text-primary" />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Hero Heading & Subtitle
          </h4>
        </div>

        <DynamicStyledField
          type="text"
          label="Hero Title"
          value={heroData.title ?? draft.title ?? ""}
          onChange={(val: string) => updateField("data.hero.title", val)}
          placeholder="e.g., Ancient Albania & Beyond"
          enableStyle
          style={heroData.titleStyle}
          onStyleChange={(style) => updateField("data.hero.titleStyle", style)}
        />

        <DynamicStyledField
          type="textarea"
          label="Hero Subtitle / Description"
          value={heroData.subtitle ?? draft.subtitle ?? ""}
          onChange={(val: string) => updateField("data.hero.subtitle", val)}
          placeholder="e.g., A curated 7-day luxury expedition across jagged alpine peaks and Ottoman citadel heritage."
          enableStyle
          style={heroData.subtitleStyle}
          onStyleChange={(style) => updateField("data.hero.subtitleStyle", style)}
        />
      </div>

      {/* 2. Pricing & Taxes Block */}
      <div className="rounded-xl border border-border/60 bg-card/40 p-4 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 border-b border-border/50 pb-2.5">
          <DollarSign className="h-4 w-4 text-emerald-500" />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Pricing & Booking Overview
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <DynamicStyledField
            type="number"
            label="Price Suffix (Persons)"
            value={heroData.personCount ?? (typeof heroData.priceSuffix === "number" ? heroData.priceSuffix : 1)}
            onChange={(val: number | string) => {
              const num = Number(val) || 1
              updateField("data.hero.personCount", num)
              updateField("data.hero.priceSuffix", num)
            }}
            placeholder="1"
            hint="1 = per person, 2 = two persons, 3 = three persons..."
            min={1}
            step={1}
          />

          <DynamicStyledField
            type="text"
            label="Taxes Label"
            value={heroData.taxesLabel ?? "Taxes & fees"}
            onChange={(val: string) => updateField("data.hero.taxesLabel", val)}
            placeholder="e.g., Taxes & fees"
          />

          <DynamicStyledField
            type="text"
            label="Taxes Value"
            value={heroData.taxesValue ?? "Calculated at checkout"}
            onChange={(val: string) => updateField("data.hero.taxesValue", val)}
            placeholder="e.g., Calculated at checkout"
          />
        </div>
      </div>

      {/* 3. Reusable Buttons (CMS /home Hero Button Style) */}
      <div className="rounded-md border border-border/50 p-3">
        <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Buttons
        </p>

        <ButtonsField
          value={
            Array.isArray(heroData.buttons) && heroData.buttons.length > 0
              ? heroData.buttons
              : DEFAULT_HERO_BUTTONS
          }
          onChange={(newButtons) => updateField("data.hero.buttons", newButtons)}
        />
      </div>

      {/* 4. Journey Benefits List */}
      <div className="rounded-xl border border-border/60 bg-card/40 p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Key Journey Benefits ({benefits.length})
            </h4>
          </div>
          <button
            type="button"
            onClick={handleAddBenefit}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Benefit
          </button>
        </div>

        {benefits.length === 0 ? (
          <p className="text-xs text-muted-foreground italic py-2">
            No benefits added yet. Click &quot;Add Benefit&quot; to highlight cancellation terms, guarantees, or support.
          </p>
        ) : (
          <div className="space-y-2 pt-1">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="flex-1">
                  <DynamicStyledField
                    type="text"
                    label=""
                    value={benefit}
                    onChange={(val: string) => handleUpdateBenefit(idx, val)}
                    placeholder={`e.g., Benefit #${idx + 1}`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveBenefit(idx)}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                  title="Remove benefit"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Section Background Multimedia (Single Source of Truth) */}
      <div className="pt-2 border-t border-border/60">
        <UniversalMultimediaForm
          section={heroData as any}
          content={heroData}
          updateSection={(patch) => {
            const nextHero = { ...heroData, ...patch }
            updateField("data.hero", nextHero)
            const bgMedia = (patch as any).backgroundMultimedia
            if (bgMedia?.url && (bgMedia.type === "image" || !bgMedia.type)) {
              updateField("journeyHeroImage", [bgMedia.url])
            } else if (bgMedia?.posterUrl) {
              updateField("journeyHeroImage", [bgMedia.posterUrl])
            }
          }}
          updateSectionContent={(patch) => {
            const nextHero = { ...heroData, ...patch }
            updateField("data.hero", nextHero)
            const bgMedia = (patch as any).backgroundMultimedia
            if (bgMedia?.url && (bgMedia.type === "image" || !bgMedia.type)) {
              updateField("journeyHeroImage", [bgMedia.url])
            } else if (bgMedia?.posterUrl) {
              updateField("journeyHeroImage", [bgMedia.posterUrl])
            }
          }}
          contentMediaKey="backgroundMultimedia"
          backgroundType={heroData.backgroundMultimedia?.type || "video"}
          backgroundTypeStyleKey="journeyHeroBackgroundTypeStyle"
          sectionTitle="Hero Multimedia & Section Background"
          showColorPicker
          colorLabel="Hero background color"
          defaultColor="#0F2A2E"
          imageTitle="Hero Background Image / Poster"
          imageLabel="Hero background image"
          imageFieldName="journeyHeroBackgroundImage"
          imageAltStyleKey="journeyHeroBackgroundImageAltStyle"
          videoFieldName="journeyHeroBackgroundVideo"
          videoTitle="Hero Background Video"
          videoLabel="Hero background video"
          videoHint="Upload a high-resolution video for the journey hero background."
          videoAltStyleKey="journeyHeroBackgroundVideoAltStyle"
          showImageAltField
          showVideoAltField
          showVideoSwitches
        />
      </div>
    </div>
  )
}
