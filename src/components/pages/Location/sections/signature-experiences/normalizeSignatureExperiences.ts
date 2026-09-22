import { normalizeMultimedia, normalizeStyledField, normalizeButtonsArray } from "../../shared/normalizeHelpers"
import { emptySignatureExperiences } from "./emptySignatureExperiences"

export function normalizeSignatureExperiences(signatureExperiences: any) {
  const safeSig = signatureExperiences && typeof signatureExperiences === "object" ? signatureExperiences : {}

  const rawItems = Array.isArray(safeSig.items)
    ? safeSig.items
    : Array.isArray(safeSig.experiences)
      ? safeSig.experiences
      : (emptySignatureExperiences.items ?? [])

  const normalizedItems = rawItems.map((it: any, idx: number) => {
    const rawButtons = Array.isArray(it.buttons) && it.buttons.length > 0
      ? it.buttons
      : it.button
        ? [it.button]
        : (it.href || it.linkText)
          ? [{ label: it.linkText || "Explore Experience", url: it.href || "" }]
          : []

    const normItem = {
      id: it.id || `sig-${idx}-${Date.now()}`,
      title: normalizeStyledField(it.title, "", "#182d09"),
      description: normalizeStyledField(it.description, "", "#565e69"),
      buttons: normalizeButtonsArray(rawButtons),
      multimedia: normalizeMultimedia(it.multimedia ?? it.imageMultimedia, "image"),
    }

    delete (normItem as any).titleStyle
    delete (normItem as any).descriptionStyle
    delete (normItem as any).style

    return normItem
  })

  const normalizedSignatureExperiences = {
    ...safeSig,
    label: normalizeStyledField(safeSig.label ?? emptySignatureExperiences.label, "SIGNATURE EXPERIENCES", "#af6348"),
    title: normalizeStyledField(safeSig.title ?? emptySignatureExperiences.title, "", "#182d09"),
    description: normalizeStyledField(safeSig.description ?? emptySignatureExperiences.description, "", "#565e69"),
    items: normalizedItems,
    backgroundMultimedia: normalizeMultimedia(safeSig.backgroundMultimedia || emptySignatureExperiences.backgroundMultimedia, "color"),
    style: safeSig.style ?? null,
  }

  delete (normalizedSignatureExperiences as any).labelStyle
  delete (normalizedSignatureExperiences as any).titleStyle
  delete (normalizedSignatureExperiences as any).descriptionStyle
  delete (normalizedSignatureExperiences as any).style

  return normalizedSignatureExperiences
}

