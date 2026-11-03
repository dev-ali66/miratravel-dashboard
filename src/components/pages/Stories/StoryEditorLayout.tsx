import { useParams } from "react-router-dom";
import { BookOpen } from "lucide-react";

import { StoryPreview } from "./StoryPreview";
import { StoryDraftProvider, useStoryDraft } from "./shared/StoryDraftContext";
import { UniversalEditorLayout } from "@/components/layout/UniversalEditorLayout";
import { useStoryPage } from "./shared/useStoryPage";
import { StoryForm } from "./StoryForm";
import MiraLoader from "@/components/shared/MiraLoader";

function StoryEditorInner() {
  const { slug } = useParams<{ slug: string }>();
  const { draft } = useStoryDraft();
  const { updateField, save, isSaving, isLoading } = useStoryPage(slug);

  if (isLoading || !draft) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <MiraLoader />
      </div>
    );
  }

  return (
    <UniversalEditorLayout
      backToUrl="/stories"
      backToLabel="Back to Stories"
      icon={BookOpen}
      iconColor="text-accent"
      title={slug === "new" ? "New Story" : `Edit ${draft.title || "Story"}`}
      sidebarContent={
        <StoryForm
          draft={draft}
          updateField={updateField}
          onSave={save}
          isSaving={isSaving}
        />
      }
      previewContent={<StoryPreview draft={draft} />}
      useWorkspaceScale={true}
      scrollSyncMode="previewToFormOnly"
    />
  );
}

export function StoryEditorLayout() {
  return (
    <StoryDraftProvider>
      <StoryEditorInner />
    </StoryDraftProvider>
  );
}
