import { emptyPeople } from "./emptyPeople"
import {
  normalizeStyledField,
  normalizeMultimedia,
} from "@/components/pages/Location/shared/normalizeHelpers"

export function normalizePeople(input: any) {
  const raw = input || {}
  const rawItems = Array.isArray(raw.members)
    ? raw.members
    : Array.isArray(raw.people)
    ? raw.people
    : Array.isArray(raw.items)
    ? raw.items
    : emptyPeople.members

  const members = rawItems.map((m: any) => {
    const rawName = typeof m?.name === "string" ? { value: m.name } : m?.name
    const rawDesignation =
      typeof m?.designation === "string"
        ? { value: m.designation }
        : typeof m?.role === "string"
        ? { value: m.role }
        : m?.designation || m?.role

    const social = Array.isArray(m?.social)
      ? m.social.map((s: any) => ({
          icon: String(s?.icon || "link").trim(),
          label: String(s?.label || "").trim(),
          url: String(s?.url || "").trim(),
        }))
      : []

    return {
      name: normalizeStyledField(rawName, "Team Member", "#182D09"),
      designation: normalizeStyledField(rawDesignation, "Specialist", "#B86B3A"),
      multimedia: normalizeMultimedia(m?.multimedia, "image"),
      social,
    }
  })

  const res = {
    ...emptyPeople,
    ...raw,
    eyebrow: normalizeStyledField(raw.eyebrow, emptyPeople.eyebrow.value, "#B86B3A"),
    title: normalizeStyledField(raw.title, emptyPeople.title.value, "#182D09"),
    description: normalizeStyledField(raw.description, emptyPeople.description.value, "#4B5563"),
    members,
    backgroundMultimedia: normalizeMultimedia(
      raw.backgroundMultimedia,
      emptyPeople.backgroundMultimedia.show
    ),
  }

  delete (res as any).people
  delete (res as any).items
  delete (res as any).key
  delete (res as any).type
  return res
}

export default normalizePeople


