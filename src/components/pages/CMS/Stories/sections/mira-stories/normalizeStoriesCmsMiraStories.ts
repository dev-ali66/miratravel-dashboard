import { THEME_COLORS } from "@/config/theme"
import {
  normalizeStyledField,
  normalizeMultimedia,
  normalizeButtonsArray,
} from "@/components/pages/Location/shared/normalizeHelpers"
import { emptyStoriesCmsMiraStories } from "./emptyStoriesCmsMiraStories"

export function normalizeStoriesCmsMiraStories(rawSection: any): typeof emptyStoriesCmsMiraStories {
  if (!rawSection || typeof rawSection !== "object") return emptyStoriesCmsMiraStories

  const src = rawSection.mira_stories || rawSection.miraStories || rawSection.content || rawSection

  const normalizedItems = Array.isArray(src.items)
    ? src.items.map((item: any) => ({
        title: normalizeStyledField(item.title, "Story Title", THEME_COLORS.primary),
        subtitle: normalizeStyledField(item.subtitle, "Story Subtitle", THEME_COLORS.sub),
        button: item.button || {
          label: "Read Story",
          url: item.url || "",
          variant: "PRIMARY",
          style: "primary",
          rounded: "full",
          backgroundColor: THEME_COLORS.primary,
          backgroundOpacity: 100,
          textColor: THEME_COLORS.white,
          textOpacity: 100,
          hoverBackgroundColor: THEME_COLORS.lightText,
          hoverTextColor: THEME_COLORS.overlayBlack,
          target: "_self",
          showIcon: true,
        },
        url: item.url || item.button?.url || "",
      }))
    : emptyStoriesCmsMiraStories.items

  return {
    eyebrow: normalizeStyledField(src.eyebrow, emptyStoriesCmsMiraStories.eyebrow.value, THEME_COLORS.goldMuted),
    title: normalizeStyledField(src.title, emptyStoriesCmsMiraStories.title.value, THEME_COLORS.primary),
    description: normalizeStyledField(src.description, emptyStoriesCmsMiraStories.description.value, THEME_COLORS.sub),
    items: normalizedItems,
    buttons: normalizeButtonsArray(src.buttons) as any,
    backgroundMultimedia: normalizeMultimedia(
      src.backgroundMultimedia || src.multimedia,
      emptyStoriesCmsMiraStories.backgroundMultimedia
    ),
    leftSideMultimedia: normalizeMultimedia(
      src.leftSideMultimedia || src.leftSideMedia,
      emptyStoriesCmsMiraStories.leftSideMultimedia
    ),
  }
}
