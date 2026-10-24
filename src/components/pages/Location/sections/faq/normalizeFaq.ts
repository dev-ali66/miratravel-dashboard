import { THEME_COLORS } from "@/config/theme"
import { normalizeMultimedia, normalizeStyledField } from "../../shared/normalizeHelpers"
import { emptyFaq } from "./emptyFaq"

export function normalizeFaq(faqSection: any) {
  const safeFaq = faqSection && typeof faqSection === "object" ? faqSection : {}

  const rawItems = Array.isArray(safeFaq.items)
    ? safeFaq.items
    : Array.isArray(safeFaq.questions)
      ? safeFaq.questions
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
    ...safeFaq,
    title: normalizeStyledField(safeFaq.title ?? emptyFaq.title, "", THEME_COLORS.primary),
    items: normalizedItems,
    imageMultimedia: normalizeMultimedia(safeFaq.imageMultimedia || emptyFaq.imageMultimedia, "image"),
    backgroundMultimedia: normalizeMultimedia(safeFaq.backgroundMultimedia || emptyFaq.backgroundMultimedia, "color"),
    style: safeFaq.style ?? null,
  }

  delete (normalizedFaq as any).labelStyle
  delete (normalizedFaq as any).titleStyle
  delete (normalizedFaq as any).style

  return normalizedFaq
}

