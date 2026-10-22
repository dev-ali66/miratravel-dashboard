import {
  normalizeMultimedia,
  normalizeStyledField,
  normalizeButtonsArray,
  LOCATION_THEME_COLORS,
} from "../../Location/shared/normalizeHelpers"
import type { ExperienceData } from "../experienceTypes"
import { emptyHero, emptyEssence, emptyFaq } from "./emptyExperience"

export function normalizeHero(hero: any) {
  const safeHero = hero && typeof hero === "object" ? hero : {}

  const normalizedHero = {
    ...safeHero,
    title: normalizeStyledField(safeHero.title ?? emptyHero.title, "", "#FFFFFF"),
    description: normalizeStyledField(safeHero.description ?? emptyHero.description, "", "#FFFFFF"),
    breadcrumb: normalizeStyledField(safeHero.breadcrumb ?? emptyHero.breadcrumb, "", null),
    subtitle: normalizeStyledField(safeHero.subtitle ?? emptyHero.subtitle, "", null),
    isCenter: safeHero.isCenter !== undefined ? Boolean(safeHero.isCenter) : emptyHero.isCenter,
    buttons: normalizeButtonsArray(safeHero.buttons ?? emptyHero.buttons),
    backgroundMultimedia: normalizeMultimedia(
      safeHero.backgroundMultimedia ?? safeHero.multimedia ?? emptyHero.backgroundMultimedia,
      "video"
    ),
  }

  delete (normalizedHero as any).background_image
  delete (normalizedHero as any).video
  delete (normalizedHero as any).showVideo
  delete (normalizedHero as any).button
  delete (normalizedHero as any).titleStyle
  delete (normalizedHero as any).breadcrumbStyle
  delete (normalizedHero as any).descriptionStyle
  delete (normalizedHero as any).multimedia

  return normalizedHero
}

export function normalizeEssence(essence: any) {
  const safeEssence = essence && typeof essence === "object" ? essence : {}

  const rawStatValue =
    safeEssence.stat?.statValue ??
    safeEssence.stat_badge_value ??
    safeEssence.statValue ??
    emptyEssence.stat.statValue
  const rawStatLabel =
    safeEssence.stat?.statLabel ??
    safeEssence.stat_badge_label ??
    safeEssence.statLabel ??
    emptyEssence.stat.statLabel
  const rawStatBadgeBg =
    safeEssence.stat?.statBadgeBg ??
    safeEssence.stat_badge_bg ??
    safeEssence.statBadgeBg ??
    emptyEssence.stat.statBadgeBg

  const normalizedEssence = {
    ...safeEssence,
    label: normalizeStyledField(safeEssence.label ?? emptyEssence.label, "", LOCATION_THEME_COLORS.accent),
    title: normalizeStyledField(safeEssence.title ?? emptyEssence.title, "", LOCATION_THEME_COLORS.primary),
    paragraphs: normalizeStyledField(safeEssence.paragraphs ?? emptyEssence.paragraphs, "", LOCATION_THEME_COLORS.muted),
    quote: normalizeStyledField(safeEssence.quote ?? emptyEssence.quote, "", LOCATION_THEME_COLORS.primary),
    stat: {
      statValue: normalizeStyledField(rawStatValue, "", "#ffffff"),
      statLabel: normalizeStyledField(rawStatLabel, "", "#ffffff"),
      statBadgeBg: typeof rawStatBadgeBg === "string" ? rawStatBadgeBg : "#E5A84B",
    },
    imageMultimedia: normalizeMultimedia(
      safeEssence.imageMultimedia || safeEssence.multimedia || emptyEssence.imageMultimedia,
      "image"
    ),
    backgroundMultimedia: normalizeMultimedia(
      safeEssence.backgroundMultimedia || emptyEssence.backgroundMultimedia,
      "color"
    ),
  }

  delete (normalizedEssence as any).labelStyle
  delete (normalizedEssence as any).titleStyle
  delete (normalizedEssence as any).paragraphsStyle
  delete (normalizedEssence as any).quoteStyle
  delete (normalizedEssence as any).style

  return normalizedEssence
}

export function normalizeFaq(faqSection: any) {
  const safeFaq = faqSection && typeof faqSection === "object" ? faqSection : {}

  const rawItems = Array.isArray(safeFaq.items)
    ? safeFaq.items
    : Array.isArray(safeFaq.questions)
      ? safeFaq.questions
      : (emptyFaq.items ?? [])

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
    title: normalizeStyledField(safeFaq.title ?? emptyFaq.title, "", "#182d09"),
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

export function normalizeExperiencePayload(draft: Partial<ExperienceData>) {
  const safeDraft = draft && typeof draft === "object" ? draft : {}

  const payload: any = {
    name: (safeDraft.name ?? "").trim(),
    featured: Boolean(safeDraft.featured),
    parentId: safeDraft.parentId ? String(safeDraft.parentId).trim() : null,
    hero: normalizeHero(safeDraft.hero),
    essence: normalizeEssence(safeDraft.essence),
    faq: normalizeFaq(safeDraft.faq),
  }

  if (safeDraft.id) {
    payload.id = safeDraft.id
  }

  if (safeDraft.slug && safeDraft.slug.trim()) {
    payload.slug = safeDraft.slug.trim()
  }

  if (safeDraft.price !== undefined && safeDraft.price !== null && safeDraft.price !== "") {
    payload.price = Number(safeDraft.price)
  } else {
    payload.price = null
  }

  if (safeDraft.priceType && safeDraft.priceType.trim()) {
    payload.priceType = safeDraft.priceType.trim()
  } else {
    payload.priceType = null
  }

  if (safeDraft.metadata) {
    payload.metadata = safeDraft.metadata
  }

  if (safeDraft.geoData) {
    payload.geoData = safeDraft.geoData
  }

  return payload
}
