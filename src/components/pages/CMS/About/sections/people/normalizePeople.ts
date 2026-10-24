import { THEME_COLORS } from "@/config/theme"
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
      name: normalizeStyledField(rawName, "Team Member", THEME_COLORS.primary),
      designation: normalizeStyledField(rawDesignation, "Specialist", THEME_COLORS.accentWarm),
      multimedia: normalizeMultimedia(m?.multimedia, "image"),
      social,
    }
  })

  const res = {
    ...emptyPeople,
    ...raw,
    eyebrow: normalizeStyledField(raw.eyebrow, emptyPeople.eyebrow.value, THEME_COLORS.accentWarm),
    title: normalizeStyledField(raw.title, emptyPeople.title.value, THEME_COLORS.primary),
    description: normalizeStyledField(raw.description, emptyPeople.description.value, THEME_COLORS.sub),
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


