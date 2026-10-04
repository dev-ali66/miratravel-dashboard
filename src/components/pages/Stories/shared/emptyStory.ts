import type { StoryData } from "../config/storyTypes";
import { emptyHero } from "../sections/hero/emptyHero";
import { emptyBasicInfo } from "../sections/basic-info/emptyBasicInfo";
import { emptyIntro } from "../sections/intro/emptyIntro";
import { emptyBlocks, emptyBlocksBackgroundMultimedia } from "../sections/blocks/emptyBlocks";
import { emptyPracticalNotes } from "../sections/practical-notes/emptyPracticalNotes";

export const emptyMultimedia = {
  show: "image", // "image" | "video" | "color"
  color: { color: "#171717", opacity: 100, width: "100%", height: "100%", aspectRatio: "auto" },
  image: { url: "", alt: "", opacity: 100, overlayColor: "#000000", overlayOpacity: 45, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" },
  video: { url: "", alt: "", opacity: 100, overlayColor: "#000000", overlayOpacity: 45, autoplay: true, loop: true, muted: true, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" }
};

export const emptyTitle = {
  value: "",
  textColor: "#FFFFFF",
  textOpacity: 1,
  backgroundColor: null,
  backgroundOpacity: 1
};

export const emptyText = {
  value: "",
  textColor: "#E5E7EB",
  textOpacity: 1,
  backgroundColor: null,
  backgroundOpacity: 1
};

export const emptyStory: StoryData = {
  ...emptyBasicInfo,
  status: "DRAFT",
  journeys: [],
  locations: [],
  manualRelatedStories: [],
  hero: emptyHero,
  intro: emptyIntro,
  blocks: emptyBlocks,
  blocksBackgroundMultimedia: emptyBlocksBackgroundMultimedia,
  practicalNotes: emptyPracticalNotes,
};

