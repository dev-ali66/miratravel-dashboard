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
      "#182D09"
    ),
    items: rawItems.map((item: any) => ({
      title: normalizeStyledField(item?.title, "", "#182D09"),
      description: normalizeStyledField(item?.description, "", "#6B7280"),
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

