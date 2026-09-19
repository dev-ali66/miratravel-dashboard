import type { ContactSection } from "../contactTypes"

export interface ContactFormSectionProps {
  section: ContactSection
  index: number
  updateSection: (index: number, updatedFields: Partial<ContactSection>) => void
  openSections: Record<string, boolean>
  toggleSection: (key: string) => void
  sectionNumber: number
}

export const contactSections = [
  { key: "hero", label: "Hero Banner", number: 1 },
  { key: "process", label: "How The Process Works", number: 2 },
  { key: "inquiry-form", label: "Inquiry Form / Escape Header", number: 3 },
  { key: "plan-travel", label: "A Personal Approach / Plan Travel", number: 4 },
  { key: "contact-info", label: "Contact Info Items", number: 5 },
  { key: "cta", label: "Call To Action (CTA)", number: 6 },
  { key: "seo", label: "SEO & Metadata", number: 7 },
]
