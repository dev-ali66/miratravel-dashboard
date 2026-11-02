import {
  UniversalFaqForm,
  type FAQItemData,
} from "@/components/pages/CMS/shared/UniversalFaqForm"
import type { ExperienceFormSectionProps } from "../../config/experienceSections"

export type { FAQItemData }

export function FaqForm(props: ExperienceFormSectionProps) {
  return (
    <UniversalFaqForm
      {...props}
      sectionKey="faq"
      mediaPrefix="experienceFaq"
      title="Frequently Asked Questions (FAQ)"
      subtitle="Add and curate frequently asked questions for this experience."
    />
  )
}

export default FaqForm
