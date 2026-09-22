import { normalizeMultimedia } from "@/components/pages/Journey/shared/normalizeHelpers"
import { emptyAddOns } from "./emptyAddOns"

export function normalizeAddOns(addOns: any) {
  const safe = addOns && typeof addOns === "object" ? addOns : {}

  const normalizedItems = Array.isArray(safe.itemsList) && safe.itemsList.length > 0
    ? safe.itemsList.map((item: any, idx: number) => ({
        id: item.id || `addon-${idx + 1}`,
        title: item.title || "Add-on Title",
        category: item.category || "EXCURSION",
        duration: item.duration || "1 Hour",
        price: Number(item.price || 100),
        currency: item.currency || "EUR",
        description: item.description || "",
        image: item.image || "",
        features: Array.isArray(item.features) ? item.features : [],
      }))
    : emptyAddOns.itemsList

  return {
    ...safe,
    badge: safe.badge ?? emptyAddOns.badge,
    title: safe.title ?? emptyAddOns.title,
    description: safe.description ?? emptyAddOns.description,
    itemsList: normalizedItems,
    backgroundMultimedia: normalizeMultimedia(
      safe.backgroundMultimedia ?? safe.multimedia ?? emptyAddOns.backgroundMultimedia
    ),
  }
}
