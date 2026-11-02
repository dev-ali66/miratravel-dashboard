import {
  UniversalFaqForm,
  type FAQItemData,
} from "@/components/pages/CMS/shared/UniversalFaqForm"
import type { LocationFormSectionProps } from "../../config/locationSections"
import type { FAQItem } from "../../locationTypes"

export type { FAQItemData }
export type FAQItemDataAlias = FAQItem

export function FaqForm(props: LocationFormSectionProps) {
  return (
    <UniversalFaqForm
      {...props}
      sectionKey="faq"
      mediaPrefix="locationFaq"
      title="Frequently Asked Questions (FAQ)"
      subtitle="Add and curate frequently asked questions for this destination."
    />
  )
}

export default FaqForm
