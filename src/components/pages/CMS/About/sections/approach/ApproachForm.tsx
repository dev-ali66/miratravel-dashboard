import { FormSection, DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"

export type ApproachFormProps = {
  section: any
  index: number
  updateSection: (index: number, patch: Record<string, any>) => void
  openSections: Record<string, boolean>
  toggleSection: (key: string) => void
  sectionNumber: number | string
}

export function ApproachForm({
  section,
  index,
  updateSection,
  openSections,
  toggleSection,
  sectionNumber,
}: ApproachFormProps) {
  const isOpen = Boolean(openSections["approach"])
  const approachData = section || {}

  return (
    <FormSection
      title="Our Approach Section"
      sectionNumber={String(sectionNumber)}
      active={isOpen}
      onClick={() => toggleSection("approach")}
    >
      <div className="space-y-4">
        <DynamicStyledField
          label="Eyebrow / Subtitle"
          value={approachData.eyebrow}
          onChange={(val: any) => updateSection(index, { eyebrow: val })}
        />

        <DynamicStyledField
          label="Title / Headline"
          type="textarea"
          value={approachData.title}
          onChange={(val: any) => updateSection(index, { title: val })}
        />

        <DynamicStyledField
          label="Description Text"
          type="textarea"
          value={approachData.description}
          onChange={(val: any) => updateSection(index, { description: val })}
        />

        <DynamicStyledField
          label="Highlight Quote"
          type="textarea"
          value={approachData.quote}
          onChange={(val: any) => updateSection(index, { quote: val })}
        />

        <div className="pt-2 border-t border-border/40 space-y-4">
          <UniversalMultimediaForm
            title="Left Media Asset (Image / Video)"
            value={approachData.leftMultimedia}
            onChange={(val: any) => updateSection(index, { leftMultimedia: val })}
          />

          <UniversalMultimediaForm
            title="Right Media Asset (Video / Image)"
            value={approachData.rightMultimedia}
            onChange={(val: any) => updateSection(index, { rightMultimedia: val })}
          />
        </div>

        <div className="pt-2 border-t border-border/40">
          <UniversalMultimediaForm
            title="Section Background"
            value={approachData.backgroundMultimedia}
            onChange={(val: any) => updateSection(index, { backgroundMultimedia: val })}
          />
        </div>
      </div>
    </FormSection>
  )
}

export default ApproachForm
