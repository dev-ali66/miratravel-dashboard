import { normalizeMultimedia, normalizeStyledField, normalizeButtonsArray } from "../../shared/normalizeHelpers"
import { emptyCta } from "./emptyCta"

export function normalizeCta(ctaSection: any) {
  const safeCta = ctaSection && typeof ctaSection === "object" ? ctaSection : {}

  const rawButtons = Array.isArray(safeCta.buttons) && safeCta.buttons.length > 0
    ? safeCta.buttons
    : safeCta.button
      ? [safeCta.button]
      : (emptyCta.buttons ?? [])

  const normalizedCta = {
    ...safeCta,
    label: normalizeStyledField(safeCta.label, "", "#af6348"),
    title: normalizeStyledField(safeCta.title ?? emptyCta.title, "", "#182d09"),
    description: normalizeStyledField(safeCta.description ?? emptyCta.description, "", "#565e69"),
    buttons: normalizeButtonsArray(rawButtons),
    imageMultimedia: normalizeMultimedia(safeCta.imageMultimedia || emptyCta.imageMultimedia, "image"),
    backgroundMultimedia: normalizeMultimedia(safeCta.backgroundMultimedia || emptyCta.backgroundMultimedia, "color"),
    style: safeCta.style ?? null,
  }

  delete (normalizedCta as any).labelStyle
  delete (normalizedCta as any).titleStyle
  delete (normalizedCta as any).subtitleStyle
  delete (normalizedCta as any).descriptionStyle
  delete (normalizedCta as any).style

  return normalizedCta
}

