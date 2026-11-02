import MiraLoader from "@/components/shared/MiraLoader"
import { useState, useEffect } from "react"
import { EditorFormHeader } from "@/components/shared/EditorFormHeader"

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

  useEffect(() => {
    const handleActiveSectionChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ sectionKey: string }>
      if (customEvent.detail?.sectionKey) {
        const key = customEvent.detail.sectionKey
        setOpenSections({ [key]: true })
      }
    }

    window.addEventListener("editor-active-section-change", handleActiveSectionChange)
    return () => {
      window.removeEventListener("editor-active-section-change", handleActiveSectionChange)
    }
  }, [])

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
      <MiraLoader text="Loading Contact Us editor data..." className="min-h-[400px] py-16" />
    )
  }

  return (
    <div className="flex min-h-full flex-col">
      {/* Header (Universal Sticky Header) */}
      <EditorFormHeader
        eyebrow="CMS Page"
        title="Edit Contact Us Page"
        saveLabel="Save"
        isSaving={isSaving}
        onSave={save}
        onConsoleData={() => {
          console.log("📍 [CLEAN CONTACT US API PAYLOAD SENT TO BACKEND]:", normalizedPage)
        }}
        consoleDataTitle="Inspect clean payload in console (F12)"
      />

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
