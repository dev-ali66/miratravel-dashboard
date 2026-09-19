import { FormSection, DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"

export type RegionalKnowledgeFormProps = {
  section: any
  index: number
  updateSection: (index: number, patch: Record<string, any>) => void
  openSections: Record<string, boolean>
  toggleSection: (key: string) => void
  sectionNumber: number | string
}

export function RegionalKnowledgeForm({
  section,
  index,
  updateSection,
  openSections,
  toggleSection,
  sectionNumber,
}: RegionalKnowledgeFormProps) {
  const isOpen = Boolean(openSections["regional_knowledge"])
  const regionalData = section || {}

  return (
    <FormSection
      title="Regional Knowledge Section"
      sectionNumber={String(sectionNumber)}
      active={isOpen}
      onClick={() => toggleSection("regional_knowledge")}
    >
      <div className="space-y-4">
        <DynamicStyledField
          label="Eyebrow / Category"
          value={regionalData.eyebrow}
          onChange={(val: any) => updateSection(index, { eyebrow: val })}
        />

        <DynamicStyledField
          label="Title / Headline"
          type="textarea"
          value={regionalData.title}
          onChange={(val: any) => updateSection(index, { title: val })}
        />

        <DynamicStyledField
          label="Top Intro Description"
          type="textarea"
          value={regionalData.description}
          onChange={(val: any) => updateSection(index, { description: val })}
        />

        <DynamicStyledField
          label="Detailed / Bordered Right Text"
          type="textarea"
          value={regionalData.secondaryDescription}
          onChange={(val: any) => updateSection(index, { secondaryDescription: val })}
        />

        <div className="pt-2 border-t border-border/40 space-y-4">
          <UniversalMultimediaForm
            title="Media Asset 1"
            value={regionalData.multimedia1}
            onChange={(val: any) => updateSection(index, { multimedia1: val })}
          />

          <UniversalMultimediaForm
            title="Media Asset 2"
            value={regionalData.multimedia2}
            onChange={(val: any) => updateSection(index, { multimedia2: val })}
          />
        </div>

        <div className="pt-2 border-t border-border/40">
          <UniversalMultimediaForm
            title="Section Background"
            value={regionalData.backgroundMultimedia}
            onChange={(val: any) => updateSection(index, { backgroundMultimedia: val })}
          />
        </div>
      </div>
    </FormSection>
  )
}

export default RegionalKnowledgeForm
