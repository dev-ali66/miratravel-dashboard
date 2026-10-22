export type ExperienceFieldName =
  | "countryExperiences"
  | "regionExperienceList"
  | "placeExperiences"

/**
 * Returns the canonical experience relation field name based on location type:
 * - COUNTRY => "countryExperiences"
 * - REGION  => "regionExperienceList"
 * - PLACE   => "placeExperiences" (default for PLACE, LANDMARK, etc.)
 */
export function getExperienceFieldName(type?: string): ExperienceFieldName {
  const normalized = (type || "").toUpperCase()
  if (normalized === "COUNTRY") return "countryExperiences"
  if (normalized === "REGION") return "regionExperienceList"
  return "placeExperiences"
}
