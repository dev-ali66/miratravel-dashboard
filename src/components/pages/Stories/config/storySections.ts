import type { ComponentType } from "react";
import type { StoryData } from "./storyTypes";
import { BasicInfoForm } from "../sections/basic-info/BasicInfoForm";
import { RelationshipsForm } from "../sections/relationships/RelationshipsForm";
import { HeroForm } from "../sections/hero/HeroForm";
import { HeroPreview } from "../sections/hero/HeroPreview";
import { IntroForm } from "../sections/intro/IntroForm";
import { IntroPreview } from "../sections/intro/IntroPreview";
import { BlocksForm } from "../sections/blocks/BlocksForm";
import { BlocksPreview } from "../sections/blocks/BlocksPreview";
import { PracticalNotesForm } from "../sections/practical-notes/PracticalNotesForm";
import { PracticalNotesPreview } from "../sections/practical-notes/PracticalNotesPreview";
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
    id: "intro",
    label: "Story Intro / Overview",
    formComponent: IntroForm,
    previewComponent: IntroPreview,
  },
  {
    id: "blocks",
    label: "Dynamic Content Blocks",
    formComponent: BlocksForm,
    previewComponent: BlocksPreview,
  },
  {
    id: "practical-notes",
    label: "Practical Notes & Insider Tips",
    formComponent: PracticalNotesForm,
    previewComponent: PracticalNotesPreview,
  },
  {
    id: "seo",
    label: "SEO & Metadata",
    formComponent: SeoForm,
  },
];

// Define which sections are visible for each story type
const SHORT_STORY_SECTIONS = [
  "basic-info",
  "relationships",
  "hero",
  "intro",
  "blocks",
  "practical-notes",
  "seo",
];

const LONG_STORY_SECTIONS = [
  "basic-info",
  "relationships",
  "hero",
  "intro",
  "blocks",
  "practical-notes",
  "seo",
];

const GUIDANCE_SECTIONS = [
  "basic-info",
  "relationships",
  "hero",
  "intro",
  "blocks",
  "practical-notes",
  "seo",
];

export function getSectionsForType(type: string): StorySectionConfig[] {
  let activeIds: string[] = [];
  if (type === "short_story") activeIds = SHORT_STORY_SECTIONS;
  else if (type === "long_story") activeIds = LONG_STORY_SECTIONS;
  else if (type === "guidance") activeIds = GUIDANCE_SECTIONS;
  else activeIds = SHORT_STORY_SECTIONS;

  return STORY_SECTIONS_REGISTRY.filter((s) => activeIds.includes(s.id));
}

