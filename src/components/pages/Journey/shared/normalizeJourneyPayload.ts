import type { JourneyData } from "../journeyTypes"
import { emptyJourney } from "./emptyJourney"

export function normalizeJourneyPayload(rawDraft: Partial<JourneyData>): JourneyData {
  const draft = structuredClone(rawDraft)

  // Title fallback
  const title = (draft.title || "").trim()
  const slug = (draft.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "journey").trim()

  // Ensure arrays for multi-select enums
  const journeyType = Array.isArray(draft.journeyType) && draft.journeyType.length > 0
    ? draft.journeyType
    : ["PRIVATE_JOURNEY"]

  const travelStyle = Array.isArray(draft.travelStyle) && draft.travelStyle.length > 0
    ? draft.travelStyle
    : ["CULTURE_HERITAGE"]

  const perfectFor = Array.isArray(draft.perfectFor) && draft.perfectFor.length > 0
    ? draft.perfectFor
    : ["COUPLES"]

  // Clean Days
  const minDays = Number(draft.minDays) > 0 ? Number(draft.minDays) : 1
  const maxDays = Number(draft.maxDays) >= minDays ? Number(draft.maxDays) : minDays

  // Clean Price
  const price = Number(draft.price) >= 0 ? Number(draft.price) : 0

  // Hero Section
  const hero = {
    ...emptyJourney.hero,
    ...(draft.hero || {}),
    label: (draft.hero?.label || emptyJourney.hero?.label || "").trim(),
    title: (draft.hero?.title || title || "").trim(),
    subtitle: (draft.hero?.subtitle || draft.subtitle || "").trim(),
    badge: (draft.hero?.badge || emptyJourney.hero?.badge || "").trim(),
    buttons: Array.isArray(draft.hero?.buttons) ? draft.hero.buttons : [],
    background_image: draft.hero?.background_image || "",
    video: draft.hero?.video || "",
    backgroundMultimedia: draft.hero?.backgroundMultimedia ?? emptyJourney.hero?.backgroundMultimedia,
  }

  // Overview Section
  const overview = {
    ...emptyJourney.overview,
    ...(draft.overview || {}),
    title: (draft.overview?.title || emptyJourney.overview?.title || "").trim(),
    subtitle: (draft.overview?.subtitle || "").trim(),
    overviewText: (draft.overview?.overviewText || "").trim(),
    highlightsList: Array.isArray(draft.overview?.highlightsList)
      ? draft.overview.highlightsList.filter((h) => h && h.title)
      : [],
    routeSummary: (draft.overview?.routeSummary || "").trim(),
    featuresList: Array.isArray(draft.overview?.featuresList)
      ? draft.overview.featuresList.filter((f) => typeof f === "string" && f.trim())
      : [],
    backgroundMultimedia: draft.overview?.backgroundMultimedia ?? emptyJourney.overview?.backgroundMultimedia,
  }

  // Itinerary Section
  const itinerary = {
    ...emptyJourney.itinerary,
    ...(draft.itinerary || {}),
    title: (draft.itinerary?.title || emptyJourney.itinerary?.title || "").trim(),
    description: (draft.itinerary?.description || "").trim(),
    chaptersList: Array.isArray(draft.itinerary?.chaptersList) && draft.itinerary.chaptersList.length > 0
      ? draft.itinerary.chaptersList.map((chap, cIdx) => ({
          ...chap,
          id: chap.id || `chap-${cIdx + 1}`,
          chapterNumber: chap.chapterNumber || `Chapter ${cIdx + 1}`,
          title: (chap.title || `Chapter ${cIdx + 1}`).trim(),
          days: Array.isArray(chap.days)
            ? chap.days.map((d, index) => ({
                ...d,
                id: d.id || `day-${index + 1}`,
                dayNumber: d.dayNumber || index + 1,
                title: (d.title || `Day ${index + 1}`).trim(),
                description: (d.description || "").trim(),
              }))
            : [],
        }))
      : emptyJourney.itinerary?.chaptersList,
    daysList: Array.isArray(draft.itinerary?.daysList)
      ? draft.itinerary.daysList.map((d, index) => ({
          ...d,
          id: d.id || `day-${index + 1}`,
          dayNumber: d.dayNumber || index + 1,
          title: (d.title || `Day ${index + 1}`).trim(),
          description: (d.description || "").trim(),
          meals: Array.isArray(d.meals) ? d.meals : [],
          activities: Array.isArray(d.activities) ? d.activities : [],
          highlights: Array.isArray(d.highlights) ? d.highlights : [],
        }))
      : [],
    backgroundMultimedia: draft.itinerary?.backgroundMultimedia ?? emptyJourney.itinerary?.backgroundMultimedia,
  }

  // Accommodations Section
  const accommodations = {
    ...emptyJourney.accommodations,
    ...(draft.accommodations || {}),
    title: (draft.accommodations?.title || emptyJourney.accommodations?.title || "").trim(),
    description: (draft.accommodations?.description || "").trim(),
    staysList: Array.isArray(draft.accommodations?.staysList)
      ? draft.accommodations.staysList.map((s, index) => ({
          ...s,
          id: s.id || `stay-${index + 1}`,
          name: (s.name || `Stay ${index + 1}`).trim(),
          amenities: Array.isArray(s.amenities) ? s.amenities : [],
        }))
      : [],
    backgroundMultimedia: draft.accommodations?.backgroundMultimedia ?? emptyJourney.accommodations?.backgroundMultimedia,
  }

  // What's Included Section
  const whatsIncluded = {
    ...emptyJourney.whatsIncluded,
    ...(draft.whatsIncluded || {}),
    title: (draft.whatsIncluded?.title || emptyJourney.whatsIncluded?.title || "").trim(),
    description: (draft.whatsIncluded?.description || "").trim(),
    inclusions: Array.isArray(draft.whatsIncluded?.inclusions)
      ? draft.whatsIncluded.inclusions.filter((i) => i && i.title)
      : [],
    exclusions: Array.isArray(draft.whatsIncluded?.exclusions)
      ? draft.whatsIncluded.exclusions.filter((e) => e && e.title)
      : [],
    notes: Array.isArray(draft.whatsIncluded?.notes)
      ? draft.whatsIncluded.notes.filter((n) => typeof n === "string" && n.trim())
      : [],
    backgroundMultimedia: draft.whatsIncluded?.backgroundMultimedia ?? emptyJourney.whatsIncluded?.backgroundMultimedia,
  }

  // AddOns Section
  const addOns = {
    ...emptyJourney.addOns,
    ...(draft.addOns || {}),
    title: (draft.addOns?.title || emptyJourney.addOns?.title || "").trim(),
    description: (draft.addOns?.description || "").trim(),
    itemsList: Array.isArray(draft.addOns?.itemsList)
      ? draft.addOns.itemsList.map((a, index) => ({
          ...a,
          id: a.id || `addon-${index + 1}`,
          title: (a.title || `Option ${index + 1}`).trim(),
          price: Number(a.price) >= 0 ? Number(a.price) : 0,
          features: Array.isArray(a.features) ? a.features : [],
        }))
      : [],
    backgroundMultimedia: draft.addOns?.backgroundMultimedia ?? emptyJourney.addOns?.backgroundMultimedia,
  }

  // Gallery Section
  const gallery = {
    ...emptyJourney.gallery,
    ...(draft.gallery || {}),
    title: (draft.gallery?.title || emptyJourney.gallery?.title || "").trim(),
    description: (draft.gallery?.description || "").trim(),
    items: Array.isArray(draft.gallery?.items)
      ? draft.gallery.items.filter((item) => item && (item.url || item.multimedia))
      : [],
    backgroundMultimedia: draft.gallery?.backgroundMultimedia ?? emptyJourney.gallery?.backgroundMultimedia,
  }

  // Metadata / SEO
  const rawSeo = draft.metadata?.seo || draft.metadata || {}
  const metadata = {
    ...(draft.metadata || {}),
    seo: {
      metaTitle: (rawSeo.metaTitle || rawSeo.title || title || "").trim(),
      metaDescription: (rawSeo.metaDescription || rawSeo.description || draft.subtitle || "").trim(),
      metaKeywords: Array.isArray(rawSeo.metaKeywords)
        ? rawSeo.metaKeywords
        : typeof rawSeo.metaKeywords === "string"
        ? rawSeo.metaKeywords.split(",").map((k: string) => k.trim()).filter(Boolean)
        : [],
      ogTitle: (rawSeo.ogTitle || rawSeo.metaTitle || title || "").trim(),
      ogDescription: (rawSeo.ogDescription || rawSeo.metaDescription || "").trim(),
      ogImage: rawSeo.ogImage || "",
      canonicalUrl: rawSeo.canonicalUrl || "",
    },
  }

  const result: JourneyData = {
    ...draft,
    slug,
    title,
    subtitle: draft.subtitle || null,
    price,
    currency: draft.currency || "EUR",
    minDays,
    maxDays,
    pace: draft.pace || "BALANCED",
    comfortLevel: draft.comfortLevel || "BOUTIQUE",
    status: draft.status || "DRAFT",
    featured: Boolean(draft.featured),
    journeyType: journeyType as any,
    travelStyle: travelStyle as any,
    perfectFor: perfectFor as any,
    hero,
    overview,
    itinerary,
    accommodations,
    whatsIncluded,
    addOns,
    gallery,
    metadata,
  }

  return result
}
