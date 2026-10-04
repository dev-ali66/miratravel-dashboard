import { useMemo } from "react"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { FormSection } from "../../shared/fields"
import type { StoryFormSectionProps } from "../../config/storySections"
import type { StoryType } from "../../config/storyTypes"
import { StoryCategoriesField } from "./StoryCategoriesField"

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
}

export function BasicInfoForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: StoryFormSectionProps) {
  const isOpen = Boolean(openSections["basic-info"] || openSections["basicInfo"])

  const storyTypeOptions = useMemo(
    () => [
      { label: "Short Story", value: "short_story" },
      { label: "Long Story", value: "long_story" },
      { label: "Guidance", value: "guidance" },
    ],
    []
  )

  const statusOptions = useMemo(
    () => [
      { label: "Draft", value: "DRAFT" },
      { label: "Published", value: "PUBLISHED" },
    ],
    []
  )

  const handleTitleChange = (val: string) => {
    updateField("title", val)
    updateField("slug", slugify(val))
  }

  return (
    <FormSection
      title="Basic Information"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("basic-info")}
    >
      <div className="flex flex-col gap-4">
        {/* Story Title */}
        <DynamicStyledField
          type="text"
          label="Story Title"
          fieldName="title"
          placeholder="e.g. Exploring the Northern Peaks"
          required={true}
          enableStyle={false}
          value={draft.title || ""}
          onChange={handleTitleChange}
        />

        {/* URL Slug (Disabled / Edit Blocked) */}
        <DynamicStyledField
          type="text"
          label="URL Slug (Auto-generated)"
          fieldName="slug"
          placeholder="e.g. exploring-the-northern-peaks"
          disabled={true}
          enableStyle={false}
          value={draft.slug || (draft.title ? slugify(draft.title) : "")}
          onChange={() => {}}
        />

        {/* Story Type */}
        <DynamicStyledField
          type="select"
          label="Story Type"
          fieldName="type"
          required={true}
          enableStyle={false}
          value={draft.type || "short_story"}
          options={storyTypeOptions}
          onChange={(val) => updateField("type", val as StoryType)}
        />

        {/* Publish Status */}
        <DynamicStyledField
          type="select"
          label="Publish Status"
          fieldName="status"
          required={true}
          enableStyle={false}
          value={draft.status || "DRAFT"}
          options={statusOptions}
          onChange={(val) => updateField("status", val)}
        />

        {/* Author Name */}
        <DynamicStyledField
          type="text"
          label="Author Name"
          fieldName="authorName"
          placeholder="e.g. Elena Rostova"
          enableStyle={false}
          value={draft.authorName || ""}
          onChange={(val) => updateField("authorName", val)}
        />

        {/* Author Role */}
        <DynamicStyledField
          type="text"
          label="Author Role"
          fieldName="authorRole"
          placeholder="e.g. Travel Writer & Explorer"
          enableStyle={false}
          value={draft.authorRole || ""}
          onChange={(val) => updateField("authorRole", val)}
        />

        {/* Read Time */}
        <DynamicStyledField
          type="text"
          label="Read Time"
          fieldName="readTime"
          placeholder="e.g. 5 min read"
          enableStyle={false}
          value={draft.readTime || ""}
          onChange={(val) => updateField("readTime", val)}
        />

        {/* Story Categories Management (Search, Create, Select, Delete) */}
        <StoryCategoriesField
          value={draft.categories || []}
          onChange={(cats) => updateField("categories", cats)}
        />

        {/* Featured Story Checkbox */}
        <div className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5 mt-1">
          <input
            type="checkbox"
            id="featured-story-checkbox"
            checked={Boolean(draft.featured)}
            onChange={(e) => updateField("featured", e.target.checked)}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
          />
          <label
            htmlFor="featured-story-checkbox"
            className="text-xs font-semibold text-foreground cursor-pointer select-none"
          >
            Featured Story
            <span className="block text-[11px] font-normal text-muted-foreground">
              Mark this story as featured across story cards and home showcases.
            </span>
          </label>
        </div>

        {/* Recommended Story Checkbox */}
        <div className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5 mt-1">
          <input
            type="checkbox"
            id="recommended-story-checkbox"
            checked={Boolean(draft.recommended)}
            onChange={(e) => updateField("recommended", e.target.checked)}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
          />
          <label
            htmlFor="recommended-story-checkbox"
            className="text-xs font-semibold text-foreground cursor-pointer select-none"
          >
            Recommended Story
            <span className="block text-[11px] font-normal text-muted-foreground">
              Mark this story as recommended for curated reading lists.
            </span>
          </label>
        </div>
      </div>
    </FormSection>
  )
}

export default BasicInfoForm
