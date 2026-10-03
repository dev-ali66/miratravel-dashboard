import { useState } from "react";
import { Terminal, Save, Loader2 } from "lucide-react";
import { getSectionsForType } from "./config/storySections";
import { normalizeStoryPayload } from "./shared/normalizeStoryPayload";
import type { StoryData } from "./config/storyTypes";

export function StoryForm({
  draft,
  updateField,
  onSave,
  isSaving,
}: {
  draft: StoryData;
  updateField: (path: string, value: any) => void;
  onSave: (payload: any) => void;
  isSaving: boolean;
}) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    basicInfo: true,
    hero: true,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const sections = getSectionsForType(draft.type || "short_story");

  const handleConsoleLog = () => {
    const payload = normalizeStoryPayload(draft);
    console.log("Normalized Story Payload:", payload);
    alert("Payload logged to console! Check DevTools.");
  };

  const handleSave = () => {
    const payload = normalizeStoryPayload(draft);
    onSave(payload);
  };

  return (
    <div className="flex h-full flex-col bg-background relative pb-20">
      {/* Sticky Save Bar */}
      <div className="sticky top-0 z-20 flex w-full items-center justify-between border-b border-border/60 bg-card/95 px-4 py-3 backdrop-blur shadow-sm">
        <div className="flex flex-col">
          <h2 className="text-sm font-semibold text-foreground truncate">
            {draft.title ? draft.title : "Untitled Story"}
          </h2>
          <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
            {draft.type === "short_story" ? "Short Story" : draft.type === "long_story" ? "Long Story" : "Guidance"}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-4">
          <button
            type="button"
            onClick={handleConsoleLog}
            className="flex items-center gap-2 rounded-md bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 px-3 py-1.5 text-xs font-medium text-foreground transition-colors cursor-pointer"
          >
            <Terminal className="h-3.5 w-3.5" />
            Console
          </button>
          
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex shrink-0 items-center gap-2 rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            {draft.id ? "Update" : "Create"}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-4xl p-4">
          <div className="space-y-4">
            {sections.map((section, idx) => {
              const FormComponent = section.formComponent;
              return (
                <FormComponent
                  key={section.id}
                  draft={draft}
                  updateField={updateField}
                  openSections={openSections}
                  toggleSection={toggleSection}
                  sectionNumber={idx + 1}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
