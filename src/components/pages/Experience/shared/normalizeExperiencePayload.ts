import { THEME_COLORS } from "@/config/theme"
import {
  normalizeMultimedia,
  normalizeStyledField,
  normalizeButtonsArray,
  LOCATION_THEME_COLORS,
} from "../../Location/shared/normalizeHelpers"
import type { ExperienceData } from "../experienceTypes"
import {
  emptyHero,
  emptyEssence,
  emptyFaq,
  emptyTheExperience,
  emptyHighlights,
  emptyPracticalInfo,
  emptyMiraTouch,
  emptyEnquiryCta,
} from "./emptyExperience"

export function normalizeHero(hero: any) {
  const safeHero = hero && typeof hero === "object" ? hero : {}

  const normalizedHero = {
    ...safeHero,
    title: normalizeStyledField(safeHero.title ?? emptyHero.title, "", THEME_COLORS.white),
    description: normalizeStyledField(safeHero.description ?? emptyHero.description, "", THEME_COLORS.white),
    breadcrumb: normalizeStyledField(safeHero.breadcrumb ?? emptyHero.breadcrumb, "EXPERIENCES", null),
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

export function normalizeTheExperience(theExp: any) {
  const safe = theExp && typeof theExp === "object" ? theExp : {}

  return {
    label: normalizeStyledField(safe.label ?? emptyTheExperience.label, "THE EXPERIENCE", THEME_COLORS.accent),
    title: normalizeStyledField(safe.title ?? emptyTheExperience.title, "", THEME_COLORS.primary),
    summary: normalizeStyledField(safe.summary ?? emptyTheExperience.summary, "", THEME_COLORS.muted),
    narrative: normalizeStyledField(safe.narrative ?? emptyTheExperience.narrative, "", THEME_COLORS.body),
    quote: normalizeStyledField(safe.quote ?? emptyTheExperience.quote, "", THEME_COLORS.primary),
    imageMultimedia: normalizeMultimedia(safe.imageMultimedia || emptyTheExperience.imageMultimedia, "image"),
    backgroundMultimedia: normalizeMultimedia(safe.backgroundMultimedia || emptyTheExperience.backgroundMultimedia, "color"),
  }
}

export function normalizeHighlights(highlights: any) {
  const safe = highlights && typeof highlights === "object" ? highlights : {}

  const rawItems = Array.isArray(safe.items) ? safe.items : emptyHighlights.items

  const normalizedItems = rawItems.map((item: any, idx: number) => ({
    id: item.id || `h-${idx + 1}`,
    badge: item.badge || `Highlight 0${idx + 1}`,
    title: normalizeStyledField(item.title, "", THEME_COLORS.primary),
    description: normalizeStyledField(item.description, "", THEME_COLORS.muted),
  }))

  return {
    label: normalizeStyledField(safe.label ?? emptyHighlights.label, "KEY HIGHLIGHTS", THEME_COLORS.accent),
    title: normalizeStyledField(safe.title ?? emptyHighlights.title, "What makes this unforgettable", THEME_COLORS.primary),
    items: normalizedItems,
  }
}

export function normalizePracticalInfo(practical: any) {
  const safe = practical && typeof practical === "object" ? practical : {}

  return {
    duration: normalizeStyledField(safe.duration ?? emptyPracticalInfo.duration, "", THEME_COLORS.primary),
    season: normalizeStyledField(safe.season ?? emptyPracticalInfo.season, "", THEME_COLORS.primary),
    activityLevel: normalizeStyledField(safe.activityLevel ?? emptyPracticalInfo.activityLevel, "", THEME_COLORS.primary),
    groupSize: normalizeStyledField(safe.groupSize ?? emptyPracticalInfo.groupSize, "", THEME_COLORS.primary),
    locationNotes: normalizeStyledField(safe.locationNotes ?? emptyPracticalInfo.locationNotes, "", THEME_COLORS.muted),
  }
}

export function normalizeMiraTouch(miraTouch: any) {
  const safe = miraTouch && typeof miraTouch === "object" ? miraTouch : {}

  const rawItems = Array.isArray(safe.items) ? safe.items : emptyMiraTouch.items

  const normalizedItems = rawItems.map((item: any) => ({
    title: normalizeStyledField(item.title, "", THEME_COLORS.primary),
    description: normalizeStyledField(item.description, "", THEME_COLORS.muted),
  }))

  return {
    label: normalizeStyledField(safe.label ?? emptyMiraTouch.label, "THE MIRA TOUCH", THEME_COLORS.accent),
    title: normalizeStyledField(safe.title ?? emptyMiraTouch.title, "Distinction, Privacy & Insider Access", THEME_COLORS.primary),
    description: normalizeStyledField(safe.description ?? emptyMiraTouch.description, "", THEME_COLORS.muted),
    items: normalizedItems,
    imageMultimedia: normalizeMultimedia(safe.imageMultimedia || emptyMiraTouch.imageMultimedia, "image"),
  }
}

export function normalizeEnquiryCta(cta: any) {
  const safe = cta && typeof cta === "object" ? cta : {}

  return {
    title: normalizeStyledField(safe.title ?? emptyEnquiryCta.title, "", THEME_COLORS.white),
    subtitle: normalizeStyledField(safe.subtitle ?? emptyEnquiryCta.subtitle, "", THEME_COLORS.mediaPlaceholder),
    badgeText: typeof safe.badgeText === "string" ? safe.badgeText : "EXPERIENCE RESERVATION",
    primaryButtonText: typeof safe.primaryButtonText === "string" ? safe.primaryButtonText : "Include in My Journey",
    secondaryButtonText: typeof safe.secondaryButtonText === "string" ? safe.secondaryButtonText : "Enquire About This Experience",
    note: normalizeStyledField(safe.note ?? emptyEnquiryCta.note, "", THEME_COLORS.lightMuted),
    backgroundMultimedia: normalizeMultimedia(safe.backgroundMultimedia || emptyEnquiryCta.backgroundMultimedia, "color"),
  }
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
      statValue: normalizeStyledField(rawStatValue, "", THEME_COLORS.white),
      statLabel: normalizeStyledField(rawStatLabel, "", THEME_COLORS.white),
      statBadgeBg: typeof rawStatBadgeBg === "string" ? rawStatBadgeBg : THEME_COLORS.accentMuted,
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

export function normalizeExperiencePayload(draft: Partial<ExperienceData>) {
  const safeDraft = draft && typeof draft === "object" ? draft : {}

  const payload: any = {
    name: (safeDraft.name ?? "").trim(),
    featured: Boolean(safeDraft.featured),
    status: safeDraft.status || "PUBLISHED",
    primaryType: safeDraft.primaryType || "CULTURE_HERITAGE",
    secondaryTypes: Array.isArray(safeDraft.secondaryTypes) ? safeDraft.secondaryTypes : [],
    attributes: Array.isArray(safeDraft.attributes) ? safeDraft.attributes : [],
    countries: Array.isArray(safeDraft.countries)
      ? safeDraft.countries.map((c: any) => (typeof c === "string" ? c : c?.id)).filter(Boolean)
      : [],
    regions: Array.isArray(safeDraft.regions)
      ? safeDraft.regions.map((r: any) => (typeof r === "string" ? r : r?.id)).filter(Boolean)
      : [],
    places: Array.isArray(safeDraft.places)
      ? safeDraft.places.map((p: any) => (typeof p === "string" ? p : p?.id)).filter(Boolean)
      : [],
    subtitle: safeDraft.subtitle || null,
    summary: safeDraft.summary || null,
    hero: normalizeHero(safeDraft.hero),
    theExperience: normalizeTheExperience(safeDraft.theExperience),
    highlights: normalizeHighlights(safeDraft.highlights),
    practicalInfo: normalizePracticalInfo(safeDraft.practicalInfo),
    miraTouch: normalizeMiraTouch(safeDraft.miraTouch),
    enquiryCta: normalizeEnquiryCta(safeDraft.enquiryCta),
    essence: normalizeEssence(safeDraft.essence),
    faq: normalizeFaq(safeDraft.faq),
  }

  if (safeDraft.id) {
    payload.id = safeDraft.id
  }

  const rawPrice = safeDraft.price
  if (rawPrice !== undefined && rawPrice !== null && String(rawPrice).trim() !== "") {
    const num = Number(rawPrice)
    payload.price = isNaN(num) ? 0 : Number(num.toFixed(2))
  } else {
    payload.price = 0
  }

  payload.currency =
    safeDraft.currency && typeof safeDraft.currency === "string" && safeDraft.currency.trim()
      ? safeDraft.currency.trim().toUpperCase()
      : "EUR"

  if (safeDraft.priceType && safeDraft.priceType.trim()) {
    payload.priceType = safeDraft.priceType.trim()
  } else {
    payload.priceType = null
  }

  // Relations (Journeys & Stories IDs)
  if (Array.isArray(safeDraft.journeys)) {
    payload.journeys = safeDraft.journeys
      .map((j: any) => (typeof j === "string" ? j : j?.id))
      .filter(Boolean)
  }

  if (Array.isArray(safeDraft.stories)) {
    payload.stories = safeDraft.stories
      .map((s: any) => (typeof s === "string" ? s : s?.id))
      .filter(Boolean)
  }

  if (safeDraft.metadata) {
    payload.metadata = safeDraft.metadata
  }

  if (safeDraft.geoData) {
    payload.geoData = safeDraft.geoData
  }

  return payload
}
