import { useState } from "react"
import { FormSection, DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { Plus, Trash2, ArrowUp, ArrowDown, Share2, ChevronDown, ChevronRight } from "lucide-react"

export type PeopleFormProps = {
  section: any
  index: number
  updateSection: (index: number, patch: Record<string, any>) => void
  openSections: Record<string, boolean>
  toggleSection: (key: string) => void
  sectionNumber: number | string
}

export function PeopleForm({
  section,
  index,
  updateSection,
  openSections,
  toggleSection,
  sectionNumber,
}: PeopleFormProps) {
  const isOpen = Boolean(openSections["people"])
  const peopleData = section || {}
  const membersList = Array.isArray(peopleData.members)
    ? peopleData.members
    : Array.isArray(peopleData.people)
    ? peopleData.people
    : Array.isArray(peopleData.items)
    ? peopleData.items
    : []

  const [openMembers, setOpenMembers] = useState<Record<number, boolean>>({ 0: true })

  const toggleMember = (mIdx: number) => {
    setOpenMembers((prev) => ({ ...prev, [mIdx]: !prev[mIdx] }))
  }

  const updateMembersList = (updated: any[]) => {
    updateSection(index, { members: updated })
  }

  const updatePerson = (pIdx: number, patch: Record<string, any>) => {
    const updated = [...membersList]
    updated[pIdx] = { ...updated[pIdx], ...patch }
    updateMembersList(updated)
  }

  const addPerson = () => {
    const newPerson = {
      name: {
        value: "New Team Member",
        textColor: "#182D09",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      designation: {
        value: "Travel Curator",
        textColor: "#B86B3A",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      multimedia: {
        show: "image",
        color: { color: "#E5E7EB", opacity: 100 },
        image: { url: "", alt: "Team member", opacity: 100, fit: "cover" },
      },
      social: [
        { icon: "linkedin", label: "LinkedIn", url: "" },
      ],
    }
    const newIndex = membersList.length
    setOpenMembers((prev) => ({ ...prev, [newIndex]: true }))
    updateMembersList([...membersList, newPerson])
  }

  const removePerson = (pIdx: number) => {
    const updated = membersList.filter((_: any, i: number) => i !== pIdx)
    updateMembersList(updated)
  }

  const movePerson = (pIdx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? pIdx - 1 : pIdx + 1
    if (targetIdx < 0 || targetIdx >= membersList.length) return
    const updated = [...membersList]
    const temp = updated[pIdx]
    updated[pIdx] = updated[targetIdx]
    updated[targetIdx] = temp

    // Also swap accordion open states
    setOpenMembers((prev) => ({
      ...prev,
      [pIdx]: prev[targetIdx],
      [targetIdx]: prev[pIdx],
    }))

    updateMembersList(updated)
  }

  // Social link helpers inside a person
  const addSocial = (pIdx: number) => {
    const currentPerson = membersList[pIdx] || {}
    const socialList = Array.isArray(currentPerson.social) ? currentPerson.social : []
    const updatedSocial = [...socialList, { icon: "linkedin", label: "LinkedIn", url: "" }]
    updatePerson(pIdx, { social: updatedSocial })
  }

  const updateSocial = (pIdx: number, sIdx: number, patch: Record<string, any>) => {
    const currentPerson = membersList[pIdx] || {}
    const socialList = [...(Array.isArray(currentPerson.social) ? currentPerson.social : [])]
    socialList[sIdx] = { ...socialList[sIdx], ...patch }
    updatePerson(pIdx, { social: socialList })
  }

  const removeSocial = (pIdx: number, sIdx: number) => {
    const currentPerson = membersList[pIdx] || {}
    const socialList = (Array.isArray(currentPerson.social) ? currentPerson.social : []).filter(
      (_: any, i: number) => i !== sIdx
    )
    updatePerson(pIdx, { social: socialList })
  }

  return (
    <FormSection
      title="People / Team Section"
      sectionNumber={String(sectionNumber)}
      active={isOpen}
      onClick={() => toggleSection("people")}
    >
      <div className="space-y-4">
        <DynamicStyledField
          label="Eyebrow / Category"
          value={peopleData.eyebrow}
          onChange={(val: any) => updateSection(index, { eyebrow: val })}
        />

        <DynamicStyledField
          label="Title / Headline"
          type="textarea"
          value={peopleData.title}
          onChange={(val: any) => updateSection(index, { title: val })}
        />

        <DynamicStyledField
          label="Description Text"
          type="textarea"
          value={peopleData.description}
          onChange={(val: any) => updateSection(index, { description: val })}
        />

        {/* Team Members Collapsible List */}
        <div className="pt-2 border-t border-border/40 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Team Members ({membersList.length})
            </h4>
            <button
              type="button"
              onClick={addPerson}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <Plus className="w-3.5 h-3.5" /> Add Member
            </button>
          </div>

          {membersList.map((person: any, pIdx: number) => {
            const socialList = Array.isArray(person?.social) ? person.social : []
            const isMemberOpen = Boolean(openMembers[pIdx])
            const personName =
              typeof person.name === "object" ? person.name?.value : person.name || ""
            const personRole =
              typeof person.designation === "object"
                ? person.designation?.value
                : person.designation || person.role || ""

            return (
              <div key={pIdx} className="rounded-lg border border-border/60 overflow-hidden bg-background">
                {/* Collapsible Accordion Header */}
                <div
                  className="flex items-center justify-between p-3 bg-muted/40 cursor-pointer select-none hover:bg-muted/60 transition-colors"
                  onClick={() => toggleMember(pIdx)}
                >
                  <div className="flex items-center gap-2 overflow-hidden mr-2">
                    {isMemberOpen ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                    <span className="text-xs font-semibold text-foreground truncate">
                      Member #{pIdx + 1}
                      {personName ? ` — ${personName}` : ""}
                      {personRole ? ` (${personRole})` : ""}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      disabled={pIdx === 0}
                      onClick={() => movePerson(pIdx, "up")}
                      className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={pIdx === membersList.length - 1}
                      onClick={() => movePerson(pIdx, "down")}
                      className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removePerson(pIdx)}
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors ml-1"
                      title="Remove Member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Collapsible Accordion Content */}
                {isMemberOpen && (
                  <div className="p-4 border-t border-border/40 bg-muted/10 space-y-4">
                    <DynamicStyledField
                      label="Name"
                      value={person.name}
                      onChange={(val: any) => updatePerson(pIdx, { name: val })}
                    />

                    <DynamicStyledField
                      label="Designation / Role"
                      value={person.designation || person.role}
                      onChange={(val: any) => updatePerson(pIdx, { designation: val, role: val })}
                    />

                    <UniversalMultimediaForm
                      title="Member Portrait / Photo"
                      value={person.multimedia}
                      onChange={(val: any) => updatePerson(pIdx, { multimedia: val })}
                    />

                    {/* Social Links Sub-Repeater */}
                    <div className="pt-2 border-t border-border/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold text-muted-foreground uppercase flex items-center gap-1">
                          <Share2 className="w-3 h-3" /> Social Links ({socialList.length})
                        </label>
                        <button
                          type="button"
                          onClick={() => addSocial(pIdx)}
                          className="text-[11px] font-medium text-primary hover:underline"
                        >
                          + Add Link
                        </button>
                      </div>

                      {socialList.map((soc: any, sIdx: number) => (
                        <div
                          key={sIdx}
                          className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2 rounded bg-background border border-border/40 items-center"
                        >
                          <select
                            className="px-2 py-1.5 text-xs border border-border rounded bg-background text-foreground"
                            value={soc.icon || "linkedin"}
                            onChange={(e) => {
                              const val = e.target.value
                              const foundOption = [
                                { value: "linkedin", label: "LinkedIn" },
                                { value: "instagram", label: "Instagram" },
                                { value: "twitter", label: "Twitter / X" },
                                { value: "facebook", label: "Facebook" },
                                { value: "youtube", label: "YouTube" },
                                { value: "tiktok", label: "TikTok" },
                                { value: "snapchat", label: "Snapchat" },
                                { value: "github", label: "GitHub" },
                                { value: "website", label: "Website / Globe" },
                                { value: "custom", label: "Other / Custom" },
                              ].find((o) => o.value === val)

                              const patch: Record<string, any> = { icon: val }
                              if (
                                foundOption &&
                                (!soc.label ||
                                  soc.label === "Social" ||
                                  ["LinkedIn", "Instagram", "Twitter / X", "Facebook", "YouTube", "TikTok", "Snapchat", "GitHub", "Website / Globe", "Other / Custom"].includes(soc.label))
                              ) {
                                patch.label = foundOption.label
                              }
                              updateSocial(pIdx, sIdx, patch)
                            }}
                          >
                            <option value="linkedin">LinkedIn</option>
                            <option value="instagram">Instagram</option>
                            <option value="twitter">Twitter / X</option>
                            <option value="facebook">Facebook</option>
                            <option value="youtube">YouTube</option>
                            <option value="tiktok">TikTok</option>
                            <option value="snapchat">Snapchat</option>
                            <option value="github">GitHub</option>
                            <option value="website">Website / Globe</option>
                            <option value="custom">Other / Custom</option>
                          </select>

                          <input
                            type="text"
                            placeholder="Label (e.g. LinkedIn)"
                            className="px-2 py-1.5 text-xs border border-border rounded bg-muted/20"
                            value={soc.label || ""}
                            onChange={(e) => updateSocial(pIdx, sIdx, { label: e.target.value })}
                          />
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              placeholder="URL (https://...)"
                              className="w-full px-2 py-1.5 text-xs border border-border rounded bg-muted/20"
                              value={soc.url || ""}
                              onChange={(e) => updateSocial(pIdx, sIdx, { url: e.target.value })}
                            />
                            <button
                              type="button"
                              onClick={() => removeSocial(pIdx, sIdx)}
                              className="p-1 text-muted-foreground hover:text-destructive shrink-0"
                              title="Delete link"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="pt-2 border-t border-border/40">
          <UniversalMultimediaForm
            title="Section Background"
            value={peopleData.backgroundMultimedia}
            onChange={(val: any) => updateSection(index, { backgroundMultimedia: val })}
          />
        </div>
      </div>
    </FormSection>
  )
}

export default PeopleForm


