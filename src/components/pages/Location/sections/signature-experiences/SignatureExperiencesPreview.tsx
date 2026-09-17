import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import type { LocationPreviewSectionProps } from "../../config/locationSections"
import type { SignatureExperienceItem } from "../../locationTypes"
import { Sparkles } from "lucide-react"

export function SignatureExperiencesPreview({
  draft,
}: LocationPreviewSectionProps) {
  const signatureExperiences =
    draft?.signatureExperiences ||
    (draft as any)?.data?.signatureExperiences ||
    (draft as any)?.signature_experiences ||
    (draft as any)?.data?.signature_experiences || {
      label: null,
      title: null,
      description: null,
      backgroundMultimedia: null,
      experiences: [],
    }

  const items: SignatureExperienceItem[] = Array.isArray(
    signatureExperiences.items
  )
    ? signatureExperiences.items
    : Array.isArray(signatureExperiences.experiences)
      ? signatureExperiences.experiences
      : []

  return (
    <section
      data-section="signature-experiences"
      className="relative w-full overflow-hidden bg-background pt-[60px] @xs:pt-[70px] @sm:pt-[80px] @md:pt-[95px] @lg:pt-[110px] @lgx:pt-[115px] @xlg:pt-[120px] @mid:pt-[135px] @xl:pt-[145px] pb-[60px] @xs:pb-[70px] @sm:pb-[80px] @md:pb-[95px] @lg:pb-[110px] @lgx:pb-[115px] @xlg:pb-[120px] @mid:pb-[135px] @xl:pb-[145px]"
    >
      {/* Background Media (Color / Image / Video) */}
      <UniversalMultimediaPreview
        multimedia={signatureExperiences.backgroundMultimedia}
        fallbackColor="#FFFFFF"
        mode="background"
      />

      <div
        id="signature-experiences"
        className="relative z-10 w-full scroll-mt-24 container mx-auto px-4 @xs:px-5 @sm:px-6 @lg:px-8 @xl:px-0"
        style={{ perspective: "1200px" }}
      >
        <div className="w-full max-w-full @md:max-w-[720px] @lg:max-w-[877.2px] @lgx:max-w-[936.1px] @xlg:max-w-[1034.4px] @mid:max-w-[1132.6px] @xl:max-w-[1280px] mx-auto flex flex-col items-start justify-start">
          {/* Top Header Row */}
          <div className="flex flex-col items-start justify-between gap-8 @md:gap-10 @mid:gap-[55px] @xl:gap-14 @lg:flex-row @lg:items-end w-full">
            <div className="flex flex-col items-start gap-4">
              {/* Eyebrow Label */}
              <DynamicStyledTextPreview
                as="div"
                data={signatureExperiences.label}
                fallbackColor="#af6348"
                className="self-stretch justify-start font-normal text-accent text-base @md:text-lg @lgx:text-[20px] @mid:text-[22px] @xl:text-2xl leading-6 @md:leading-[26px] @lgx:leading-7 @mid:leading-[30px] @xl:leading-8"
              />

              {/* Section Main Title */}
              <DynamicStyledTextPreview
                as="h2"
                data={signatureExperiences.title}
                fallbackColor="#182d09"
                className="self-stretch shrink-0 h-auto justify-start font-medium text-primary font-heading text-[28px] leading-[38px] @md:text-[38px] @md:leading-[47px] @lg:text-[42px] @lg:leading-[50px] @lgx:text-[43px] @lgx:leading-[51px] @xlg:text-[44px] @xlg:leading-[52px] @mid:text-[46px] @mid:leading-[54px] @xl:text-[48px] @xl:leading-[56px] @2xl:text-[50px] @2xl:leading-[58px]"
              />
            </div>

            {/* Narrative Paragraph Description */}
            <div className="w-full max-w-full @md:max-w-[545.4px] @lg:max-w-[600px] @lgx:max-w-[620.5px] @xlg:max-w-[654.6px] @mid:max-w-[688.8px] @xl:max-w-[740px]">
              <DynamicStyledTextPreview
                as="p"
                data={signatureExperiences.description}
                fallbackColor="#565e69"
                className="text-[13px] @md:text-sm @lg:text-[14.7px] @lgx:text-[15px] @xlg:text-[15.3px] @mid:text-[15.6px] @xl:text-base font-normal leading-5 @md:leading-[22px] @lg:leading-[23.5px] @lgx:leading-6 @xlg:leading-[25px] @mid:leading-[26px] @xl:leading-7 tracking-normal @md:tracking-[0.3px] @lg:tracking-[0.5px] @lgx:tracking-[0.6px] @xlg:tracking-[0.7px] @mid:tracking-[0.85px] @xl:tracking-[1px] text-muted"
              />
            </div>
          </div>

          {/* Experiences List */}
          <ol className="mt-14 @md:mt-[60.9px] @lg:mt-[71px] @lgx:mt-[74.5px] @xlg:mt-[80.6px] @mid:mt-[86.8px] @xl:mt-24 @md:pl-6 flex w-full flex-col">
            {items.length === 0 ? (
              <div className="mt-4 flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 p-8 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
                  <Sparkles className="h-5 w-5 opacity-80" />
                </div>
                <p className="text-xs font-medium text-foreground">
                  No signature experiences added yet
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Add signature experiences in the form section.
                </p>
              </div>
            ) : (
              items.map((exp, idx) => {
                const expNum = String(idx + 1).padStart(2, "0")
                const itemKey = exp.id || `exp-${idx}`
                const firstBtn = Array.isArray(exp.buttons) && exp.buttons.length > 0 ? exp.buttons[0] : (exp.button || null)
                const linkHref =
                  firstBtn?.url ||
                  (typeof exp.linkText === "object" ? exp.linkText?.href : null) ||
                  exp.href ||
                  "#"
                const actionText =
                  firstBtn?.label ||
                  (typeof exp.linkText === "object" ? exp.linkText?.value : null) ||
                  (typeof exp.linkText === "string" ? exp.linkText : null) ||
                  "Explore this experience"

                return (
                  <li
                    key={itemKey}
                    className="group/item flex w-full flex-col @lg:flex-row transition-colors duration-300 ease-out cursor-pointer"
                  >
                    {/* Left Number Column */}
                    <div className="w-16 shrink-0 flex items-start justify-start pr-8 py-7 border-r border-neutral-300/60 dark:border-neutral-700/60 transition-colors duration-300">
                      <span className="text-primary text-[24px] @md:text-[25.5px] @lg:text-[28.5px] @lgx:text-[29.5px] @xlg:text-[31.5px] @mid:text-[33px] @xl:text-[36px] font-normal leading-7 @lg:leading-8 @lgx:leading-[33px] @xlg:leading-[35px] @mid:leading-[37px] @xl:leading-10 transition-colors duration-300 font-mono text-[#182d09]">
                        {expNum}
                      </span>
                    </div>

                    {/* Right Content Column */}
                    <div className="flex flex-1 flex-col items-start justify-center pl-8 py-7 min-w-0">
                      <DynamicStyledTextPreview
                        as="h3"
                        data={exp.title}
                        fallbackColor="#182d09"
                        className="text-primary text-base @md:text-[17px] @lg:text-[19px] @lgx:text-[19.7px] @xlg:text-[21px] @mid:text-[22px] @xl:text-[24px] font-medium font-heading leading-6 @md:leading-[25px] @lg:leading-[27px] @lgx:leading-[27.7px] @xlg:leading-[29px] @mid:leading-[30px] @xl:leading-8 transition-colors duration-300 group-hover/item:text-accent-light"
                      />

                      <DynamicStyledTextPreview
                        as="p"
                        data={exp.description}
                        fallbackColor="#565e69"
                        className="mt-2 text-subtitle text-sm @md:text-[15px] @lg:text-[15.3px] @lgx:text-[15.4px] @xlg:text-[15.6px] @mid:text-[15.7px] @xl:text-base font-normal leading-4 @md:leading-[16.5px] @lg:leading-[17.5px] @lgx:leading-[17.9px] @xlg:leading-[18.5px] @mid:leading-[19.1px] @xl:leading-5"
                      />

                      <a
                        href={linkHref}
                        className="mt-3.5 @md:mt-4 group/link inline-flex items-center gap-2 text-accent text-xs @md:text-[12.3px] @lg:text-[12.8px] @lgx:text-[13px] @xlg:text-[13.3px] @mid:text-[13.6px] @xl:text-sm font-medium transition-colors duration-200 hover:text-accent-hover group-hover/item:text-accent-hover outline-none focus-visible:underline"
                        style={{ color: firstBtn?.textColor || "#af6348" }}
                      >
                        <span>{actionText}</span>
                        <svg
                          className="size-3 @md:size-[12.2px] @lg:size-[12.6px] @lgx:size-[12.7px] @xlg:size-[12.9px] @mid:size-[13.2px] @xl:size-[13.5px] transition-transform duration-300 group-hover/link:translate-x-1 group-hover/item:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                          />
                        </svg>
                      </a>
                    </div>
                  </li>
                )
              })
            )}
          </ol>
        </div>
      </div>
    </section>
  )
}

export default SignatureExperiencesPreview
