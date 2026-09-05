/* =====================================================
   HERO — PREVIEW SECTION
   Auto-migrated from the legacy LocationPreview.tsx monolith.===================================================== */

import type { LocationData } from "../../locationTypes"
import { getLocationBasics, FALLBACK_IMAGE } from "../../shared/previewBasics"
import { ArrowDownRight } from "lucide-react"
import { UniversalMultimediaPreview } from "../../../CMS/Home/shared/preview/UniversalMultimediaPreview"
import { fieldCssStyle } from "../../../CMS/shared/fieldStyle"

export type HeroPreviewProps = {
  draft: LocationData | null
}

export function HeroPreview({ draft }: HeroPreviewProps) {
  const { data, name, description } = getLocationBasics(draft)

  const hero = data.hero ?? {}

  const heroTitle = hero.title || `Discover ${name}`
  const heroDescription = hero.description || description
  const heroBreadcrumb =
    hero.breadcrumb || `DESTINATIONS / ${name.toUpperCase()}`
  const heroImage = hero.background_image || FALLBACK_IMAGE
  const videoUrl = hero.video || ""
  const shouldShowVideo = Boolean(hero.showVideo && videoUrl)
  const heroButton = hero.button ?? {}
  const rawButtons = Array.isArray((hero as any).buttons)
    ? (hero as any).buttons
    : heroButton.name
      ? [
          {
            label: heroButton.name,
            url: heroButton.url,
            style: "primary",
          },
        ]
      : []

  return (
    <section className="relative flex w-full items-center overflow-hidden bg-black text-white md:h-[720px] lg:h-[740px] xl:h-[768px]">
      {hero.backgroundMultimedia ? (
        <UniversalMultimediaPreview
          multimedia={hero.backgroundMultimedia}
          mode="background"
          className="absolute inset-0"
          containerClassName="absolute inset-0"
        />
      ) : shouldShowVideo ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={videoUrl}
          poster={heroImage}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        />
      ) : (
        <img
          src={heroImage}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE
          }}
        />
      )}

      <div
        className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex h-full w-full flex-col justify-end px-5 pb-9 sm:px-8 sm:pb-12 md:px-14 md:pb-16 lg:pr-[96px] lg:pl-[96px] xl:pr-[136px] xl:pl-[136px]">
        <div className="flex w-full max-w-[880px] flex-col items-start">
          {heroBreadcrumb && (
            <p
              className="mb-3 text-[10px] font-semibold tracking-[0.22em] text-white/75 uppercase sm:text-xs md:text-[15px]"
              style={fieldCssStyle((hero as any).breadcrumbStyle)}
            >
              {heroBreadcrumb}
            </p>
          )}

          {heroTitle && (
            <h1
              className="mb-4 max-w-5xl font-serif text-[42px] leading-[0.95] font-medium tracking-[-0.04em] text-white sm:text-[50px] md:text-[58px] lg:text-[66px] xl:text-[72px]"
              style={fieldCssStyle((hero as any).titleStyle)}
            >
              {heroTitle}
            </h1>
          )}

          {heroDescription && (
            <p
              className="max-w-[760px] text-sm leading-[1.8] font-normal text-white/75 sm:text-base md:text-[17px]"
              style={fieldCssStyle((hero as any).descriptionStyle)}
            >
              {heroDescription}
            </p>
          )}

          {rawButtons.length > 0 && (
            <div className="mt-8 flex flex-row flex-wrap items-center gap-3">
              {rawButtons.map((btn: any, idx: number) => {
                const isPrimary = !btn.style || btn.style === "primary"
                const defaultBg = isPrimary ? "#FFFFFF" : "transparent"
                const defaultText = isPrimary ? "#000000" : "#FFFFFF"
                const defaultBorder = isPrimary
                  ? "none"
                  : "1px solid rgba(255, 255, 255, 0.3)"

                return (
                  <a
                    key={`${btn.label || btn.name}-${idx}`}
                    href={btn.url || "#"}
                    className="inline-flex min-h-[40px] items-center gap-3 rounded-full px-6 text-[11px] font-medium tracking-[0.15em] uppercase transition hover:opacity-85"
                    style={{
                      backgroundColor: btn.backgroundColor || defaultBg,
                      color: btn.textColor || defaultText,
                      border: btn.backgroundColor ? "none" : defaultBorder,
                    }}
                  >
                    {btn.label || btn.name || "Button"}
                    <ArrowDownRight className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
