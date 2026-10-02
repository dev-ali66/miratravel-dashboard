export interface JourneyCmsFormSectionProps {
  draft: any
  updateField: (fieldPath: string, value: any) => void
  openSections: Record<string, boolean>
  toggleSection: (sectionKey: string) => void
  sectionNumber: string | number
}

export interface JourneyCmsPreviewSectionProps {
  draft: any
}
