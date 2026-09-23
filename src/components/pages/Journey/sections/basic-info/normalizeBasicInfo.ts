import { emptyBasicInfo } from "./emptyBasicInfo"

export function slugify(text: string): string {
  return (text || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function normalizeBasicInfo(draft: any) {
  const safe = draft && typeof draft === "object" ? draft : {}
  const title = safe.title ?? emptyBasicInfo.title
  const slug = safe.slug ? safe.slug : slugify(title)
  return {
    title,
    slug,
    subtitle: safe.subtitle ?? emptyBasicInfo.subtitle,
    price: Number(safe.price ?? emptyBasicInfo.price),
    currency: safe.currency ?? emptyBasicInfo.currency,
    minDays: Number(safe.minDays ?? emptyBasicInfo.minDays),
    maxDays: Number(safe.maxDays ?? emptyBasicInfo.maxDays),
    pace: safe.pace ?? emptyBasicInfo.pace,
    comfortLevel: safe.comfortLevel ?? emptyBasicInfo.comfortLevel,
    status: safe.status ?? emptyBasicInfo.status,
    featured: Boolean(safe.featured ?? emptyBasicInfo.featured),
    journeyType: Array.isArray(safe.journeyType) && safe.journeyType.length > 0 ? safe.journeyType : emptyBasicInfo.journeyType,
    travelStyle: Array.isArray(safe.travelStyle) && safe.travelStyle.length > 0 ? safe.travelStyle : emptyBasicInfo.travelStyle,
    perfectFor: Array.isArray(safe.perfectFor) && safe.perfectFor.length > 0 ? safe.perfectFor : emptyBasicInfo.perfectFor,
  }
}
