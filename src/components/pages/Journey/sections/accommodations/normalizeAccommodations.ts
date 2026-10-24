import { THEME_COLORS } from "@/config/theme"
import { normalizeMultimedia, normalizeStyledField, getSafeStringValue } from "@/components/pages/Journey/shared/normalizeHelpers"
import { emptyAccommodations } from "./emptyAccommodations"

export function normalizeAccommodations(accommodations: any) {
  const safe = accommodations && typeof accommodations === "object" ? accommodations : {}

  const philRaw = safe.philosophy || {}
  const destRaw = safe.destinationStays || safe.destinations || {}
  const stdRaw = safe.standards || safe.standardsSection || {}
  const visRaw = safe.visualReference || {}

  // 1. Philosophy
  const philEyebrow = normalizeStyledField(philRaw.eyebrow ?? philRaw.badge ?? safe.eyebrow ?? safe.badge ?? emptyAccommodations.philosophy.eyebrow, "Our Philosophy", THEME_COLORS.accent)
  const philTitle = normalizeStyledField(philRaw.title ?? safe.title ?? emptyAccommodations.philosophy.title, "Our Accommodation Philosophy", THEME_COLORS.dark)
  const philDesc = normalizeStyledField(philRaw.description ?? safe.description ?? emptyAccommodations.philosophy.description, "", THEME_COLORS.muted)
  
  const rawPrinciples = Array.isArray(philRaw.items) && philRaw.items.length > 0
    ? philRaw.items
    : Array.isArray(philRaw.principles) && philRaw.principles.length > 0
    ? philRaw.principles
    : Array.isArray(safe.principles) && safe.principles.length > 0
    ? safe.principles
    : emptyAccommodations.philosophy.items

  const normalizedPrinciples = rawPrinciples.map((p: any, pIdx: number) => ({
    title: normalizeStyledField(p.title, `Principle ${pIdx + 1}`, THEME_COLORS.dark),
    description: normalizeStyledField(p.description ?? p.subtitle, "", THEME_COLORS.muted),
    iconType: p.iconType || p.icon || "character",
    multimedia: normalizeMultimedia(p.multimedia ?? p.image),
  }))

  const philosophy = {
    eyebrow: philEyebrow,
    title: philTitle,
    description: philDesc,
    items: normalizedPrinciples,
  }

  // 2. Destination Stays
  const destEyebrow = normalizeStyledField(destRaw.eyebrow ?? destRaw.badge ?? safe.destinationsBadge ?? emptyAccommodations.destinationStays.eyebrow, "Destination by Destination", THEME_COLORS.accent)
  const destTitle = normalizeStyledField(destRaw.title ?? safe.destinationsTitle ?? safe.handpickedTitle ?? emptyAccommodations.destinationStays.title, "Your Accommodation Journey", THEME_COLORS.dark)
  const destDesc = normalizeStyledField(destRaw.description ?? safe.destinationsDescription ?? emptyAccommodations.destinationStays.description, "", THEME_COLORS.muted)
  const handpickedTitle = normalizeStyledField(destRaw.handpickedTitle ?? safe.handpickedTitle ?? destTitle, "Your Accommodation Journey", THEME_COLORS.dark)

  const rawStays = Array.isArray(destRaw.items)
    ? destRaw.items
    : Array.isArray(destRaw.staysList)
    ? destRaw.staysList
    : Array.isArray(safe.items)
    ? safe.items
    : Array.isArray(safe.staysList)
    ? safe.staysList
    : []

  const normalizedStays = rawStays.map((stay: any) => ({
    locationId: stay.locationId || "",
    stayType: normalizeStyledField(stay.stayType ?? stay.subtitle, "Boutique Hotel", THEME_COLORS.accent),
    duration: normalizeStyledField(stay.duration ?? stay.stayDuration, "2 nights", THEME_COLORS.accent),
    description: normalizeStyledField(stay.description, "", THEME_COLORS.muted),
    confirmationBadge: normalizeStyledField(stay.confirmationBadge ?? stay.confirmedBy, "Personally confirmed by Mira", THEME_COLORS.accent),
    showMiraSeal: stay.showMiraSeal !== undefined ? Boolean(stay.showMiraSeal) : true,
    multimedia: normalizeMultimedia(stay.multimedia ?? stay.image),
    amenities: Array.isArray(stay.amenities)
      ? stay.amenities.map((a: any) => typeof a === "string" ? a : getSafeStringValue(a))
      : [],
  }))

  const destinationStays = {
    eyebrow: destEyebrow,
    title: destTitle,
    description: destDesc,
    handpickedTitle,
    items: normalizedStays,
  }

  // 3. Standards
  const stdEyebrow = normalizeStyledField((typeof stdRaw === "object" ? stdRaw.eyebrow ?? stdRaw.badge : null) ?? safe.standardsBadge ?? emptyAccommodations.standards.eyebrow, "Standards", THEME_COLORS.accent)
  const stdTitle = normalizeStyledField((typeof stdRaw === "object" ? stdRaw.title : null) ?? safe.standardsTitle ?? safe.expectationsTitle ?? emptyAccommodations.standards.title, "What You Can Expect", THEME_COLORS.dark)
  const stdDesc = normalizeStyledField((typeof stdRaw === "object" ? stdRaw.description : null) ?? safe.standardsDescription ?? emptyAccommodations.standards.description, "", THEME_COLORS.muted)

  const rawStandards = Array.isArray(stdRaw.items) && stdRaw.items.length > 0
    ? stdRaw.items
    : Array.isArray(stdRaw) && stdRaw.length > 0
    ? stdRaw
    : Array.isArray(safe.standards) && safe.standards.length > 0
    ? safe.standards
    : emptyAccommodations.standards.items

  const normalizedStandards = rawStandards.map((st: any) => normalizeStyledField(st, "", THEME_COLORS.navText))

  const standards = {
    eyebrow: stdEyebrow,
    title: stdTitle,
    description: stdDesc,
    items: normalizedStandards,
  }

  // 4. Visual Reference
  const visEyebrow = normalizeStyledField(visRaw.eyebrow ?? visRaw.badge ?? safe.visualReferenceBadge ?? emptyAccommodations.visualReference.eyebrow, "Visual Reference", THEME_COLORS.accent)
  const visTitle = normalizeStyledField(visRaw.title ?? safe.visualReferenceTitle ?? emptyAccommodations.visualReference.title, "Examples of the Accommodation Style", THEME_COLORS.dark)
  const visDesc = normalizeStyledField(visRaw.description ?? safe.visualReferenceDescription ?? emptyAccommodations.visualReference.description, "", THEME_COLORS.muted)
  
  const rawGallery = Array.isArray(visRaw.items) && visRaw.items.length > 0
    ? visRaw.items
    : Array.isArray(visRaw.galleryImages) && visRaw.galleryImages.length > 0
    ? visRaw.galleryImages
    : Array.isArray(safe.visualGalleryImages) && safe.visualGalleryImages.length > 0
    ? safe.visualGalleryImages
    : emptyAccommodations.visualReference.items

  const normalizedGallery = rawGallery.map((img: any) => normalizeMultimedia(img))

  const visualReference = {
    eyebrow: visEyebrow,
    title: visTitle,
    description: visDesc,
    items: normalizedGallery,
  }

  return {
    philosophy,
    destinationStays,
    standards,
    visualReference,
    items: normalizedStays,
  }
}
