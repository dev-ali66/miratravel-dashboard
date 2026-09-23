import { normalizeMultimedia, normalizeStyledField, normalizeButton } from "@/components/pages/Journey/shared/normalizeHelpers"
import { emptyAddOns } from "./emptyAddOns"

export function normalizeAddOns(addOns: any) {
  const safe = addOns && typeof addOns === "object" ? addOns : {}

  const rawItems = Array.isArray(safe.items) && safe.items.length > 0
    ? safe.items
    : Array.isArray(safe.itemsList) && safe.itemsList.length > 0
    ? safe.itemsList
    : emptyAddOns.items

  const normalizedItems = rawItems.map((item: any, index: number) => ({
    title: normalizeStyledField(item.title, "Upgrade Experience", "#080c1d"),
    price: normalizeStyledField(item.price ?? item.priceText, "3,495", "#af6348"),
    currency: normalizeStyledField(item.currency, "$", "#af6348"),
    day: normalizeStyledField(item.day ?? item.dayLabel, `Day ${index + 1}`, "#af6348"),
    heading: normalizeStyledField(item.heading ?? item.detailedHeading, "", "#080c1d"),
    description: normalizeStyledField(item.description, "", "#565e69"),
    multimedia: normalizeMultimedia(item.multimedia ?? item.imageMultimedia ?? item.image ?? item.thumbnail),
    button: normalizeButton(item.button ?? { label: "Add this item", href: "#" }),
  }))

  return {
    ...safe,
    eyebrow: normalizeStyledField(safe.eyebrow ?? emptyAddOns.eyebrow, "OPTIONAL EXPERIENCES", "#af6348"),
    title: normalizeStyledField(safe.title ?? emptyAddOns.title, "Add some fun in your trip", "#182d09"),
    description: normalizeStyledField(safe.description ?? safe.subtitle ?? emptyAddOns.description, "", "#565e69"),
    items: normalizedItems,
  }
}
