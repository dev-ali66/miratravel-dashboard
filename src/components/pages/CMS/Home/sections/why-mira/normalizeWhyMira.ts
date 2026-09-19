import {
  normalizeMultimedia,
  normalizeStyledField,
} from "@/components/pages/Location/shared/normalizeHelpers"

export function normalizeWhyMira(section: any) {
  const safeSection = section && typeof section === "object" ? section : {}
  const content =
    safeSection.content && typeof safeSection.content === "object"
      ? safeSection.content
      : {}

  const normalized = {
    ...safeSection,
    eyebrow: normalizeStyledField(
      safeSection.eyebrow ?? content.eyebrow,
      "Why MIRA",
      "#E5A84B"
    ),
    title: normalizeStyledField(
      safeSection.title ?? content.title,
      "Travel, shaped by insight. Refined through experience.",
      "#FFFFFF"
    ),
    signature: normalizeStyledField(
      safeSection.signature ?? content.signature,
      "— MIRA",
      "#E5A84B"
    ),
    description: normalizeStyledField(
      safeSection.description ??
        content.description ??
        (Array.isArray(safeSection.paragraphs)
          ? safeSection.paragraphs.join("\n\n")
          : Array.isArray(content.paragraphs)
          ? content.paragraphs.join("\n\n")
          : safeSection.paragraphs ?? content.paragraphs),
      "MIRA exists as a quiet force behind the region's most curated journeys. We are rooted in the authentic Balkan heritage, believing that true exploration requires a deep, editorial understanding of the land's silent narratives. Every expedition is a private monograph, meticulously designed to bridge the gap between contemporary luxury and the raw, untethered spirit of the frontier.",
      "#F3F4F6"
    ),
    backgroundMultimedia: normalizeMultimedia(
      safeSection.backgroundMultimedia ?? content.backgroundMultimedia,
      "color"
    ),
    rightSideMultimedia: normalizeMultimedia(
      safeSection.rightSideMultimedia ?? content.rightSideMultimedia,
      "image"
    ),
  }

  delete (normalized as any).key
  delete (normalized as any).type
  delete (normalized as any).bgColor
  delete (normalized as any).content
  return normalized
}

export default normalizeWhyMira
