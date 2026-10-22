export function normalizePlaceExperiences(experiences: any): string[] {
  let rawItems: any[] = []

  if (Array.isArray(experiences)) {
    rawItems = experiences
  } else if (experiences && typeof experiences === "object") {
    if (Array.isArray(experiences.items)) {
      rawItems = experiences.items
    } else if (Array.isArray(experiences.cards)) {
      rawItems = experiences.cards
    } else if (experiences.featured_experience) {
      rawItems = [experiences.featured_experience]
    }
  }

  const items: string[] = rawItems
    .map((it: any) => (typeof it === "string" ? it : it?.id || it?.experienceId))
    .filter((id): id is string => Boolean(id) && typeof id === "string")

  return items
}

