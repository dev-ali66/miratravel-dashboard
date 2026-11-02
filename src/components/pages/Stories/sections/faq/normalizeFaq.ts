import { THEME_COLORS } from "@/config/theme"
import { normalizeMultimedia, normalizeStyledField } from "@/components/pages/Location/shared/normalizeHelpers"
import { emptyFaq } from "./emptyFaq"

export function normalizeFaq(faqSection: any) {
  if (!faqSection || typeof faqSection !== "object") {
    return emptyFaq
  }

  const rawItems = Array.isArray(faqSection.items)
    ? faqSection.items
    : Array.isArray(faqSection.questions)
    ? faqSection.questions
    : (emptyFaq.items ?? [])

  const normalizedItems = rawItems.map((q: any) => {
    const normItem = {
      question: normalizeStyledField(q.question, "", THEME_COLORS.primary),
      answer: normalizeStyledField(q.answer, "", THEME_COLORS.muted),
      multimedia: normalizeMultimedia(q.multimedia ?? q.imageMultimedia),
    }
    delete (normItem as any).questionStyle
    delete (normItem as any).answerStyle
    delete (normItem as any).style
    return normItem
  })

  const normalizedFaq = {
    ...faqSection,
    title: normalizeStyledField(faqSection.title ?? emptyFaq.title, "", THEME_COLORS.primary),
    items: normalizedItems,
    imageMultimedia: normalizeMultimedia(faqSection.imageMultimedia || emptyFaq.imageMultimedia, "image"),
    backgroundMultimedia: normalizeMultimedia(faqSection.backgroundMultimedia || emptyFaq.backgroundMultimedia, "color"),
  }

  delete (normalizedFaq as any).labelStyle
  delete (normalizedFaq as any).titleStyle
  delete (normalizedFaq as any).style

  return normalizedFaq
}

export default normalizeFaq
