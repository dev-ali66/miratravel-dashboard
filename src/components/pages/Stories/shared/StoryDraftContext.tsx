import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { StoryData } from "../config/storyTypes";
import { emptyStory } from "./emptyStory";

type StoryDraftContextValue = {
  draft: StoryData | null;
  setDraft: React.Dispatch<React.SetStateAction<StoryData | null>>;
  resetDraft: (value?: StoryData) => void;
};

const StoryDraftContext = createContext<StoryDraftContextValue | null>(null);

export function StoryDraftProvider({
  children,
  initialDraft = emptyStory,
}: {
  children: React.ReactNode;
  initialDraft?: StoryData | null;
}) {
  const [draft, setDraft] = useState<StoryData | null>(initialDraft);

  const resetDraft = useCallback((value?: StoryData) => {
    setDraft(value ?? emptyStory);
  }, []);

  const contextValue = useMemo(
    () => ({
      draft,
      setDraft,
      resetDraft,
    }),
    [draft, resetDraft]
  );

  return (
    <StoryDraftContext.Provider value={contextValue}>
      {children}
    </StoryDraftContext.Provider>
  );
}

export function useStoryDraft() {
  const context = useContext(StoryDraftContext);
  if (!context) {
    throw new Error("useStoryDraft must be used within StoryDraftProvider");
  }
  return context;
}
