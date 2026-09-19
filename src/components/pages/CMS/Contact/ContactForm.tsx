import { useState } from "react"
import { Loader2, Save, Terminal } from "lucide-react"

import { useCmsPage } from "../shared/useCmsPage"
import { HeroForm } from "./sections/hero/HeroForm"
import { ProcessForm } from "./sections/process/ProcessForm"
import { InquiryFormSection } from "./sections/inquiry-form/InquiryFormSection"
import { PlanTravelForm } from "./sections/plan-travel/PlanTravelForm"
import { ContactInfoForm } from "./sections/contact-info/ContactInfoForm"
import { CtaForm } from "./sections/cta/CtaForm"
import { SeoMetadataForm } from "./sections/seo/SeoMetadataForm"

import { normalizeContactPayload } from "./config/normalizeContactPayload"

export function ContactForm() {
  const { page, setPage, isLoading, isSaving, save } = useCmsPage<any>(
    "contact-us",
    "Contact Us"
  )

  const normalizedPage = normalizeContactPayload(page)
  const data = normalizedPage?.data || {}

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  const toggleSection = (key: string) => {
    setOpenSections((current) => {
      const isCurrentlyOpen = !!current[key]
      return isCurrentlyOpen ? {} : { [key]: true }
    })
  }

  const updateSectionByKey = (key: string, patch: Record<string, any>) => {
    setPage((current: any) => {
      const currentNorm = normalizeContactPayload(current)
      const currentData = (currentNorm?.data || {}) as Record<string, any>
      const currentSec = currentData[key] || {}
      const updatedSec = { ...currentSec, ...patch }

      return {
        ...currentNorm,
        data: {
          ...currentData,
          page: "contact-us",
          [key]: updatedSec,
        },
      }
    })
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center p-10">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <p className="mt-2 text-xs text-muted-foreground">
          Loading Contact Us editor data...
        </p>
      </div>
    )
  }

  return (
    <div className="flex min-h-full flex-col">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-border/60 bg-card/95 px-5 py-4 backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
              CMS Page
            </p>
            <h2 className="mt-1 truncate text-base font-semibold">
              Edit Contact Us Page
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                console.log("📍 [CLEAN CONTACT US API PAYLOAD SENT TO BACKEND]:", normalizedPage)
              }}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border/80 bg-background px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted cursor-pointer"
              title="Inspect clean payload in console (F12)"
            >
              <Terminal className="h-3.5 w-3.5 text-primary" />
              Console Data
            </button>

            <button
              type="button"
              onClick={save}
              disabled={isSaving}
              className="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Accordion Sections */}
      <div className="flex-1 divide-y divide-border/60">
        {/* 1. Hero */}
        <div data-section="hero">
          <HeroForm
            section={data.hero}
            index={0}
            updateSection={(_idx, patch) => updateSectionByKey("hero", patch)}
            openSections={openSections}
            toggleSection={toggleSection}
            sectionNumber={1}
          />
        </div>

        {/* 2. Process */}
        <div data-section="process">
          <ProcessForm
            section={data.process}
            index={1}
            updateSection={(_idx, patch) => updateSectionByKey("process", patch)}
            openSections={openSections}
            toggleSection={toggleSection}
            sectionNumber={2}
          />
        </div>

        {/* 3. Inquiry Form */}
        <div data-section="inquiry-form">
          <InquiryFormSection
            section={data.inquiry_form || data.inquiryForm}
            index={2}
            updateSection={(_idx, patch) =>
              updateSectionByKey("inquiry_form", patch)
            }
            openSections={openSections}
            toggleSection={toggleSection}
            sectionNumber={3}
          />
        </div>

        {/* 4. Plan Travel */}
        <div data-section="plan-travel">
          <PlanTravelForm
            section={data.plan_travel || data.planTravel}
            index={3}
            updateSection={(_idx, patch) =>
              updateSectionByKey("plan_travel", patch)
            }
            openSections={openSections}
            toggleSection={toggleSection}
            sectionNumber={4}
          />
        </div>

        {/* 5. Contact Info */}
        <div data-section="contact-info">
          <ContactInfoForm
            section={data.contact_info || data.contactInfo}
            index={4}
            updateSection={(_idx, patch) =>
              updateSectionByKey("contact_info", patch)
            }
            openSections={openSections}
            toggleSection={toggleSection}
            sectionNumber={5}
          />
        </div>

        {/* 6. CTA */}
        <div data-section="cta">
          <CtaForm
            section={data.cta}
            index={5}
            updateSection={(_idx, patch) => updateSectionByKey("cta", patch)}
            openSections={openSections}
            toggleSection={toggleSection}
            sectionNumber={6}
          />
        </div>

        {/* 7. SEO & Metadata */}
        <div data-section="seo">
          <SeoMetadataForm
            data={page ?? { name: "Contact Us" }}
            setData={setPage as any}
            openSections={openSections}
            toggleSection={toggleSection}
            sectionNumber={7}
          />
        </div>
      </div>
    </div>
  )
}

export default ContactForm
