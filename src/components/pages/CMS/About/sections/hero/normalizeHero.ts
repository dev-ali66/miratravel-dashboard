import { emptyHero } from "./emptyHero"
import {
  normalizeStyledField,
  normalizeMultimedia,
  normalizeButtonsArray,
} from "@/components/pages/Location/shared/normalizeHelpers"

export function normalizeHero(input: any) {
  const raw = input || {}
  const res = {
    ...emptyHero,
    ...raw,
    breadcrumb: normalizeStyledField(raw.breadcrumb, emptyHero.breadcrumb.value, "#E5E7EB"),
    title: normalizeStyledField(raw.title, emptyHero.title.value, "#ffffff"),
    subtitle: normalizeStyledField(raw.subtitle, emptyHero.subtitle.value, "#E5E7EB"),
    description: normalizeStyledField(raw.description, emptyHero.description.value, "#E5E7EB"),
    isCenter: raw.isCenter !== undefined ? Boolean(raw.isCenter) : emptyHero.isCenter,
    buttons: normalizeButtonsArray(raw.buttons ?? emptyHero.buttons),
    backgroundMultimedia: normalizeMultimedia(
      raw.backgroundMultimedia ?? raw.multimedia,
      emptyHero.backgroundMultimedia.show
    ),
  }

  delete (res as any).key
  delete (res as any).type
  return res
}

export default normalizeHero
