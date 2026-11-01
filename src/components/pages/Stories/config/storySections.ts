import type { ComponentType } from "react";
import type { StoryData } from "./storyTypes";
import { BasicInfoForm } from "../sections/basic-info/BasicInfoForm";
import { RelationshipsForm } from "../sections/relationships/RelationshipsForm";
import { HeroForm } from "../sections/hero/HeroForm";
import { HeroPreview } from "../sections/hero/HeroPreview";
import { BlocksForm } from "../sections/blocks/BlocksForm";
import { BlocksPreview } from "../sections/blocks/BlocksPreview";
import { SeoForm } from "../sections/seo/SeoForm";

export type StoryFormSectionProps = {
  draft: StoryData;
  updateField: (path: string, value: unknown) => void;
  openSections: Record<string, boolean>;
  toggleSection: (key: string) => void;
  sectionNumber?: string | number;
};

export type StoryPreviewProps = {
  story: StoryData;
};

type StorySectionConfig = {
  id: string;
  label: string;
  formComponent: ComponentType<StoryFormSectionProps>;
  previewComponent?: ComponentType<StoryPreviewProps>;
};

export const STORY_SECTIONS_REGISTRY: StorySectionConfig[] = [
  {
    id: "basic-info",
    label: "Basic Information",
    formComponent: BasicInfoForm,
  },
  {
    id: "relationships",
    label: "Linked Locations, Journeys & Related Stories",
    formComponent: RelationshipsForm,
  },
  {
    id: "hero",
    label: "Hero Banner",
    formComponent: HeroForm,
    previewComponent: HeroPreview,
  },
  {
    id: "blocks",
    label: "Dynamic Content Blocks",
    formComponent: BlocksForm,
    previewComponent: BlocksPreview,
  },
  {
    id: "seo",
    label: "SEO & Metadata",
    formComponent: SeoForm,
  },
];

const ALL_STORY_SECTIONS = [
  "basic-info",
  "relationships",
  "hero",
  "blocks",
  "seo",
];

export function getSectionsForType(_type?: string): StorySectionConfig[] {
  return STORY_SECTIONS_REGISTRY.filter((s) => ALL_STORY_SECTIONS.includes(s.id));
}

