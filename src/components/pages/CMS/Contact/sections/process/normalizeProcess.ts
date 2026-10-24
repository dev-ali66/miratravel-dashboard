import { THEME_COLORS } from "@/config/theme"
import { emptyProcess } from "./emptyProcess"
import {
  normalizeStyledField,
  normalizeMultimedia,
} from "@/components/pages/Location/shared/normalizeHelpers"

export function normalizeProcess(input: any) {
  const raw = input || {}
  const rawItems = Array.isArray(raw.items)
    ? raw.items
    : Array.isArray(raw.steps)
      ? raw.steps
      : emptyProcess.items

  const res = {
    ...emptyProcess,
    ...raw,
    title: normalizeStyledField(
      raw.title,
      emptyProcess.title.value,
      THEME_COLORS.primary
    ),
    items: rawItems.map((item: any) => ({
      title: normalizeStyledField(item?.title, "", THEME_COLORS.primary),
      description: normalizeStyledField(item?.description, "", THEME_COLORS.placeholder),
    })),
    backgroundMultimedia: normalizeMultimedia(
      raw.backgroundMultimedia ?? raw.multimedia,
      emptyProcess.backgroundMultimedia?.show || "color"
    ),
  }

  delete (res as any).key
  delete (res as any).type
  delete (res as any).steps
  delete (res as any).multimedia

  return res
}

export default normalizeProcess

