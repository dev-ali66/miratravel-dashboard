/* =====================================================
   CARD — PREVIEW SECTION
   The real frontend uses a standard card CTA with a fixed
   arrow icon, not a CMS-controlled custom icon.
===================================================== */

import { ArrowUpRight } from "lucide-react"
import type { LocationData } from "../../locationTypes"
import { getLocationBasics, FALLBACK_IMAGE } from "../../shared/previewBasics"
import { UniversalMultimediaPreview } from "../../../CMS/Home/shared/preview/UniversalMultimediaPreview"
import { fieldCssStyle } from "../../../CMS/shared/fieldStyle"

export type CardPreviewProps = {
  draft: LocationData | null
}

export function CardPreview({ draft }: CardPreviewProps) {
  const { data, name } = getLocationBasics(draft)
  const card = data.card ?? {}

  return (
    <div className="mx-auto max-w-sm overflow-hidden rounded-2xl border border-border/60">
      <div className="relative h-48 w-full">
        {card.backgroundMultimedia ? (
          <UniversalMultimediaPreview
            multimedia={card.backgroundMultimedia}
            mode="background"
            className="h-full w-full"
            containerClassName="absolute inset-0"
          />
        ) : (
          <img
            src={card.background_image || FALLBACK_IMAGE}
            alt={card.title || name}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = FALLBACK_IMAGE
            }}
          />
        )}
      </div>

      <div className="space-y-2 p-4">
        <h3
          className="text-lg font-medium"
          style={fieldCssStyle((card as any).titleStyle)}
        >
          {card.title || name}
        </h3>

        {card.subtitle && (
          <p
            className="text-sm text-muted-foreground"
            style={fieldCssStyle((card as any).subtitleStyle)}
          >
            {card.subtitle}
          </p>
        )}

        <a
          href={card.button?.url || "#"}
          className="mt-2 inline-flex items-center gap-1 text-xs font-medium tracking-wide text-primary uppercase"
          onClick={(event) => {
            if (!card.button?.url) {
              event.preventDefault()
            }
          }}
        >
          {card.button?.label || "Explore"}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  )
}
