import { normalizeMultimedia, normalizeStyledField } from "../../shared/normalizeHelpers"

export function normalizeFaq(faqSection: any) {
  const safeFaq = faqSection && typeof faqSection === "object" ? faqSection : {}

  const rawItems = Array.isArray(safeFaq.items)
    ? safeFaq.items
    : Array.isArray(safeFaq.questions)
      ? safeFaq.questions
      : []

  const normalizedItems = rawItems.map((q: any) => {
    const normItem = {
      question: normalizeStyledField(q.question, "", "#182d09"),
      answer: normalizeStyledField(q.answer, "", "#565e69"),
      multimedia: normalizeMultimedia(q.multimedia ?? q.imageMultimedia),
    }
    delete (normItem as any).questionStyle
    delete (normItem as any).answerStyle
    delete (normItem as any).style
    return normItem
  })

  const normalizedFaq = {
    ...safeFaq,
    // label: normalizeStyledField(safeFaq.label, "FREQUENTLY ASKED QUESTIONS", "#af6348"),
    title: normalizeStyledField(safeFaq.title, "", "#182d09"),
    items: normalizedItems,
    imageMultimedia: normalizeMultimedia(safeFaq.imageMultimedia, "image"),
    backgroundMultimedia: normalizeMultimedia(safeFaq.backgroundMultimedia, "color"),
    style: safeFaq.style ?? null,
  }

  delete (normalizedFaq as any).labelStyle
  delete (normalizedFaq as any).titleStyle
  delete (normalizedFaq as any).style

  return normalizedFaq
}
