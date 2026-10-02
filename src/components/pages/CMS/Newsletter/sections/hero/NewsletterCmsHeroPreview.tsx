import { normalizeNewsletterCmsHero } from "./normalizeNewsletterCmsHero"
import type { NewsletterCmsPayload } from "../../newsletterCmsTypes"
import { Image as ImageIcon } from "lucide-react"

export function NewsletterCmsHeroPreview({ draft }: { draft: NewsletterCmsPayload }) {
  const hero = normalizeNewsletterCmsHero(draft?.data?.hero || (draft as any)?.hero)

  const titleText = hero.title?.value || "A Curated Travel Perspective"
  const titleColor = hero.title?.textColor || "#182D09"

  const subtitleText =
    hero.subtitle?.value ||
    "Thoughtful dispatches featuring curated Balkan travel inspiration, MIRA Stories, regional travel insights, and selected journeys."
  const subtitleColor = hero.subtitle?.textColor || "#565E69"

  const emailLabelText = hero.emailLabel?.value || "Enter your email address"
  const emailLabelColor = hero.emailLabel?.textColor || "#182D09"

  const buttonText = hero.buttonText || "Subscribe"
  const inputPlaceholder = hero.inputPlaceholder || "Insert your email here"

  const exploreJourneysLabel = hero.links?.exploreJourneys?.label || "Explore journeys"
  const returnHomeLabel = hero.links?.returnHome?.label || "Return Home"

  const imageUrl = hero.backgroundMultimedia?.image?.url || hero.image?.url || ""

  return (
    <section className="relative w-full overflow-hidden bg-background text-foreground py-16 px-4 md:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 w-full">
          {/* Left Column: Image */}
          <div className="w-full lg:w-[48%] shrink-0 flex flex-col justify-start items-start">
            <div className="relative w-full aspect-[665/581] max-h-[500px] overflow-hidden rounded-sm shadow-sm bg-muted flex items-center justify-center">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Newsletter expedition showcase"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground/60">
                  <ImageIcon className="h-10 w-10 mb-2 opacity-50" />
                  <span className="text-xs font-medium">No Showcase Image Uploaded</span>
                  <span className="text-[11px] opacity-70">Use Universal Multimedia form to upload</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Content Box */}
          <div className="w-full lg:w-[52%] flex flex-col justify-center items-start">
            {/* Star Icon Mark */}
            <div className="mb-2">
              <svg
                width="40"
                height="65"
                viewBox="0 0 57 95"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-auto opacity-40 text-primary"
              >
                <path
                  d="M28.5 0L35 30L65 35L35 40L28.5 70L22 40L-8 35L22 30L28.5 0Z"
                  fill="currentColor"
                />
              </svg>
            </div>

            {/* Title */}
            <h1
              className="text-[28px] md:text-[36px] font-extralight font-serif leading-tight tracking-tight mb-3"
              style={{ color: titleColor }}
            >
              {titleText}
            </h1>

            {/* Subtitle */}
            <p
              className="text-sm md:text-base font-normal leading-relaxed max-w-[500px] mb-6"
              style={{ color: subtitleColor }}
            >
              {subtitleText}
            </p>

            {/* Divider */}
            <div className="w-full border-t border-border/40 my-4" />

            {/* Form Area */}
            <div className="w-full flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label
                  className="text-xs md:text-sm font-normal tracking-wide"
                  style={{ color: emailLabelColor }}
                >
                  {emailLabelText}
                </label>
                <div className="h-12 w-full px-4 bg-[#FFF2EF] rounded-sm border border-border/60 flex items-center">
                  <input
                    type="email"
                    disabled
                    placeholder={inputPlaceholder}
                    className="w-full bg-transparent text-xs md:text-sm text-foreground/80 outline-none"
                  />
                </div>
              </div>

              <button
                type="button"
                className="h-12 w-full bg-primary text-primary-foreground font-medium text-xs md:text-sm rounded-sm transition hover:opacity-90 cursor-default"
              >
                {buttonText}
              </button>

              <div className="flex items-center justify-between pt-1 text-xs text-foreground/70 underline">
                <span>{exploreJourneysLabel}</span>
                <span>{returnHomeLabel}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NewsletterCmsHeroPreview
