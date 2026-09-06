/* =====================================================
   JOURNEYS — OVERVIEW TAB PREVIEW
   100% Pixel-Perfect Match with:
   frontend/components/journey-overview/overview-content.tsx
   Uses UniversalMultimediaPreview Single Source of Truth
===================================================== */

import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import {
  whyWeDesignedData,
  overviewListData,
  overviewGalleryData,
  convinceData,
} from "./journeyStaticData"
import type { Journey } from "../journeyTypes"

const TITLE_CSS =
  "text-title-light text-[26px] md:text-[32px] lgx:text-[36px] xl:text-[40px] font-heading font-semibold xl:leading-12 lgx:leading-[46px] md:leading-11 xl:tracking-[2px] tracking-[1.5px]"

const SECTION_PX = "px-4 lg:px-0"
const SECTION_GAP_BOTTOM = "pb-[65px] md:pb-[90px] lg:pb-[100px] xlg:pb-[110px] xl:pb-[120px]"

export function OverviewContentPreview({ draft }: { draft?: Journey }) {
  const overviewSection = (draft?.data?.overview as any) || {}
  const overviewBg = overviewSection?.backgroundMultimedia

  // Why We Designed This Journey data with static fallbacks
  const whyTitle = overviewSection?.whyTitle || whyWeDesignedData.title
  const whyParagraphs =
    overviewSection?.whyParagraphs && overviewSection.whyParagraphs.length > 0
      ? overviewSection.whyParagraphs
      : whyWeDesignedData.paragraphs
  const whySignature = overviewSection?.whySignature || whyWeDesignedData.signature

  // Journey Overview & Highlights data with static fallbacks
  const overviewTitle = overviewSection?.overviewTitle || overviewListData.title
  const titlegraphs =
    overviewSection?.titlegraphs && overviewSection.titlegraphs.length > 0
      ? overviewSection.titlegraphs
      : overviewListData.titlegraphs
  const highlightsTitle = overviewSection?.highlightsTitle || overviewListData.highlightsTitle
  const highlights =
    draft?.highlights && draft.highlights.length > 0
      ? draft.highlights
      : overviewSection?.highlights && overviewSection.highlights.length > 0
      ? overviewSection.highlights
      : overviewListData.highlights

  // Gallery data with static fallbacks
  const galleryTitle = overviewSection?.galleryTitle || overviewGalleryData.title
  const featuredImageSrc =
    draft?.journeyGallery?.[0] ||
    overviewSection?.featuredImage?.src ||
    overviewGalleryData.featuredImage.src
  const featuredImageAlt =
    overviewSection?.featuredImage?.alt ||
    overviewGalleryData.featuredImage.alt

  const secondaryImages =
    draft?.journeyGallery && draft.journeyGallery.length > 1
      ? draft.journeyGallery.slice(1, 5).map((url, idx) => ({
          src: url,
          alt: `Gallery image ${idx + 2}`,
        }))
      : overviewGalleryData.secondaryImages

  // Convince / Is this Journey for you?
  const convinceTitle = overviewSection?.convinceTitle || convinceData.title
  const convinceItems =
    draft?.perfectFor && draft.perfectFor.length > 0
      ? draft.perfectFor.map((pf) => `You are looking for: ${String(pf).replace(/_/g, " ")}`)
      : overviewSection?.convinceItems && overviewSection.convinceItems.length > 0
      ? overviewSection.convinceItems
      : convinceData.items

  return (
    <div className={`relative w-full flex flex-col xl:pt-[51px] pt-6 md:pt-11 lgx:pt-12 ${SECTION_GAP_BOTTOM}`}>
      {/* Background Universal Multimedia */}
      {overviewBg && (
        <UniversalMultimediaPreview
          multimedia={overviewBg}
          mode="background"
          className="h-full w-full object-cover"
          containerClassName="absolute inset-0 z-0 pointer-events-none"
        />
      )}

      {/* 1. Journey Overview & Highlights Section */}
      <section className="relative z-10 w-full">
        <div className={`w-full container mx-auto ${SECTION_PX}`}>
          <div className="max-w-[1216px] flex flex-col lgx:gap-11 xl:gap-12 md:gap-10 gap-8">
            {/* Why We Designed This Journey */}
            <div className="flex flex-col gap-5 md:gap-6 lgx:gap-7 xl:gap-8">
              <h2 className={TITLE_CSS}>{whyTitle}</h2>
              <div className="flex flex-col gap-3 md:gap-4 lgx:gap-5 xl:gap-6 text-nav-text text-sm md:text-[15px] xl:text-base font-normal leading-6 md:leading-[26.8px] xl:leading-[28.8px] tracking-[2px]">
                {whyParagraphs.map((paragraph: string, idx: number) => (
                  <p key={idx} className="whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}
                {whySignature && (
                  <p className="flex items-center justify-end font-heading text-accent text-xl md:text-2xl font-normal leading-7 tracking-[2px] pt-1 gap-2">
                    <span>{whySignature}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="13"
                      height="21"
                      viewBox="0 0 13 21"
                      fill="none"
                      className="w-[11px] h-[18px] md:w-[13px] md:h-[21px] shrink-0 text-accent"
                      aria-hidden="true"
                    >
                      <path
                        d="M6.5 0C6.5 6 9.5 10.5 13 10.5C9.5 10.5 6.5 15 6.5 21C6.5 15 3.5 10.5 0 10.5C3.5 10.5 6.5 6 6.5 0Z"
                        fill="currentColor"
                      />
                    </svg>
                  </p>
                )}
              </div>
            </div>

            {/* Title & Description */}
            <div className="flex flex-col gap-5 md:gap-6 lgx:gap-7 xl:gap-8">
              <h2 className={TITLE_CSS}>{overviewTitle}</h2>
              <div className="flex flex-col gap-3 md:gap-4 lgx:gap-5 xl:gap-6 text-nav-text text-sm md:text-[15px] xl:text-base font-normal leading-6 md:leading-[26.8px] xl:leading-[28.8px] tracking-[2px]">
                {titlegraphs.map((title: string, idx: number) => (
                  <p key={idx}>{title}</p>
                ))}
              </div>
            </div>

            {/* Highlights Grid */}
            <div className="flex flex-col gap-5 md:gap-6 lgx:gap-7 xl:gap-8 max-w-[1050px]">
              <h3 className={TITLE_CSS}>{highlightsTitle}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-4 gap-x-3 md:gap-y-[14px] gap-y-2.5">
                {highlights.map((highlight: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-start md:gap-[9px] gap-[7px] leading-4 md:leading-5 xl:leading-6 text-sm md:text-[15px]"
                  >
                    <span className="text-accent select-none font-bold">✓</span>
                    <span className="text-nav-text">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Gallery Section */}
      <section className="relative z-10 w-full xl:pt-[52px] pt-6 md:pt-11 lgx:pt-12">
        <div className={`w-full container mx-auto ${SECTION_PX} flex flex-col gap-6 md:gap-11 lgx:gap-12 xl:gap-[52px]`}>
          <h2 className={TITLE_CSS}>{galleryTitle}</h2>

          <div className="flex flex-col lg:flex-row items-stretch gap-6 xlg:gap-[34px] md:gap-7 xl:gap-[38px] w-full">
            {/* Featured Large Image (Left) */}
            <div className="relative w-full lg:w-1/2 min-h-[320px] md:min-h-[420px] xl:h-[498px] rounded-[6px] overflow-hidden group cursor-pointer">
              <UniversalMultimediaPreview
                multimedia={{
                  type: "image",
                  url: featuredImageSrc,
                  alt: featuredImageAlt,
                }}
                fallbackImageSrc={featuredImageSrc}
                fallbackAlt={featuredImageAlt}
                mode="background"
                className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                containerClassName="absolute inset-0"
              />
            </div>

            {/* 2x2 Secondary Images Grid (Right) */}
            <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6 xlg:gap-[34px] md:gap-7 xl:gap-[38px]">
              {secondaryImages.map((img: any, idx: number) => (
                <div
                  key={idx}
                  className="relative h-[200px] md:h-[231px] rounded-[6px] overflow-hidden group cursor-pointer"
                >
                  <UniversalMultimediaPreview
                    multimedia={{
                      type: "image",
                      url: img.src,
                      alt: img.alt,
                    }}
                    fallbackImageSrc={img.src}
                    fallbackAlt={img.alt}
                    mode="background"
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    containerClassName="absolute inset-0"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Convince / Is this Journey for you? Section */}
      <section className="relative z-10 w-full xl:pt-[52px] pt-6 md:pt-11 lgx:pt-12">
        <div className={`w-full container mx-auto ${SECTION_PX} flex flex-col gap-6 md:gap-7 xl:gap-8`}>
          <h2 className={TITLE_CSS}>{convinceTitle}</h2>

          <div className="w-full flex flex-wrap items-center gap-y-2">
            {convinceItems.map((item: string, idx: number) => (
              <div
                key={idx}
                className={`flex items-center gap-2.5 ${
                  idx !== convinceItems.length - 1 ? "border-r border-accent pr-4 mr-4" : ""
                }`}
              >
                <span className="text-accent text-lg md:text-xl font-normal leading-none shrink-0 select-none">
                  ✓
                </span>
                <span className="text-nav-text text-sm md:text-[15px] xl:text-base font-normal leading-5 md:leading-[22px] xl:leading-6 tracking-[0.5px]">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
