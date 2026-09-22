import { normalizeMultimedia, normalizeStyledField } from "../../shared/normalizeHelpers"
import { emptyStats } from "./emptyStats"

export function normalizeStats(statistics: any) {
  const safeStats = statistics && typeof statistics === "object" ? statistics : {}

  const rawFacts = Array.isArray(safeStats.facts) ? safeStats.facts : (Array.isArray(safeStats.items) ? safeStats.items : (emptyStats.items ?? []))
  const normalizedFacts = rawFacts.map((fact: any) => {
    const normFact = {
      label: normalizeStyledField(fact.label, "", "#182d09"),
      value: normalizeStyledField(fact.value, "", "#af6348"),
      description: normalizeStyledField(fact.description, "", "#565e69"),
      image: fact.image ?? "",
      icon: fact.icon ?? "",
      media: normalizeMultimedia(fact.media || fact.multimedia),
    }
    delete (normFact as any).labelStyle
    delete (normFact as any).valueStyle
    delete (normFact as any).descriptionStyle
    delete (normFact as any).style
    return normFact
  })

  const normalizedStatistics = {
    ...safeStats,
    title: normalizeStyledField(safeStats.title ?? emptyStats.title, "", "#182d09"),
    facts: normalizedFacts,
    ...(safeStats.area ? {
      area: {
        unit: safeStats.area.unit ?? "km²",
        value: safeStats.area.value ?? 0,
      },
    } : {}),
    ...(safeStats.elevation ? {
      elevation: {
        unit: safeStats.elevation.unit ?? "m",
        value: safeStats.elevation.value ?? 0,
      },
    } : {}),
    ...(safeStats.population ? {
      population: {
        year: safeStats.population.year ?? 2026,
        value: safeStats.population.value ?? 0,
      },
    } : {}),
    backgroundMultimedia: normalizeMultimedia(
      safeStats.backgroundMultimedia || emptyStats.backgroundMultimedia,
      "color"
    ),
  }

  delete (normalizedStatistics as any).style

  return normalizedStatistics
}

