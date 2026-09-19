import { emptyContactInfo } from "./emptyContactInfo"
import {
  normalizeStyledField,
  normalizeMultimedia,
  normalizeButton,
} from "@/components/pages/Location/shared/normalizeHelpers"

export function normalizeContactInfo(input: any) {
  const raw = input || {}
  const rawItems = Array.isArray(raw.items) ? raw.items : emptyContactInfo.items

  const res = {
    ...emptyContactInfo,
    ...raw,
    items: rawItems.map((item: any, idx: number) => {
      const defaultItem = emptyContactInfo.items[idx] || emptyContactInfo.items[0]
      const labelDefault = typeof defaultItem?.label === "object" ? defaultItem.label.value : defaultItem?.label
      const subtitleDefault = typeof defaultItem?.subtitle === "object" ? defaultItem.subtitle.value : (defaultItem?.subtitle || "")

      const rawBtn = item?.button ?? (Array.isArray(item?.buttons) ? item.buttons[0] : defaultItem?.button)

      const itemRes = {
        label: normalizeStyledField(
          item?.label,
          labelDefault,
          "#6B7280"
        ),
        subtitle: normalizeStyledField(
          item?.subtitle,
          subtitleDefault,
          "#182D09"
        ),
        button: normalizeButton(rawBtn || defaultItem?.button),
        multimedia: normalizeMultimedia(
          item?.multimedia ?? item?.iconMultimedia,
          "image"
        ),
      }

      delete (itemRes as any).id
      delete (itemRes as any).icon
      delete (itemRes as any).href
      delete (itemRes as any).value
      delete (itemRes as any).buttons

      return itemRes
    }),
    backgroundMultimedia: normalizeMultimedia(
      raw.backgroundMultimedia ?? raw.multimedia,
      (emptyContactInfo.backgroundMultimedia?.show as any) || "color"
    ),
  }

  delete (res as any).key
  delete (res as any).type
  delete (res as any).multimedia

  return res
}

export default normalizeContactInfo



