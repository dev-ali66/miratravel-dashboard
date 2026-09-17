import { normalizeMultimedia, normalizeStyledField } from "../../shared/normalizeHelpers"

export function normalizePracticalInfo(practicalInfo: any) {
  const safePractical = practicalInfo && typeof practicalInfo === "object" ? practicalInfo : {}

  const rawAccordionItems = Array.isArray(safePractical.items)
    ? safePractical.items
    : Array.isArray(safePractical.accordion_items)
      ? safePractical.accordion_items
      : Array.isArray(safePractical.accordions)
        ? safePractical.accordions
        : []

  const normalizedItems = rawAccordionItems.map((item: any, idx: number) => {
    const normItem = {
      id: item.id || `practical-${idx}-${Date.now()}`,
      title: normalizeStyledField(item.title, "", "#182d09"),
      content: normalizeStyledField(item.content, "", "#565e69"),
      multimedia: normalizeMultimedia(item.multimedia ?? item.imageMultimedia, "image"),
      is_expanded: item.is_expanded !== undefined ? Boolean(item.is_expanded) : true,
    }
    delete (normItem as any).titleStyle
    delete (normItem as any).contentStyle
    delete (normItem as any).style
    return normItem
  })

  const normalizedPracticalInfo = {
    ...safePractical,
    label: normalizeStyledField(safePractical.label, "BEFORE TRAVEL", "#af6348"),
    title: normalizeStyledField(safePractical.title, "", "#182d09"),
    items: normalizedItems,
    sideImageMultimedia: normalizeMultimedia(
      safePractical.sideImageMultimedia || safePractical.imageMultimedia
    ),
    backgroundMultimedia: normalizeMultimedia(safePractical.backgroundMultimedia, "color"),
  }

  delete (normalizedPracticalInfo as any).labelStyle
  delete (normalizedPracticalInfo as any).titleStyle
  delete (normalizedPracticalInfo as any).style
  delete (normalizedPracticalInfo as any).sub_heading
  delete (normalizedPracticalInfo as any).side_image
  delete (normalizedPracticalInfo as any).accordion_items

  return normalizedPracticalInfo
}
