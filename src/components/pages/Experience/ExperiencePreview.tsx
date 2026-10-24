import { useExperienceDraft } from "./shared/ExperienceDraftContext"
import {
  getExperienceSections,
  experienceSectionRegistry,
} from "./config/experienceSections"

export const ExperiencePreview = () => {
  const { draft } = useExperienceDraft()
  const activeSections = getExperienceSections()

  return (
    <div className="@container w-full min-h-full bg-background text-foreground text-sm md:text-base">
      {activeSections.map((key) => {
        const SectionPreview = experienceSectionRegistry[key]?.preview

        if (!SectionPreview) {
          return (
            <div
              key={key}
              data-section={key}
              style={{ display: "none" }}
              aria-hidden
            />
          )
        }

        return (
          <section key={key} data-section={key} className="w-full">
            <SectionPreview draft={draft} />
          </section>
        )
      })}
    </div>
  )
}

export default ExperiencePreview
