import {
  UniversalFaqForm,
  type FAQItemData,
} from "@/components/pages/CMS/shared/UniversalFaqForm"
import type { StoryFormSectionProps } from "../../config/storySections"

export type { FAQItemData }

export function FaqForm(props: StoryFormSectionProps) {
  return (
    <UniversalFaqForm
      {...props}
      sectionKey="faq"
      mediaPrefix="storyFaq"
      title="Frequently Asked Questions (FAQ)"
      subtitle="Add and curate frequently asked questions for this story."
    />
  )
}

export default FaqForm
