export function normalizeAddOns(addOns: any): string[] {
  if (!addOns) return []

  if (Array.isArray(addOns)) {
    return addOns
      .map((item: any) => (typeof item === "string" ? item : item?.id || item?.experienceId))
      .filter((id: any): id is string => typeof id === "string" && Boolean(id.trim()))
  }

  if (typeof addOns === "object") {
    const rawItems = Array.isArray(addOns.items)
      ? addOns.items
      : Array.isArray(addOns.itemsList)
      ? addOns.itemsList
      : Array.isArray(addOns.experiences)
      ? addOns.experiences
      : []

    return rawItems
      .map((item: any) => (typeof item === "string" ? item : item?.id || item?.experienceId))
      .filter((id: any): id is string => typeof id === "string" && Boolean(id.trim()))
  }

  return []
}

