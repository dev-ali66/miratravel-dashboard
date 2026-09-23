import { normalizeStyledField, normalizeMultimedia } from "@/components/pages/Journey/shared/normalizeHelpers"
import { emptyOverview } from "./emptyOverview"

export function normalizeOverview(data?: any) {
  const safe = data && typeof data === "object" ? data : {}

  // 1. Why We Designed This Journey
  const whyRaw = safe.why || {}
  const why = {
    badge: normalizeStyledField(whyRaw.badge, emptyOverview.why.badge.value, "#af6348"),
    title: normalizeStyledField(whyRaw.title, emptyOverview.why.title.value, "#313131"),
    description: normalizeStyledField(whyRaw.description, emptyOverview.why.description.value, "#464136"),
    signature: normalizeStyledField(whyRaw.signature, emptyOverview.why.signature.value, "#af6348"),
  }

  // 2. Journey Overview
  const ovRaw = safe.overview || (safe.title || safe.description ? safe : {})
  const overview = {
    title: normalizeStyledField(ovRaw.title ?? safe.title, emptyOverview.overview.title.value, "#313131"),
    description: normalizeStyledField(
      ovRaw.description ?? safe.description ?? safe.overviewText,
      emptyOverview.overview.description.value,
      "#464136"
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
    title: normalizeStyledField(hlRaw.title, emptyOverview.heighlights.title.value, "#313131"),
    items: rawHlItems.map((it: any) => {
      if (typeof it === "string") {
        return { title: normalizeStyledField({ value: it }, it, "#464136") }
      }
      return {
        title: normalizeStyledField(it?.title ?? it, typeof it === "string" ? it : "", "#464136"),
      }
    }),
  }

  // 4. Visual Reference / Visual Story
  const vsRaw = safe.visualStory || safe.visualReference || {}
  const rawVsItems = Array.isArray(vsRaw.items) ? vsRaw.items : emptyOverview.visualStory.items

  const visualStory = {
    eyebrow: normalizeStyledField(vsRaw.eyebrow, emptyOverview.visualStory.eyebrow.value, "#af6348"),
    title: normalizeStyledField(vsRaw.title, emptyOverview.visualStory.title.value, "#080c1d"),
    description: normalizeStyledField(vsRaw.description, emptyOverview.visualStory.description.value, "#565e69"),
    items: rawVsItems.map((item: any) => normalizeMultimedia(item)),
  }

  // 5. Is This Journey For You? (forYou)
  const fyRaw = safe.forYou || safe.convince || {}
  const rawFyItems = Array.isArray(fyRaw.items) ? fyRaw.items : emptyOverview.forYou.items

  const forYou = {
    eyebrow: normalizeStyledField(fyRaw.eyebrow, emptyOverview.forYou.eyebrow.value, "#313131"),
    title: normalizeStyledField(fyRaw.title, emptyOverview.forYou.title.value, "#313131"),
    items: rawFyItems.map((it: any) => {
      if (typeof it === "string") {
        return { title: normalizeStyledField({ value: it }, it, "#464136") }
      }
      return {
        title: normalizeStyledField(it?.title ?? it, typeof it === "string" ? it : "", "#464136"),
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
