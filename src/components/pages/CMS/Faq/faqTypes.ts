export interface FaqPageData {
  id?: string
  name: string
  slug: string
  metadata?: Record<string, any>
  data: {
    page?: "faq"
    hero?: Record<string, any>
    faq_list?: Record<string, any>
    cta?: Record<string, any>
    seo?: Record<string, any>
    sections?: any[]
  }
}

export interface FaqSectionProps {
  section: any
  index: number
  updateSection: (index: number, patch: Record<string, any>) => void
  openSections: Record<string, boolean>
  toggleSection: (key: string) => void
  sectionNumber: number
}
