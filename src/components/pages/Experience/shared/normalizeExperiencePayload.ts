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
    title: normalizeStyledField(safeHero.title ?? emptyHero.title, "", "#FFFFFF"),
    description: normalizeStyledField(safeHero.description ?? emptyHero.description, "", "#FFFFFF"),
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
    label: normalizeStyledField(safe.label ?? emptyTheExperience.label, "THE EXPERIENCE", "#af6348"),
    title: normalizeStyledField(safe.title ?? emptyTheExperience.title, "", "#182d09"),
    summary: normalizeStyledField(safe.summary ?? emptyTheExperience.summary, "", "#565e69"),
    narrative: normalizeStyledField(safe.narrative ?? emptyTheExperience.narrative, "", "#333333"),
    quote: normalizeStyledField(safe.quote ?? emptyTheExperience.quote, "", "#182d09"),
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
    title: normalizeStyledField(item.title, "", "#182d09"),
    description: normalizeStyledField(item.description, "", "#565e69"),
  }))

  return {
    label: normalizeStyledField(safe.label ?? emptyHighlights.label, "KEY HIGHLIGHTS", "#af6348"),
    title: normalizeStyledField(safe.title ?? emptyHighlights.title, "What makes this unforgettable", "#182d09"),
    items: normalizedItems,
  }
}

export function normalizePracticalInfo(practical: any) {
  const safe = practical && typeof practical === "object" ? practical : {}

  return {
    duration: normalizeStyledField(safe.duration ?? emptyPracticalInfo.duration, "", "#182d09"),
    season: normalizeStyledField(safe.season ?? emptyPracticalInfo.season, "", "#182d09"),
    activityLevel: normalizeStyledField(safe.activityLevel ?? emptyPracticalInfo.activityLevel, "", "#182d09"),
    groupSize: normalizeStyledField(safe.groupSize ?? emptyPracticalInfo.groupSize, "", "#182d09"),
    locationNotes: normalizeStyledField(safe.locationNotes ?? emptyPracticalInfo.locationNotes, "", "#565e69"),
  }
}

export function normalizeMiraTouch(miraTouch: any) {
  const safe = miraTouch && typeof miraTouch === "object" ? miraTouch : {}

  const rawItems = Array.isArray(safe.items) ? safe.items : emptyMiraTouch.items

  const normalizedItems = rawItems.map((item: any) => ({
    title: normalizeStyledField(item.title, "", "#182d09"),
    description: normalizeStyledField(item.description, "", "#565e69"),
  }))

  return {
    label: normalizeStyledField(safe.label ?? emptyMiraTouch.label, "THE MIRA TOUCH", "#af6348"),
    title: normalizeStyledField(safe.title ?? emptyMiraTouch.title, "Distinction, Privacy & Insider Access", "#182d09"),
    description: normalizeStyledField(safe.description ?? emptyMiraTouch.description, "", "#565e69"),
    items: normalizedItems,
    imageMultimedia: normalizeMultimedia(safe.imageMultimedia || emptyMiraTouch.imageMultimedia, "image"),
  }
}

export function normalizeEnquiryCta(cta: any) {
  const safe = cta && typeof cta === "object" ? cta : {}

  return {
    title: normalizeStyledField(safe.title ?? emptyEnquiryCta.title, "", "#FFFFFF"),
    subtitle: normalizeStyledField(safe.subtitle ?? emptyEnquiryCta.subtitle, "", "#E5E7EB"),
    badgeText: typeof safe.badgeText === "string" ? safe.badgeText : "EXPERIENCE RESERVATION",
    primaryButtonText: typeof safe.primaryButtonText === "string" ? safe.primaryButtonText : "Include in My Journey",
    secondaryButtonText: typeof safe.secondaryButtonText === "string" ? safe.secondaryButtonText : "Enquire About This Experience",
    note: normalizeStyledField(safe.note ?? emptyEnquiryCta.note, "", "#9CA3AF"),
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
    status: safeDraft.status || "PUBLISHED",
    primaryType: safeDraft.primaryType || "CULTURE_HERITAGE",
    secondaryTypes: Array.isArray(safeDraft.secondaryTypes) ? safeDraft.secondaryTypes : [],
    attributes: Array.isArray(safeDraft.attributes) ? safeDraft.attributes : [],
    countryId: safeDraft.countryId ? String(safeDraft.countryId).trim() : null,
    regionId: safeDraft.regionId ? String(safeDraft.regionId).trim() : null,
    placeId: safeDraft.placeId ? String(safeDraft.placeId).trim() : null,
    parentId: safeDraft.parentId ? String(safeDraft.parentId).trim() : null,
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
