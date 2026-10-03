import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls";
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm";
import { FormSection } from "../../shared/fields";
import type { StoryFormSectionProps } from "../../config/storySections";

export function HeroForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: StoryFormSectionProps) {
  const hero = draft?.hero || {};
  const isOpen = Boolean(openSections["hero"]);

  const updateHeroField = (fieldKey: string, value: any) => {
    updateField(`hero.${fieldKey}`, value);
  };

  return (
    <FormSection
      title="Hero Banner"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("hero")}
    >
      <div className="flex flex-col gap-8 p-4">
        {/* Background Multimedia */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground border-b border-border pb-2">
            Background Media
          </h3>
          <UniversalMultimediaForm
            value={hero.backgroundMultimedia || { show: "video" }}
            onChange={(val) => updateHeroField("backgroundMultimedia", val)}
          />
        </div>

        {/* Hero Content */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground border-b border-border pb-2">
            Hero Content
          </h3>
          <DynamicStyledField
            type="text"
            label="Title"
            fieldName="title"
            value={hero.title || {}}
            onChange={(val) => updateHeroField("title", val)}
            enableStyle={true}
          />
          <DynamicStyledField
            type="text"
            label="Subtitle / Tagline"
            fieldName="subtitle"
            value={hero.subtitle || {}}
            onChange={(val) => updateHeroField("subtitle", val)}
            enableStyle={true}
          />
          <DynamicStyledField
            type="textarea"
            label="Description"
            fieldName="description"
            value={hero.description || {}}
            onChange={(val) => updateHeroField("description", val)}
            enableStyle={true}
          />
        </div>
      </div>
    </FormSection>
  );
}
