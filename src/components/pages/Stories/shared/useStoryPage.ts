import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useStoryDraft } from "./StoryDraftContext";
import { emptyStory } from "./emptyStory";
import { normalizeStoryPayload } from "./normalizeStoryPayload";
import { useGetStories } from "@/hooks/story/useGetStories";
import { useCreateStory, useUpdateStory } from "@/hooks/story/useStoryMutations";

export function useStoryPage(storySlug?: string) {
  const isEditMode = Boolean(storySlug && storySlug !== "new");
  const { draft, setDraft, resetDraft } = useStoryDraft();
  const { data: response, isLoading, isError } = useGetStories();
  const { mutateAsync: createStoryAsync } = useCreateStory();
  const { mutateAsync: updateStoryAsync } = useUpdateStory();
  const [isSaving, setIsSaving] = useState(false);

  // Load Edit Data
  useEffect(() => {
    if (!isEditMode) return;
    if (isLoading) return;

    const stories = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
    const storyToEdit = stories?.find((s: any) => s.slug === storySlug);

    if (storyToEdit) {
      const locations = Array.isArray(storyToEdit.locations)
        ? storyToEdit.locations.map((l: any) => (typeof l === "string" ? l : l.id)).filter(Boolean)
        : Array.isArray(storyToEdit.locationIds)
        ? storyToEdit.locationIds
        : [];

      const journeys = Array.isArray(storyToEdit.journeys)
        ? storyToEdit.journeys.map((j: any) => (typeof j === "string" ? j : j.id)).filter(Boolean)
        : Array.isArray(storyToEdit.journeyIds)
        ? storyToEdit.journeyIds
        : [];

      const manualRelatedStories = Array.isArray(storyToEdit.manualRelatedStories)
        ? storyToEdit.manualRelatedStories.map((s: any) => (typeof s === "string" ? s : s.id)).filter(Boolean)
        : Array.isArray(storyToEdit.manualRelatedStoryIds)
        ? storyToEdit.manualRelatedStoryIds
        : [];

      const categories = Array.isArray(storyToEdit.categories)
        ? storyToEdit.categories.map((c: any) => (typeof c === "string" ? c : c.name || c.id)).filter(Boolean)
        : [];

      setDraft({
        ...emptyStory,
        ...storyToEdit,
        locations,
        journeys,
        manualRelatedStories,
        locationIds: locations,
        journeyIds: journeys,
        manualRelatedStoryIds: manualRelatedStories,
        categories,
        type: storyToEdit.type || storyToEdit.templateType || "short_story",
        hero: storyToEdit.hero || emptyStory.hero,
      });
    } else {
      toast.error("Story not found");
    }
  }, [isEditMode, isLoading, response, storySlug, setDraft]);

  // Load New Data
  useEffect(() => {
    if (isEditMode) return;
    resetDraft(emptyStory);
  }, [isEditMode, resetDraft]);

  const updateField = useCallback(
    (path: string, value: unknown) => {
      setDraft((prev: any) => {
        if (!prev) return prev;
        const keys = path.split(".");
        if (keys.length === 1) {
          return { ...prev, [keys[0]]: value };
        }
        const rootKey = keys[0];
        const nestedPath = keys.slice(1);
        const rootObj = { ...(prev[rootKey] || {}) };
        
        let current: any = rootObj;
        for (let i = 0; i < nestedPath.length - 1; i++) {
          const key = nestedPath[i];
          current[key] = { ...(current[key] || {}) };
          current = current[key];
        }
        current[nestedPath[nestedPath.length - 1]] = value;
        return { ...prev, [rootKey]: rootObj };
      });
    },
    [setDraft]
  );

  const save = useCallback(
    async (manualPayload?: any) => {
      if (!draft) return;
      setIsSaving(true);
      try {
        const payload = manualPayload || normalizeStoryPayload(draft);
        if (isEditMode && draft.id) {
          await updateStoryAsync({ id: draft.id, data: payload });
          toast.success("Story updated successfully!");
        } else {
          await createStoryAsync(payload);
          toast.success("Story created successfully!");
        }
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to save story");
      } finally {
        setIsSaving(false);
      }
    },
    [draft, isEditMode, createStoryAsync, updateStoryAsync]
  );

  return {
    updateField,
    save,
    isEditMode,
    isLoading,
    isError,
    isSaving,
  };
}
