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
        title: normalizeStyledField(item.title, "Story Title", "#182D09"),
        subtitle: normalizeStyledField(item.subtitle, "Story Subtitle", "#4B5563"),
        button: item.button || {
          label: "Read Story",
          url: item.url || "",
          variant: "PRIMARY",
          style: "primary",
          rounded: "full",
          backgroundColor: "#182D09",
          backgroundOpacity: 100,
          textColor: "#ffffff",
          textOpacity: 100,
          hoverBackgroundColor: "#f3f4f6",
          hoverTextColor: "#000000",
          target: "_self",
          showIcon: true,
        },
        url: item.url || item.button?.url || "",
      }))
    : emptyStoriesCmsMiraStories.items

  return {
    eyebrow: normalizeStyledField(src.eyebrow, emptyStoriesCmsMiraStories.eyebrow.value, "#C5A880"),
    title: normalizeStyledField(src.title, emptyStoriesCmsMiraStories.title.value, "#182D09"),
    description: normalizeStyledField(src.description, emptyStoriesCmsMiraStories.description.value, "#4B5563"),
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
