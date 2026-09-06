/* =====================================================
   JOURNEYS — INCLUSIONS TAB PREVIEW
   100% Pixel-Perfect Match with:
   frontend/components/journey-overview/whatsincluded-content.tsx
   Uses UniversalMultimediaPreview Single Source of Truth
===================================================== */

import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import { whatsIncludedData } from "./journeyStaticData"
import type { Journey } from "../journeyTypes"

const SECTION_PX = "px-4 lg:px-0"

export function WhatsIncludedPreview({ draft }: { draft?: Journey }) {
  const sectionData = (draft?.data?.whatsIncluded as any) || {}
  const sectionBg =
    sectionData?.backgroundMultimedia ||
    (draft?.data?.highlightsSection as any)?.backgroundMultimedia

  const includedTitle = sectionData?.includedTitle || whatsIncludedData.includedTitle
  const notIncludedTitle = sectionData?.notIncludedTitle || whatsIncludedData.notIncludedTitle
  const importantInfoTitle = sectionData?.importantInfoTitle || whatsIncludedData.importantInfoTitle

  const includedItems: string[] =
    draft?.included && draft.included.length > 0
      ? draft.included
      : sectionData?.includedItems && sectionData.includedItems.length > 0
      ? sectionData.includedItems
      : whatsIncludedData.includedItems

  const notIncludedItems: string[] =
    draft?.notIncluded && draft.notIncluded.length > 0
      ? draft.notIncluded
      : sectionData?.notIncludedItems && sectionData.notIncludedItems.length > 0
      ? sectionData.notIncludedItems
      : whatsIncludedData.notIncludedItems

  const importantInfoItems: string[] =
    sectionData?.importantInfo && sectionData.importantInfo.length > 0
      ? sectionData.importantInfo
      : sectionData?.importantInfoItems && sectionData.importantInfoItems.length > 0
      ? sectionData.importantInfoItems
      : whatsIncludedData.importantInfoItems

  return (
    <div className="relative w-full flex flex-col xl:pt-[51px] pt-6 md:pt-11 lgx:pt-12 pb-16">
      {/* Background Universal Multimedia */}
      {sectionBg && (
        <UniversalMultimediaPreview
          multimedia={sectionBg}
          mode="background"
          className="h-full w-full object-cover"
          containerClassName="absolute inset-0 z-0 pointer-events-none"
        />
      )}

      <section className="relative z-10 w-full">
        <div className={`w-full container mx-auto ${SECTION_PX}`}>
          <div className="max-w-[1216px] flex flex-col gap-10 sm:gap-12 lgx:gap-14">
            {/* 1. What's Included */}
            <div className="flex flex-col xl:gap-[22px] gap-[20px]">
              <h2 className="text-dark font-heading text-[22px] xl:text-[30px] lgx:text-[28px] md:text-[26px] font-semibold xl:leading-[36px] lgx:leading-[32px] md:leading-[28px] leading-[24px]">
                {includedTitle}
              </h2>
              <div className="grid grid-cols-1 gap-2 md:gap-2.5 xl:gap-3">
                {includedItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-sm md:text-[15px] xl:text-base font-normal leading-4 md:leading-5 xl:leading-6"
                  >
                    <span className="text-accent select-none font-bold">✓</span>
                    <span className="text-nav-text">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. What's Not Included */}
            <div className="flex flex-col gap-5 sm:gap-6">
              <h2 className="text-dark font-heading text-[22px] xl:text-[30px] lgx:text-[28px] md:text-[26px] font-semibold xl:leading-[36px] lgx:leading-[32px] md:leading-[28px] leading-[24px]">
                {notIncludedTitle}
              </h2>
              <div className="grid grid-cols-1 gap-2 md:gap-2.5 xl:gap-3">
                {notIncludedItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-sm md:text-[15px] xl:text-base font-normal leading-4 md:leading-5 xl:leading-6"
                  >
                    <span className="text-muted select-none font-bold">✗</span>
                    <span className="text-nav-text">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Important Information Card */}
            {importantInfoItems.length > 0 && (
              <div className="w-full rounded-[10px] bg-[#F7F5F2] xl:p-8 lgx:p-7 md:p-6 p-5 flex flex-col xl:gap-4 md:gap-3.5 gap-3">
                <h3 className="text-dark font-heading xl:text-[20px] md:text-[18px] text-base font-semibold xl:leading-7 md:leading-6 leading-5">
                  {importantInfoTitle}
                </h3>
                <ul className="flex flex-col gap-2">
                  {importantInfoItems.map((info, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-nav-text text-xs md:text-[13px] xl:text-sm font-normal leading-4 md:leading-[18px] xl:leading-4"
                    >
                      <span className="select-none">•</span>
                      <span>{info}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
