import type { StoryData } from "./config/storyTypes";
import { getSectionsForType } from "./config/storySections";

type StoryPreviewProps = {
  draft: StoryData;
};

export function StoryPreview({ draft }: StoryPreviewProps) {
  const sections = getSectionsForType(draft.type);

  return (
    <div className="@container flex h-full w-full flex-col bg-background overflow-y-auto overflow-x-hidden">
      {sections.map((section) => {
        if (!section.previewComponent) return null;
        const PreviewComponent = section.previewComponent;
        return <PreviewComponent key={section.id} story={draft} />;
      })}
    </div>
  );
}
