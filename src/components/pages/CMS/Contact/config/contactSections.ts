import type { ComponentType } from "react"
import { PageHeroForm } from "../shared/form/PageHeroForm"
import { ProcessStepsForm } from "../shared/form/ProcessStepsForm"
import { InquiryForm } from "../shared/form/InquiryForm"
import { PersonalApproachForm } from "../shared/form/PersonalApproachForm"
import { ContactInformationForm } from "../shared/form/ContactInformationForm"
import { FinalCtaForm } from "../shared/form/FinalCtaForm"
import type { ContactFormSectionProps } from "../shared/form/sectionTypes"

export type ContactSectionKey = string

export type ContactSectionConfig = {
  label: string
  form: ComponentType<ContactFormSectionProps>
  preview: null
}

export const contactSectionRegistry: Record<string, ContactSectionConfig> = {
  pageHero: { label: "Page Hero", form: PageHeroForm, preview: null },
  stepList: { label: "Process Steps", form: ProcessStepsForm, preview: null },
  contactForm: { label: "Inquiry Form", form: InquiryForm, preview: null },
  textImageFeature: {
    label: "Personal Approach",
    form: PersonalApproachForm,
    preview: null,
  },
  infoColumns: {
    label: "Contact Information",
    form: ContactInformationForm,
    preview: null,
  },
  ctaBanner: { label: "Final CTA", form: FinalCtaForm, preview: null },
}

export const contactSectionOrder = [
  "pageHero",
  "stepList",
  "contactForm",
  "textImageFeature",
  "infoColumns",
  "ctaBanner",
]
