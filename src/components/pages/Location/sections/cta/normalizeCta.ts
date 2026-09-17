import { normalizeMultimedia, normalizeStyledField, normalizeButtonsArray } from "../../shared/normalizeHelpers"

export function normalizeCta(ctaSection: any) {
  const safeCta = ctaSection && typeof ctaSection === "object" ? ctaSection : {}

  const rawButtons = Array.isArray(safeCta.buttons) && safeCta.buttons.length > 0
    ? safeCta.buttons
    : safeCta.button
      ? [safeCta.button]
      : []

  const normalizedCta = {
    ...safeCta,
    label: normalizeStyledField(safeCta.label, "", "#af6348"),
    title: normalizeStyledField(safeCta.title, "", "#182d09"),
    subtitle: normalizeStyledField(safeCta.subtitle ?? safeCta.description, "", "#565e69"),
    buttons: normalizeButtonsArray(rawButtons),
    imageMultimedia: normalizeMultimedia(safeCta.imageMultimedia, "image"),
    backgroundMultimedia: normalizeMultimedia(safeCta.backgroundMultimedia, "color"),
    style: safeCta.style ?? null,
  }

  delete (normalizedCta as any).labelStyle
  delete (normalizedCta as any).titleStyle
  delete (normalizedCta as any).subtitleStyle
  delete (normalizedCta as any).descriptionStyle
  delete (normalizedCta as any).style

  return normalizedCta
}
