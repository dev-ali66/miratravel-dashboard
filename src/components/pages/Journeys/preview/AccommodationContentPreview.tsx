/* =====================================================
   JOURNEYS — ACCOMMODATION TAB PREVIEW
   100% Pixel-Perfect Match with:
   frontend/components/journey-overview/accommodation-content.tsx &
   frontend/components/shared/accommodation-stays.tsx
   Uses UniversalMultimediaPreview Single Source of Truth
===================================================== */

import { useState, useEffect, useCallback } from "react"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import { fieldCssStyle, type FieldStyleValue } from "@/components/pages/CMS/shared/fieldStyle"
import { accommodationData } from "./journeyStaticData"
import { getJourneyAccommodationStays, type Journey } from "../journeyTypes"

const SECTION_PX = "px-4 lg:px-0"

function PrincipleIcon({ type }: { type: string }) {
  switch (type) {
    case "character":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none" className="w-full h-full">
          <path d="M14 3C14 3 5 9 5 16C5 18.3869 5.94821 20.6761 7.63604 22.364C9.32387 24.0518 11.6131 25 14 25C16.3869 25 18.6761 24.0518 20.364 22.364C22.0518 20.6761 23 18.3869 23 16C23 9 14 3 14 3Z" stroke="#A8825A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 16C14.5304 16 15.0391 15.7893 15.4142 15.4142C15.7893 15.0391 16 14.5304 16 14C16 13.4696 15.7893 12.9609 15.4142 12.5858C15.0391 12.2107 14.5304 12 14 12C13.4696 12 12.9609 12.2107 12.5858 12.5858C12.2107 12.9609 12 13.4696 12 14C12 14.5304 12.2107 15.0391 12.5858 15.4142C12.9609 15.7893 13.4696 16 14 16Z" stroke="#A8825A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case "location":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none" className="w-full h-full">
          <path d="M14 24C19.5228 24 24 19.5228 24 14C24 8.47715 19.5228 4 14 4C8.47715 4 4 8.47715 4 14C4 19.5228 8.47715 24 14 24Z" stroke="#A8825A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 4V24M4 14H24" stroke="#A8825A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 7.5C9 11 11 13 14 14C17 13 19 11 21 7.5" stroke="#A8825A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 20.5C9 17 11 15 14 14C17 15 19 17 21 20.5" stroke="#A8825A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case "comfort":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none" className="w-full h-full">
          <path d="M4 20V10L14 3L24 10V20" stroke="#A8825A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18 14H10V22H18V14Z" stroke="#A8825A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 14V22" stroke="#A8825A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case "connection":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none" className="w-full h-full">
          <path d="M14 5C10.7 5 8 7.7 8 11C8 15 14 23 14 23C14 23 20 15 20 11C20 7.7 17.3 5 14 5Z" stroke="#A8825A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 13C15.1046 13 16 12.1046 16 11C16 9.89543 15.1046 9 14 9C12.8954 9 12 9.89543 12 11C12 12.1046 12.8954 13 14 13Z" stroke="#A8825A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A8825A" strokeWidth="1.5">
          <circle cx="12" cy="12" r="9" />
        </svg>
      )
  }
}

export function AccommodationContentPreview({ draft }: { draft?: Journey }) {
  const accommodationSection = (draft?.data?.accommodation as any) || {}
  const accommodationBg = accommodationSection?.backgroundMultimedia

  // Philosophy data with static fallbacks
  const { philosophy, destinations, standards, visualReference } = accommodationData
  const philSec = accommodationSection?.philosophySection || {}

  const philosophyBadge = philSec.eyebrow?.text ?? philosophy.badge
  const philosophyBadgeStyle = philSec.eyebrow?.style
  
  const philosophyTitle = philSec.title?.text ?? philosophy.title
  const philosophyTitleStyle = philSec.title?.style

  const philosophyDescription = philSec.description?.text ?? philosophy.description
  const philosophyDescriptionStyle = philSec.description?.style

  const principles =
    philSec.items && philSec.items.length > 0
      ? philSec.items.map((item: any) => ({
          title: item.title?.text ?? "",
          titleStyle: item.title?.style,
          description: item.description?.text ?? "",
          descriptionStyle: item.description?.style,
          iconMultimedia: item.iconMultimedia,
        }))
      : philosophy.principles

  // Stays data with static fallbacks
  const draftStays = draft ? getJourneyAccommodationStays(draft) : []
  const accSec = accommodationSection?.accommodationSection || {}
  
  const destinationsBadge = accSec.eyebrow?.text ?? accommodationSection?.destinationsBadge ?? destinations.badge
  const destinationsBadgeStyle = accSec.eyebrow?.style
  const destinationsTitle = accSec.title?.text ?? accommodationSection?.destinationsTitle ?? destinations.title
  const destinationsTitleStyle = accSec.title?.style
  const destinationsDescription = accSec.description?.text ?? accommodationSection?.destinationsDescription ?? destinations.description
  const destinationsDescriptionStyle = accSec.description?.style

  const newAccItems = accSec.items || []

  const stays =
    newAccItems.length > 0
      ? newAccItems.map((s: any, idx: number) => ({
          step: `DAY 0${idx + 1}`,
          duration: s.nights?.text ? `${s.nights.text} ${s.nights.text == "1" ? "NIGHT" : "NIGHTS"}` : "1 NIGHT",
          durationStyle: s.nights?.style,
          city: s.hotelName?.text ?? s.location?.text ?? `Property ${idx + 1}`,
          cityStyle: s.hotelName?.style,
          stayType: s.roomType?.text ?? "Boutique Stay",
          stayTypeStyle: s.roomType?.style,
          boardBasis: s.boardBasis?.text ?? "",
          boardBasisStyle: s.boardBasis?.style,
          description: s.description?.text ?? "A serene sanctuary chosen for genuine warmth, authentic regional gastronomy, and unmatched tranquility.",
          descriptionStyle: s.description?.style,
          multimedia: s.multimedia,
          confirmedBy: "Personally confirmed by Mira",
          image: s.multimedia?.url ?? "/images/albania-journey6.jpg",
        }))
      : draftStays.length > 0
      ? draftStays.map((s, idx) => ({
          step: s.step || `DAY 0${idx + 1}`,
          duration: s.duration || `${s.nights || 1} ${s.nights === 1 ? "NIGHT" : "NIGHTS"}`,
          city: s.location || s.hotelName || `Stop ${idx + 1}`,
          stayType: s.roomType || s.stayType || "Boutique Heritage Stay",
          description: s.description || "A serene sanctuary chosen for genuine warmth, authentic regional gastronomy, and unmatched tranquility.",
          image: s.images?.[0] || s.image || "/images/albania-journey6.jpg",
          confirmedBy: "Personally confirmed by Mira",
        }))
      : destinations.stays

  // Standards data with static fallbacks
  const stdSec = accommodationSection?.standardsSection || {}
  const standardsBadge = stdSec.eyebrow?.text ?? accommodationSection?.standardsBadge ?? standards.badge
  const standardsBadgeStyle = stdSec.eyebrow?.style
  const standardsTitle = stdSec.title?.text ?? accommodationSection?.standardsTitle ?? standards.title
  const standardsTitleStyle = stdSec.title?.style
  const standardsDescription = stdSec.description?.text ?? accommodationSection?.standardsDescription ?? standards.description
  const standardsDescriptionStyle = stdSec.description?.style
  
  const expectations =
    stdSec.items && stdSec.items.length > 0
      ? stdSec.items
      : accommodationSection?.expectations && accommodationSection.expectations.length > 0
      ? accommodationSection.expectations.map((exp: string) => ({ title: { text: exp } }))
      : standards.expectations.map((exp: string) => ({ title: { text: exp } }))

  // Visual Reference gallery
  const visSec = accommodationSection?.visualsSection || {}
  const visualsBadge = visSec.eyebrow?.text ?? accommodationSection?.visualsBadge ?? visualReference.badge
  const visualsBadgeStyle = visSec.eyebrow?.style
  const visualsTitle = visSec.title?.text ?? accommodationSection?.visualsTitle ?? visualReference.title
  const visualsTitleStyle = visSec.title?.style
  const visualsDescription = visSec.description?.text
  const visualsDescriptionStyle = visSec.description?.style

  let allGalleryImages = [visualReference.featuredImage, ...visualReference.galleryImages]
  if (visSec.mediaItems && visSec.mediaItems.length > 0) {
    allGalleryImages = visSec.mediaItems.map((m: any) => ({
      src: m.url || "",
      alt: m.alt || "Visual Reference",
      multimedia: m
    }))
  }

  const galleryPages: { featured: any; stacked: any[] }[] = []
  for (let i = 0; i < allGalleryImages.length; i += 3) {
    const chunk = allGalleryImages.slice(i, i + 3)
    galleryPages.push({
      featured: chunk[0],
      stacked: chunk.slice(1),
    })
  }

  const [galleryPage, setGalleryPage] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const nextGalleryPage = useCallback(() => {
    if (galleryPages.length <= 1) return
    setGalleryPage((prev) => (prev + 1) % galleryPages.length)
  }, [galleryPages.length])

  const prevGalleryPage = useCallback(() => {
    if (galleryPages.length <= 1) return
    setGalleryPage((prev) => (prev - 1 + galleryPages.length) % galleryPages.length)
  }, [galleryPages.length])

  useEffect(() => {
    if (galleryPages.length <= 1 || isHovered) return
    const timer = setInterval(() => {
      nextGalleryPage()
    }, 5000)
    return () => clearInterval(timer)
  }, [galleryPages.length, isHovered, nextGalleryPage])

  const currentPage = galleryPages[galleryPage] || galleryPages[0]

  return (
    <div className="relative w-full flex flex-col xl:pt-[51px] pt-6 md:pt-11 lgx:pt-12 pb-16">
      {/* Background Universal Multimedia */}
      {accommodationBg && (
        <UniversalMultimediaPreview
          multimedia={accommodationBg}
          mode="background"
          className="h-full w-full object-cover"
          containerClassName="absolute inset-0 z-0 pointer-events-none"
        />
      )}

      {/* 1. Our Philosophy Section */}
      <section className="relative z-10 w-full">
        <div className={`w-full container mx-auto ${SECTION_PX}`}>
          <div className="max-w-[1216px] flex flex-col gap-5">
            {/* Section Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 md:gap-6 pb-6 md:pb-8">
              <div className="flex flex-col xl:gap-4 lg:gap-3 gap-2.5 max-w-[405px]">
                <span 
                  className="text-accent text-sm md:text-[15px] xl:text-base font-semibold uppercase tracking-[3px] xl:tracking-[3.3px] xl:leading-[16.5px] md:leading-[14.5px] leading-[12.5px]"
                  style={fieldCssStyle(philosophyBadgeStyle as FieldStyleValue)}
                >
                  {philosophyBadge}
                </span>
                <h2 
                  className="text-title text-[30px] md:text-[36px] lgx:text-[40px] xl:text-[46px] font-semibold xl:leading-[68px] lgx:leading-[64px] md:leading-[60px] leading-[56px] font-heading"
                  style={fieldCssStyle(philosophyTitleStyle as FieldStyleValue)}
                >
                  {philosophyTitle}
                </h2>
              </div>
              <p 
                className="text-subtitle text-sm md:text-[15px] xl:text-base font-normal xl:leading-[28.8px] md:leading-[26.8px] leading-6 max-w-[624px]"
                style={fieldCssStyle(philosophyDescriptionStyle as FieldStyleValue)}
              >
                {philosophyDescription}
              </p>
            </div>

            {/* 4 Principles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:pb-[60px] md:pb-12 lgx:pb-14 pb-8 border-b-[0.5px] border-stroke gap-4 sm:gap-6">
              {principles.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex flex-col gap-6 xl:gap-[30px] md:p-6 p-4 rounded-[4px] border border-border-light bg-neutral-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xs"
                >
                  <div className="size-12 rounded-full border border-stroke flex items-center justify-center p-2.5 overflow-hidden">
                    {item.iconMultimedia && item.iconMultimedia.url ? (
                      <UniversalMultimediaPreview
                        multimedia={item.iconMultimedia}
                        mode="inline"
                        className="w-full h-full object-contain"
                        containerClassName="w-full h-full flex items-center justify-center"
                      />
                    ) : (
                      <PrincipleIcon type={item.icon} />
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 
                      className="text-title text-[18px] md:text-[20px] xl:text-[22px] font-medium leading-7 font-heading"
                      style={fieldCssStyle(item.titleStyle as FieldStyleValue)}
                    >
                      {item.title}
                    </h3>
                    <p 
                      className="text-subtitle text-xs md:text-[13px] xl:text-sm font-normal leading-5 md:leading-6"
                      style={fieldCssStyle(item.descriptionStyle as FieldStyleValue)}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Your Accommodation Journey (Destination by Destination) */}
      <section className="relative z-10 w-full xl:pt-12 lgx:pt-10 md:pt-8 pt-6">
        <div className={`w-full container mx-auto ${SECTION_PX}`}>
          <div className="max-w-[1216px] flex flex-col gap-8 md:gap-12">
            {/* Section Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 md:gap-6 pb-6 md:pb-8">
              <div className="flex flex-col xl:gap-4 lg:gap-3 gap-2.5 max-w-[515px]">
                <span 
                  className="text-accent text-sm md:text-[15px] xl:text-base font-semibold uppercase tracking-[3px] xl:tracking-[3.3px] xl:leading-[16.5px] md:leading-[14.5px] leading-[12.5px]"
                  style={fieldCssStyle(destinationsBadgeStyle as FieldStyleValue)}
                >
                  {destinationsBadge}
                </span>
                <h2 
                  className="text-title text-[30px] md:text-[36px] lgx:text-[40px] xl:text-[46px] tracking-[1px] xl:leading-[68px] lgx:leading-[64px] md:leading-[60px] leading-[56px] font-heading font-semibold"
                  style={fieldCssStyle(destinationsTitleStyle as FieldStyleValue)}
                >
                  {destinationsTitle}
                </h2>
              </div>
              <p 
                className="text-subtitle text-sm md:text-[15px] xl:text-base font-normal xl:leading-[28.8px] md:leading-[26.8px] leading-6 max-w-[515px]"
                style={fieldCssStyle(destinationsDescriptionStyle as FieldStyleValue)}
              >
                {destinationsDescription}
              </p>
            </div>

            {/* Stays List */}
            <div className="flex flex-col gap-6 lgx:gap-7 xl:gap-8 xl:pb-[108px] lgx:pb-24 md:pb-20 pb-12">
              {stays.map((stay: any, idx: number) => {
                const stepLabel = stay.step || `0${idx + 1}`
                const durationLabel = stay.duration || ""
                const locationTitle = stay.city || stay.hotelName || ""
                const staySubtitle = stay.stayType || ""
                const confirmedText = stay.confirmedBy || "Personally confirmed by Mira"

                return (
                  <div
                    key={idx}
                    className="w-full overflow-hidden bg-neutral-100 grid grid-cols-1 lg:grid-cols-12 group transition-all duration-300 border border-border-light rounded-[4px]"
                  >
                    {/* Image Container */}
                    <div className="relative w-full min-h-[260px] md:min-h-[320px] xl:min-h-[334px] lg:col-span-5 overflow-hidden">
                      <UniversalMultimediaPreview
                        multimedia={stay.multimedia || {
                          type: "image",
                          url: stay.image,
                          alt: locationTitle,
                        }}
                        fallbackImageSrc={stay.image}
                        fallbackAlt={locationTitle}
                        mode="background"
                        className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                        containerClassName="absolute inset-0"
                      />
                    </div>

                    {/* Content Container */}
                    <div className="p-6 md:p-8 lgx:p-10 xl:p-12 lg:col-span-7 flex flex-col justify-between gap-6">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-4 text-accent text-xs md:text-[13px] xl:text-sm uppercase md:leading-[16.5px] leading-[14.5px] xl:tracking-[2px] tracking-[1.5px]">
                          <span>{stepLabel}</span>
                          {durationLabel && <span style={fieldCssStyle(stay.durationStyle as FieldStyleValue)}>• {durationLabel}</span>}
                          {stay.boardBasis && <span style={fieldCssStyle(stay.boardBasisStyle as FieldStyleValue)}>• {stay.boardBasis}</span>}
                        </div>
                        <div>
                          <h3 
                            className="text-title text-2xl md:text-[26px] lgx:text-[30px] xl:text-[32px] font-medium xl:leading-10 lgx:leading-9 md:leading-8 leading-7 xl:tracking-[3px] tracking-[2px] font-heading"
                            style={fieldCssStyle(stay.cityStyle as FieldStyleValue)}
                          >
                            {locationTitle}
                          </h3>
                          {staySubtitle && (
                            <span 
                              className="text-accent text-xs md:text-[13px] xl:text-sm uppercase mt-1 block xl:leading-[19.5px] md:leading-[17.5px] leading-[15.5px] xl:tracking-[1.95px] tracking-[1.5px]"
                              style={fieldCssStyle(stay.stayTypeStyle as FieldStyleValue)}
                            >
                              {staySubtitle}
                            </span>
                          )}
                        </div>
                        <p 
                          className="text-subtitle text-sm md:text-[15px] xl:text-base font-normal xl:leading-[28.8px] md:leading-[26.8px] leading-[24.8px] xl:mt-6 md:mt-5 mt-4"
                          style={fieldCssStyle(stay.descriptionStyle as FieldStyleValue)}
                        >
                          {stay.description}
                        </p>
                      </div>

                      <div className="pt-6 border-t border-black/10 flex items-center gap-2 text-accent text-xs md:text-[13px] xl:text-sm font-medium xl:tracking-[1.8px] tracking-[1.5px] leading-4 md:leading-[18px] uppercase">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                          <path d="M8 9C9.65685 9 11 7.65685 11 6C11 4.34315 9.65685 3 8 3C6.34315 3 5 4.34315 5 6C5 7.65685 6.34315 9 8 9Z" stroke="#AF6348" strokeWidth="1.2" strokeLinecap="round" />
                          <path d="M8 1C5.2 1 3 3.2 3 6C3 10 8 15 8 15C8 15 13 10 13 6C13 3.2 10.8 1 8 1Z" stroke="#AF6348" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                        <span>{confirmedText}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Standards Section */}
      <section className="relative z-10 w-full border-t border-stroke xl:pt-12 md:pt-10 pt-8">
        <div className={`w-full container mx-auto ${SECTION_PX}`}>
          <div className="max-w-[1216px] flex flex-col gap-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 md:gap-6">
              <div className="flex flex-col xl:gap-3 gap-2 max-w-[500px]">
                <span 
                  className="text-accent text-sm md:text-[15px] xl:text-base font-semibold uppercase tracking-[3px]"
                  style={fieldCssStyle(standardsBadgeStyle as FieldStyleValue)}
                >
                  {standardsBadge}
                </span>
                <h2 
                  className="text-title text-[28px] md:text-[34px] xl:text-[40px] font-heading font-semibold"
                  style={fieldCssStyle(standardsTitleStyle as FieldStyleValue)}
                >
                  {standardsTitle}
                </h2>
              </div>
              <p 
                className="text-subtitle text-sm md:text-[15px] xl:text-base max-w-[500px]"
                style={fieldCssStyle(standardsDescriptionStyle as FieldStyleValue)}
              >
                {standardsDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {expectations.map((exp: any, idx: number) => (
                <div
                  key={idx}
                  className="rounded-[8px] bg-neutral-100 p-5 md:p-6 border border-border-light flex flex-col gap-2 shadow-2xs"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="size-2 rounded-full bg-accent shrink-0" />
                    <span 
                      className="text-nav-text text-sm md:text-[15px] font-medium"
                      style={fieldCssStyle(exp.title?.style as FieldStyleValue)}
                    >
                      {exp.title?.text ?? ""}
                    </span>
                  </div>
                  {exp.description?.text && (
                    <p 
                      className="text-subtitle text-xs md:text-sm pl-[22px] font-normal leading-relaxed"
                      style={fieldCssStyle(exp.description?.style as FieldStyleValue)}
                    >
                      {exp.description.text}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Visual Reference Gallery Section */}
      {currentPage && (
        <section
          className="relative z-10 w-full xl:pt-16 md:pt-12 pt-8"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className={`w-full container mx-auto ${SECTION_PX}`}>
            <div className="max-w-[1216px] flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <span 
                    className="text-accent text-sm font-semibold uppercase tracking-[3px] block"
                    style={fieldCssStyle(visualsBadgeStyle as FieldStyleValue)}
                  >
                    {visualsBadge}
                  </span>
                  <h3 
                    className="text-title text-2xl md:text-3xl font-heading font-semibold mt-1"
                    style={fieldCssStyle(visualsTitleStyle as FieldStyleValue)}
                  >
                    {visualsTitle}
                  </h3>
                  {visualsDescription && (
                    <p 
                      className="text-subtitle text-sm md:text-base mt-2 max-w-[600px]"
                      style={fieldCssStyle(visualsDescriptionStyle as FieldStyleValue)}
                    >
                      {visualsDescription}
                    </p>
                  )}
                </div>

                {galleryPages.length > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={prevGalleryPage}
                      className="size-9 rounded-full border border-border-light flex items-center justify-center text-dark hover:bg-neutral-200 transition cursor-pointer"
                      aria-label="Previous image set"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={nextGalleryPage}
                      className="size-9 rounded-full border border-border-light flex items-center justify-center text-dark hover:bg-neutral-200 transition cursor-pointer"
                      aria-label="Next image set"
                    >
                      →
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Featured Large */}
                <div className="lg:col-span-8 min-h-[300px] md:min-h-[380px] xl:min-h-[440px] rounded-[8px] overflow-hidden relative group">
                  <UniversalMultimediaPreview
                    multimedia={currentPage.featured.multimedia || {
                      type: "image",
                      url: currentPage.featured.src,
                      alt: currentPage.featured.alt,
                    }}
                    fallbackImageSrc={currentPage.featured.src}
                    fallbackAlt={currentPage.featured.alt}
                    mode="background"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    containerClassName="absolute inset-0"
                  />
                </div>

                {/* Stacked 2 Images */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  {currentPage.stacked.map((img: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex-1 min-h-[140px] md:min-h-[180px] rounded-[8px] overflow-hidden relative group"
                    >
                      <UniversalMultimediaPreview
                        multimedia={img.multimedia || {
                          type: "image",
                          url: img.src,
                          alt: img.alt,
                        }}
                        fallbackImageSrc={img.src}
                        fallbackAlt={img.alt}
                        mode="background"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        containerClassName="absolute inset-0"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
