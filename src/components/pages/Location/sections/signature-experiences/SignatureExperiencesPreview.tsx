import { THEME_COLORS } from "@/config/theme"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import { DynamicCmsButtonPreview } from "@/components/pages/CMS/shared/DynamicCmsButtonPreview"
import type { LocationPreviewSectionProps } from "../../config/locationSections"
import { Sparkles } from "lucide-react"
import { useGetExperienceById } from "@/hooks/experience/useGetExperienceById"
import { getExperienceFieldName } from "../../shared/getExperienceFieldName"

function unwrapExperienceData(raw: any) {
  if (!raw) return null
  let data = raw
  if (data?.data !== undefined) {
    data = data.data
  }
  if (data?.data !== undefined && !Array.isArray(data)) {
    data = data.data
  }
  if (Array.isArray(data)) {
    return data[0] || null
  }
  return data
}

function SignatureExperienceRow({
  item,
  index,
  draftName,
}: {
  item: any
  index: number
  draftName?: string
}) {
  const isStringId = typeof item === "string"
  const experienceId = isStringId ? item : item?.id || item?.experienceId || ""

  const { data: rawExpData, isLoading } = useGetExperienceById(experienceId)
  const expData = unwrapExperienceData(rawExpData)

  const expNum = String(index + 1).padStart(2, "0")

  // Resolve Title
  const rawTitle = !isStringId && item?.title ? item.title : null
  const itemTitle =
    rawTitle ||
    expData?.name ||
    expData?.hero?.title ||
    (isLoading ? "Loading experience..." : `Experience ${expNum}`)

  // Resolve Description
  const rawDesc = !isStringId && item?.description ? item.description : null
  const itemDesc =
    rawDesc ||
    expData?.summary ||
    expData?.subtitle ||
    expData?.hero?.description?.value ||
    expData?.hero?.description ||
    `Experience the unique character, heritage, and landscapes of ${draftName || "this destination"}.`

  // Resolve Buttons / Link
  const targetSlug = expData?.slug
  const targetUrl = targetSlug
    ? (targetSlug.startsWith("/") ? targetSlug : `/experiences/${targetSlug}`)
    : (!isStringId && (item?.href || item?.buttons?.[0]?.url)) || "#"

  const rawButtons =
    !isStringId && Array.isArray(item?.buttons) && item.buttons.length > 0
      ? item.buttons
      : !isStringId && item?.button
        ? [item.button]
        : [
          {
            label: "Explore this experience",
            url: targetUrl,
            variant: "link",
            textColor: THEME_COLORS.accent,
          },
        ]

  return (
    <li
      key={experienceId || index}
      className="group/item flex w-full flex-col @lg:flex-row transition-colors duration-300 ease-out cursor-pointer"
    >
      {/* Left Number Column */}
      <div className="w-16 shrink-0 flex items-start justify-start pr-8 py-7 border-r border-neutral-300/60 dark:border-neutral-700/60 transition-colors duration-300">
        <span className="text-primary text-[24px] @md:text-[25.5px] @lg:text-[28.5px] @lgx:text-[29.5px] @xlg:text-[31.5px] @mid:text-[33px] @xl:text-[36px] font-normal leading-7 @lg:leading-8 @lgx:leading-[33px] @xlg:leading-[35px] @mid:leading-[37px] @xl:leading-10 transition-colors duration-300 font-mono text-brand-primary">
          {expNum}
        </span>
      </div>

      {/* Right Content Column */}
      <div className="flex flex-1 flex-col items-start justify-center pl-8 py-7 min-w-0">
        <DynamicStyledTextPreview
          as="h3"
          data={itemTitle}
          fallbackColor={THEME_COLORS.primary}
          className="text-primary text-base @md:text-[17px] @lg:text-[19px] @lgx:text-[19.7px] @xlg:text-[21px] @mid:text-[22px] @xl:text-[24px] font-medium font-heading leading-6 @md:leading-[25px] @lg:leading-[27px] @lgx:leading-[27.7px] @xlg:leading-[29px] @mid:leading-[30px] @xl:leading-8 transition-colors duration-300 group-hover/item:text-accent-light"
        />

        <DynamicStyledTextPreview
          as="p"
          data={itemDesc}
          fallbackColor={THEME_COLORS.muted}
          className="mt-2 text-subtitle text-sm @md:text-[15px] @lg:text-[15.3px] @lgx:text-[15.4px] @xlg:text-[15.6px] @mid:text-[15.7px] @xl:text-base font-normal leading-4 @md:leading-[16.5px] @lg:leading-[17.5px] @lgx:leading-[17.9px] @xlg:leading-[18.5px] @mid:leading-[19.1px] @xl:leading-5"
        />

        {rawButtons.length > 0 && (
          <div className="mt-3.5 @md:mt-4">
            <DynamicCmsButtonPreview
              buttons={rawButtons}
              defaultVariant="link"
            />
          </div>
        )}
      </div>
    </li>
  )
}

export function SignatureExperiencesPreview({
  draft,
}: LocationPreviewSectionProps) {
  const expFieldName = getExperienceFieldName(draft?.type)

  const signatureExperiences =
    draft?.signatureExperiences ||
    (draft as any)?.data?.signatureExperiences ||
    (draft as any)?.signature_experiences ||
    (draft as any)?.data?.signature_experiences

  // Primary list: check countryExperiences (or expFieldName), then signatureExperiences.items
  const rawList: any =
    (draft as any)?.[expFieldName] ??
    draft?.experience ??
    (draft as any)?.experiences ??
    signatureExperiences?.items ??
    signatureExperiences?.experiences ??
    []

  const items = Array.isArray(rawList)
    ? rawList
    : Array.isArray(rawList?.items)
      ? rawList.items
      : []

  const headerLabel = signatureExperiences?.label || {
    value: "Signature Experiences",
    textColor: THEME_COLORS.accent,
    textOpacity: 1,
  }

  const headerTitle = signatureExperiences?.title || {
    value: "Five ways to fall in love with " + (draft?.name || "the destination"),
    textColor: THEME_COLORS.primary,
    textOpacity: 1,
  }

  const headerDesc = signatureExperiences?.description || {
    value: "Discover the most iconic, unhurried encounters across the country.",
    textColor: THEME_COLORS.muted,
    textOpacity: 1,
  }

  const backgroundMultimedia = signatureExperiences?.backgroundMultimedia || null

  return (
    <section
      data-section="signature-experiences"
      className="relative w-full overflow-hidden bg-background pt-[60px] @xs:pt-[70px] @sm:pt-[80px] @md:pt-[95px] @lg:pt-[110px] @lgx:pt-[115px] @xlg:pt-[120px] @mid:pt-[135px] @xl:pt-[145px] pb-[60px] @xs:pb-[70px] @sm:pb-[80px] @md:pb-[95px] @lg:pb-[110px] @lgx:pb-[115px] @xlg:pb-[120px] @mid:pb-[135px] @xl:pb-[145px]"
    >
      {/* Background Media (Color / Image / Video) */}
      <UniversalMultimediaPreview
        multimedia={backgroundMultimedia}
        fallbackColor={THEME_COLORS.white}
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
                data={headerLabel}
                fallbackColor={THEME_COLORS.accent}
                className="self-stretch justify-start font-normal text-accent text-base @md:text-lg @lgx:text-[20px] @mid:text-[22px] @xl:text-2xl leading-6 @md:leading-[26px] @lgx:leading-7 @mid:leading-[30px] @xl:leading-8"
              />

              {/* Section Main Title */}
              <DynamicStyledTextPreview
                as="h2"
                data={headerTitle}
                fallbackColor={THEME_COLORS.primary}
                className="self-stretch shrink-0 h-auto justify-start font-medium text-primary font-heading text-[28px] leading-[38px] @md:text-[38px] @md:leading-[47px] @lg:text-[42px] @lg:leading-[50px] @lgx:text-[43px] @lgx:leading-[51px] @xlg:text-[44px] @xlg:leading-[52px] @mid:text-[46px] @mid:leading-[54px] @xl:text-[48px] @xl:leading-[56px] @2xl:text-[50px] @2xl:leading-[58px]"
              />
            </div>

            {/* Narrative Paragraph Description */}
            <div className="w-full max-w-full @md:max-w-[545.4px] @lg:max-w-[600px] @lgx:max-w-[620.5px] @xlg:max-w-[654.6px] @mid:max-w-[688.8px] @xl:max-w-[740px]">
              <DynamicStyledTextPreview
                as="p"
                data={headerDesc}
                fallbackColor={THEME_COLORS.muted}
                className="text-[13px] @md:text-sm @lg:text-[14.7px] @lgx:text-[15px] @xlg:text-[15.3px] @mid:text-[15.6px] @xl:text-base font-normal leading-5 @md:leading-[22px] @lg:leading-[23.5px] @lgx:leading-6 @xlg:leading-[25px] @mid:leading-[26px] @xl:leading-7 tracking-normal @md:tracking-[0.3px] @lg:tracking-[0.5px] @lgx:tracking-[0.6px] @xlg:tracking-[0.7px] @mid:tracking-[0.85px] @xl:tracking-[1px] text-muted"
              />
            </div>
          </div>

          {/* Experiences List */}
          <ol className="mt-14 @md:mt-[60.9px] @lg:mt-[71px] @lgx:mt-[74.5px] @xlg:mt-[80.6px] @mid:mt-[86.8px] @xl:mt-24 @md:pl-6 flex w-full flex-col">
            {items.length === 0 ? (
              <div className="mt-4 flex w-full flex-col items-center justify-center rounded-md border border-dashed border-border/80 bg-muted/20 p-8 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
                  <Sparkles className="h-5 w-5 opacity-80" />
                </div>
                <p className="text-xs font-medium text-foreground">
                  No signature experiences linked yet
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Link experiences from the catalog in the form section.
                </p>
              </div>
            ) : (
              items.map((exp: any, idx: number) => (
                <SignatureExperienceRow
                  key={typeof exp === "string" ? exp : exp?.id || idx}
                  item={exp}
                  index={idx}
                  draftName={draft?.name}
                />
              ))
            )}
          </ol>
        </div>
      </div>
    </section>
  )
}

export default SignatureExperiencesPreview
