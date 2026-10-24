import { THEME_COLORS } from "@/config/theme"
import { normalizeStyledField, normalizeMultimedia } from "@/components/pages/Journey/shared/normalizeHelpers"
import { emptyOverview } from "./emptyOverview"

export function normalizeOverview(data?: any) {
  const safe = data && typeof data === "object" ? data : {}

  // 1. Why We Designed This Journey
  const whyRaw = safe.why || {}
  const why = {
    badge: normalizeStyledField(whyRaw.badge, emptyOverview.why.badge.value, THEME_COLORS.accent),
    title: normalizeStyledField(whyRaw.title, emptyOverview.why.title.value, THEME_COLORS.titleLight),
    description: normalizeStyledField(whyRaw.description, emptyOverview.why.description.value, THEME_COLORS.navText),
    signature: normalizeStyledField(whyRaw.signature, emptyOverview.why.signature.value, THEME_COLORS.accent),
  }

  // 2. Journey Overview
  const ovRaw = safe.overview || (safe.title || safe.description ? safe : {})
  const overview = {
    title: normalizeStyledField(ovRaw.title ?? safe.title, emptyOverview.overview.title.value, THEME_COLORS.titleLight),
    description: normalizeStyledField(
      ovRaw.description ?? safe.description ?? safe.overviewText,
      emptyOverview.overview.description.value,
      THEME_COLORS.navText
    ),
  }

  // 3. Highlights
  const hlRaw = safe.heighlights || safe.highlights || {}
  const rawHlItems = Array.isArray(hlRaw.items)
    ? hlRaw.items
    : Array.isArray(safe.highlights)
    ? safe.highlights
    : emptyOverview.heighlights.items

  const heighlights = {
    title: normalizeStyledField(hlRaw.title, emptyOverview.heighlights.title.value, THEME_COLORS.titleLight),
    items: rawHlItems.map((it: any) => {
      if (typeof it === "string") {
        return { title: normalizeStyledField({ value: it }, it, THEME_COLORS.navText) }
      }
      return {
        title: normalizeStyledField(it?.title ?? it, typeof it === "string" ? it : "", THEME_COLORS.navText),
      }
    }),
  }

  // 4. Visual Reference / Visual Story
  const vsRaw = safe.visualStory || safe.visualReference || {}
  const rawVsItems = Array.isArray(vsRaw.items) ? vsRaw.items : emptyOverview.visualStory.items

  const visualStory = {
    eyebrow: normalizeStyledField(vsRaw.eyebrow, emptyOverview.visualStory.eyebrow.value, THEME_COLORS.accent),
    title: normalizeStyledField(vsRaw.title, emptyOverview.visualStory.title.value, THEME_COLORS.dark),
    description: normalizeStyledField(vsRaw.description, emptyOverview.visualStory.description.value, THEME_COLORS.muted),
    items: rawVsItems.map((item: any) => normalizeMultimedia(item)),
  }

  // 5. Is This Journey For You? (forYou)
  const fyRaw = safe.forYou || safe.convince || {}
  const rawFyItems = Array.isArray(fyRaw.items) ? fyRaw.items : emptyOverview.forYou.items

  const forYou = {
    eyebrow: normalizeStyledField(fyRaw.eyebrow, emptyOverview.forYou.eyebrow.value, THEME_COLORS.titleLight),
    title: normalizeStyledField(fyRaw.title, emptyOverview.forYou.title.value, THEME_COLORS.titleLight),
    items: rawFyItems.map((it: any) => {
      if (typeof it === "string") {
        return { title: normalizeStyledField({ value: it }, it, THEME_COLORS.navText) }
      }
      return {
        title: normalizeStyledField(it?.title ?? it, typeof it === "string" ? it : "", THEME_COLORS.navText),
      }
    }),
  }

  return {
    why,
    overview,
    heighlights,
    visualStory,
    forYou,
  }
}
