import { normalizeMultimedia, normalizeStyledField } from "../../shared/normalizeHelpers"
import { emptyExperiences } from "./emptyExperiences"

export function normalizePlaceExperiences(experiences: any) {
  const safeExp = experiences && typeof experiences === "object" ? experiences : {}

  const featuredExperience = safeExp.featured_experience ?? emptyExperiences.featured_experience ?? {}
  const normalizedExperiences = {
    ...safeExp,
    title: normalizeStyledField(safeExp.title ?? emptyExperiences.title, "", "#182d09"),
    location: safeExp.location ?? emptyExperiences.location ?? "",
    description: normalizeStyledField(safeExp.description ?? emptyExperiences.description, "", "#565e69"),
    seasonInfo: safeExp.seasonInfo ?? emptyExperiences.seasonInfo ?? "",
    seasonLocation: safeExp.seasonLocation ?? emptyExperiences.seasonLocation ?? "",
    load_more_button: safeExp.load_more_button ?? emptyExperiences.load_more_button ?? "Load More",
    featured_experience: {
      image: featuredExperience.image ?? "",
      title: normalizeStyledField(featuredExperience.title, "", "#182d09"),
      category: featuredExperience.category ?? "",
      duration: featuredExperience.duration ?? "",
      subtitle: normalizeStyledField(featuredExperience.subtitle, "", "#565e69"),
      action_text: featuredExperience.action_text ?? "More info",
      button: featuredExperience.button ?? null,
      buttons: Array.isArray(featuredExperience.buttons)
        ? featuredExperience.buttons
        : [],
      imageMultimedia: normalizeMultimedia(
        featuredExperience.imageMultimedia || emptyExperiences.featured_experience?.imageMultimedia
      ),
    },
    cards: Array.isArray(safeExp.cards)
      ? safeExp.cards.map((c: any) => ({
          id: c.id ?? Date.now(),
          image: c.image ?? "",
          price: c.price ?? "",
          title: normalizeStyledField(c.title, "", "#182d09"),
          category: c.category ?? "",
          subtitle: normalizeStyledField(c.subtitle, "", "#565e69"),
          action_text: c.action_text ?? "More info",
          description: normalizeStyledField(c.description, "", "#565e69"),
          button: c.button ?? null,
          buttons: Array.isArray(c.buttons) ? c.buttons : [],
          imageMultimedia: normalizeMultimedia(c.imageMultimedia),
        }))
      : (emptyExperiences.cards ?? []),
    footer: {
      note: safeExp.footer?.note ?? "",
      region: safeExp.footer?.region ?? "",
    },
    backgroundMultimedia: normalizeMultimedia(
      safeExp.backgroundMultimedia || emptyExperiences.backgroundMultimedia,
      "color"
    ),
  }

  delete (normalizedExperiences as any).loadMoreButtonStyle
  delete (normalizedExperiences as any).titleStyle
  delete (normalizedExperiences as any).locationStyle
  delete (normalizedExperiences as any).descriptionStyle
  delete (normalizedExperiences as any).style

  return normalizedExperiences
}

