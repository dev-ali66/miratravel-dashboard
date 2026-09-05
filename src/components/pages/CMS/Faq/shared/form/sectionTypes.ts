import type { FaqItem, FaqPageData, FaqStyles } from "../../faqTypes"

export type FaqSectionFormProps = {
  index: number
  data: FaqPageData["data"]
  metadata: FaqPageData["metadata"]
  styles: FaqStyles
  updateData: (value: Partial<FaqPageData["data"]>) => void
  updateSectionContent: (index: number, patch: Record<string, any>) => void
  updateMetadata: (value: Partial<FaqPageData["metadata"]>) => void
  updateContent: (value: Partial<FaqPageData["data"]["content"]>) => void
  updateHeaderStyles: (value: Partial<FaqStyles["header"]>) => void
  updateFaqStyles: (value: Partial<FaqStyles["faq"]>) => void
}

export type FaqQuestionsFormProps = Pick<
  FaqSectionFormProps,
  "data" | "updateData"
> & {
  items: FaqItem[]
}
