import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls";
import { FormSection } from "../../shared/fields";
import type { StoryFormSectionProps } from "../../config/storySections";
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm";
import { useMemo } from "react";

export function BasicInfoForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: StoryFormSectionProps) {
  const isOpen = Boolean(openSections["basicInfo"]);

  const typeOptions = useMemo(
    () => [
      { label: "Short Story", value: "short_story" },
      { label: "Long Story", value: "long_story" },
      { label: "Guidance", value: "guidance" },
    ],
    []
  );

  const statusOptions = useMemo(
    () => [
      { label: "Draft", value: "DRAFT" },
      { label: "Published", value: "PUBLISHED" },
    ],
    []
  );

  return (
    <FormSection
      title="Basic Information"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("basicInfo")}
    >
      <div className="flex flex-col gap-6 p-4">
        <DynamicStyledField
          type="text"
          label="Title"
          fieldName="title"
          placeholder="Story title..."
          required={true}
          enableStyle={false}
          value={draft.title || ""}
          onChange={(val) => updateField("title", val)}
        />
        
        <DynamicStyledField
          type="text"
          label="Slug"
          fieldName="slug"
          placeholder="url-slug"
          required={true}
          enableStyle={false}
          value={draft.slug || ""}
          onChange={(val) => updateField("slug", val)}
        />

        <DynamicStyledField
          type="select"
          label="Story Type"
          fieldName="type"
          value={draft.type || "short_story"}
          onChange={(val) => updateField("type", val)}
          options={typeOptions}
        />

        <DynamicStyledField
          type="select"
          label="Status"
          fieldName="status"
          value={draft.status || "DRAFT"}
          onChange={(val) => updateField("status", val)}
          options={statusOptions}
        />

        <DynamicStyledField
          type="text"
          label="Author Name"
          fieldName="authorName"
          placeholder="e.g. John Doe"
          enableStyle={false}
          value={draft.authorName || ""}
          onChange={(val) => updateField("authorName", val)}
        />
        
        <DynamicStyledField
          type="text"
          label="Author Role"
          fieldName="authorRole"
          placeholder="e.g. Travel Writer"
          enableStyle={false}
          value={draft.authorRole || ""}
          onChange={(val) => updateField("authorRole", val)}
        />

        <DynamicStyledField
          type="text"
          label="Read Time"
          fieldName="readTime"
          placeholder="e.g. 5 min read (Auto calculated if empty)"
          enableStyle={false}
          value={draft.readTime || ""}
          onChange={(val) => updateField("readTime", val)}
        />

        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="text-sm font-medium text-foreground">Author Avatar</h3>
          <UniversalMultimediaForm
            value={draft.authorAvatar || { show: "image" }}
            onChange={(val) => updateField("authorAvatar", val)}
          />
        </div>
      </div>
    </FormSection>
  );
}
