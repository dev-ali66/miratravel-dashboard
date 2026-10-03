export type StoryType = "short_story" | "long_story" | "guidance";

export interface StoryData {
  id?: string;
  slug: string;
  title: string;
  type: StoryType;
  readTime?: string;
  authorName?: string;
  authorRole?: string;
  authorAvatar?: Record<string, any>;
  status: "DRAFT" | "PUBLISHED";

  // Section fields
  hero?: Record<string, any>;
  intro?: Record<string, any>;
  blocks?: any[];
  practicalNotes?: any[];
  seo?: Record<string, any>;

  // Relation fields
  categories?: string[]; // Note: in real DB this maps to StoryCategory, but in form it can just be an array of IDs or names
  journeyIds?: string[];
  locationIds?: string[];
  manualRelatedStoryIds?: string[];

  createdAt?: string;
  updatedAt?: string;
}

export const isDevModeActive = false; // Toggle to true to see normalized payload
