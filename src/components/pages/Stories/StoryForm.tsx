import { useState, useEffect } from "react";
import { getSectionsForType } from "./config/storySections";
import { EditorFormHeader } from "@/components/shared/EditorFormHeader";
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
  // Start with ALL sections fully collapsed by default (matching LocationForm)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  // Single-active accordion collapse handler matching LocationForm
  const toggleSection = (section: string) => {
    setOpenSections((current) => {
      const isCurrentlyOpen = !!current[section];
      return isCurrentlyOpen ? {} : { [section]: true };
    });
  };

  // Sync scroll listener: Automatically expand active section accordion when preview scrolls
  useEffect(() => {
    const handleActiveSectionChange = (e: Event) => {
      // Do not collapse/switch form section if the user is focused inside the form sidebar
      const activeEl = document.activeElement;
      if (activeEl && activeEl.tagName !== "BODY" && activeEl.closest("form, [data-section], div")) {
        const isInsideForm = Boolean(activeEl.closest("input, select, textarea, button, [data-section]"));
        if (isInsideForm) return;
      }

      const customEvent = e as CustomEvent<{ sectionKey: string }>;
      if (customEvent.detail?.sectionKey) {
        const key = customEvent.detail.sectionKey;
        setOpenSections({ [key]: true });
      }
    };

    window.addEventListener("editor-active-section-change", handleActiveSectionChange);
    return () => {
      window.removeEventListener("editor-active-section-change", handleActiveSectionChange);
    };
  }, []);

  const sections = getSectionsForType(draft.type || "normal_story");

  const handleConsoleLog = () => {
    const payload = normalizeStoryPayload(draft);
    console.log("📖 [CLEAN STORY API PAYLOAD]:", payload);
    console.log("   ★ Featured Story:", payload.featured);
    console.log("   ✓ Recommended Story:", payload.recommended);
  };

  const handleSave = () => {
    const payload = normalizeStoryPayload(draft);
    onSave(payload);
  };

  return (
    <div className="flex min-h-full flex-col">
      {/* Sticky Top Header (Universal EditorFormHeader) */}
      <EditorFormHeader
        eyebrow={
          draft.type === "TRAVEL_ESSENTIALS" || draft.type === "travel_essentials"
            ? "Travel Essentials"
            : draft.type === "MIRA_EDITORIAL" || draft.type === "mira_editorial"
            ? "Mira Editorial"
            : "Normal Story"
        }
        title={draft.title ? draft.title : "Add Story"}
        isEditMode={Boolean(draft.id)}
        isSaving={isSaving}
        onSave={handleSave}
        onConsoleData={handleConsoleLog}
        consoleDataTitle="Inspect clean story payload sent to backend API in browser console (F12)"
      />

      {/* Sections — Continuous divide-y accordion layout */}
      <div className="flex-1 divide-y divide-border/60">
        {sections.map((section, idx) => {
          const FormComponent = section.formComponent;
          const sectionNumber = String(idx + 1).padStart(2, "0");

          return (
            <div key={section.id} data-section={section.id} className="transition-all">
              <FormComponent
                draft={draft}
                updateField={updateField}
                openSections={openSections}
                toggleSection={toggleSection}
                sectionNumber={sectionNumber}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
