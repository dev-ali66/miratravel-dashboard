import { UniversalFaqPreview } from "@/components/pages/CMS/shared/UniversalFaqPreview"
import type { StoryPreviewProps } from "../../config/storySections"

export function FaqPreview({ story }: StoryPreviewProps) {
  return <UniversalFaqPreview draft={story} sectionKey="faq" />
}

export default FaqPreview
