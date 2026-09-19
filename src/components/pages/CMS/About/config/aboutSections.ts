export interface AboutFormSectionProps {
  section: any
  index: number
  updateSection: (index: number, updatedFields: Record<string, any>) => void
  openSections: Record<string, boolean>
  toggleSection: (key: string) => void
  sectionNumber: number
}

export const aboutSections = [
  { key: "hero", label: "Hero Banner", number: 1 },
  { key: "philosophy", label: "Our Philosophy", number: 2 },
  { key: "approach", label: "Our Approach", number: 3 },
  { key: "regional_knowledge", label: "Regional Knowledge", number: 4 },
  { key: "people", label: "The People Behind MIRA", number: 5 },
  { key: "standard", label: "The MIRA Standard", number: 6 },
  { key: "stay", label: "The Journeys That Stay", number: 7 },
  { key: "cta", label: "Call To Action (CTA)", number: 8 },
  { key: "seo", label: "SEO & Metadata", number: 9 },
]
