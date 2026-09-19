import { emptyPhilosophy } from "./emptyPhilosophy"
import {
  normalizeStyledField,
  normalizeMultimedia,
} from "@/components/pages/Location/shared/normalizeHelpers"

export function normalizePhilosophy(input: any) {
  const raw = input || {}

  let multimediasArray: any[] = []
  if (Array.isArray(raw.multimedias)) {
    multimediasArray = raw.multimedias.map((m: any) => normalizeMultimedia(m, "image"))
  } else {
    const m1 = raw.multimedia1 ? normalizeMultimedia(raw.multimedia1, "image") : null
    const m2 = raw.multimedia2 ? normalizeMultimedia(raw.multimedia2, "image") : null
    const m3 = raw.multimedia3 ? normalizeMultimedia(raw.multimedia3, "image") : null
    const legacy = [m1, m2, m3].filter(Boolean)
    if (legacy.length > 0) {
      multimediasArray = legacy
    } else {
      multimediasArray = emptyPhilosophy.multimedias.map((m: any) => normalizeMultimedia(m, "image"))
    }
  }

  const res = {
    ...emptyPhilosophy,
    ...raw,
    eyebrow: normalizeStyledField(raw.eyebrow, emptyPhilosophy.eyebrow.value, "#B86B3A"),
    title: normalizeStyledField(raw.title, emptyPhilosophy.title.value, "#182D09"),
    description: normalizeStyledField(raw.description, emptyPhilosophy.description.value, "#4B5563"),
    quote: normalizeStyledField(raw.quote, emptyPhilosophy.quote.value, "#B86B3A"),
    multimedias: multimediasArray,
    backgroundMultimedia: normalizeMultimedia(
      raw.backgroundMultimedia,
      emptyPhilosophy.backgroundMultimedia.show
    ),
  }

  delete (res as any).multimedia1
  delete (res as any).multimedia2
  delete (res as any).multimedia3
  delete (res as any).key
  delete (res as any).type
  return res
}

export default normalizePhilosophy
