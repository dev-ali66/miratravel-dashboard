import type { ComponentType } from "react";
import type { StoryData } from "./storyTypes";
import { BasicInfoForm } from "../sections/basic-info/BasicInfoForm";
import { HeroForm } from "../sections/hero/HeroForm";
import { HeroPreview } from "../sections/hero/HeroPreview";

export type StoryFormSectionProps = {
  draft: StoryData;
  updateField: (path: string, value: unknown) => void;
  openSections: Record<string, boolean>;
  toggleSection: (key: string) => void;
  sectionNumber: number;
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
    id: "basicInfo",
    label: "Basic Information",
    formComponent: BasicInfoForm,
    // Preview handled globally or implicitly via layout
  },
  {
    id: "hero",
    label: "Hero Banner",
    formComponent: HeroForm,
    previewComponent: HeroPreview,
  },
  // Add other sections here as they are built...
];

// Define which sections are visible for each story type
const SHORT_STORY_SECTIONS = ["basicInfo", "hero"]; // and more...
const LONG_STORY_SECTIONS = ["basicInfo", "hero"]; // and more...
const GUIDANCE_SECTIONS = ["basicInfo", "hero"]; // and more...

export function getSectionsForType(type: string): StorySectionConfig[] {
  let activeIds: string[] = [];
  if (type === "short_story") activeIds = SHORT_STORY_SECTIONS;
  else if (type === "long_story") activeIds = LONG_STORY_SECTIONS;
  else if (type === "guidance") activeIds = GUIDANCE_SECTIONS;
  else activeIds = SHORT_STORY_SECTIONS;

  return STORY_SECTIONS_REGISTRY.filter((s) => activeIds.includes(s.id));
}
