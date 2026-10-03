import { useState } from "react"
import { normalizeNewsletterCmsUnsubscribe } from "./normalizeUnsubscribe"
import type { NewsletterCmsPayload } from "../../newsletterCmsTypes"

interface UnsubscribePreviewProps {
  draft: NewsletterCmsPayload
}

export function UnsubscribePreview({ draft }: UnsubscribePreviewProps) {
  const unsubscribe = normalizeNewsletterCmsUnsubscribe(
    (draft?.data as any)?.unsubscribe || draft?.unsubscribe || (draft as any)?.data
  )
  const unSubAny = unsubscribe as any

  const [selectedReason, setSelectedReason] = useState<string>("")
  const [testEmail, setTestEmail] = useState<string>("traveler@example.com")
  const [isUnsubscribed, setIsUnsubscribed] = useState<boolean>(false)

  const mediaUrl =
    unsubscribe.leftSideMultimedia?.image?.url ||
    unsubscribe.leftSideMultimedia?.url ||
    ""

  return (
    <section className="relative w-full overflow-hidden bg-background text-foreground pt-12 pb-16 px-4 md:px-8">
      <div className="container mx-auto max-w-[1400px]">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14 w-full">
          {/* Left Media Column */}
          <div className="w-full lg:w-[480px] xl:w-[580px] shrink-0 flex flex-col justify-start items-start">
            <div className="relative w-full aspect-[665/581] max-h-[500px] overflow-hidden rounded-md bg-muted flex items-center justify-center border border-border/40">
              {mediaUrl ? (
                <img
                  src={mediaUrl}
                  alt={unsubscribe.leftSideMultimedia?.image?.alt || "Reflective traveler"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
                  <svg
                    className="w-12 h-12 mb-2 text-muted-foreground/40"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-xs font-medium">Showcase Image Placeholder</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Content Form Column */}
          <div className="w-full lg:w-[560px] xl:w-[680px] flex flex-col justify-center items-start">
            {/* Title */}
            <h1
              className="text-2xl md:text-3xl font-extralight font-heading leading-tight tracking-tight mb-3"
              style={{
                color: isUnsubscribed
                  ? unsubscribe.unsubscribedTitle?.textColor || "inherit"
                  : unsubscribe.title?.textColor || "inherit",
              }}
            >
              {isUnsubscribed
                ? unsubscribe.unsubscribedTitle?.value || "You're Unsubscribed"
                : unsubscribe.title?.value || "We're Sorry to See You Go"}
            </h1>

            {/* Subtitle */}
            <p
              className="text-sm md:text-base leading-relaxed mb-6"
              style={{
                color: isUnsubscribed
                  ? unsubscribe.unsubscribedSubtitle?.textColor || "#565E69"
                  : unsubscribe.subtitle?.textColor || "#565E69",
              }}
            >
              {isUnsubscribed
                ? unsubscribe.unsubscribedSubtitle?.value ||
                  "You have been removed from our dispatch list."
                : unsubscribe.subtitle?.value ||
                  "If our travel dispatches no longer inspire your adventures..."}
            </p>

            <div className="w-full h-px border-t border-border/40 my-4" />

            {!isUnsubscribed ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setIsUnsubscribed(true)
                }}
                className="w-full flex flex-col gap-4"
              >
                {/* Email Input Field */}
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-xs md:text-sm font-medium"
                    style={{ color: unSubAny.emailLabel?.textColor || "inherit" }}
                  >
                    {unSubAny.emailLabel?.value || "Enter your email address"}
                  </label>
                  <div className="h-11 px-4 bg-[#FFF2EF] rounded-sm outline outline-1 outline-border flex items-center">
                    <input
                      type="email"
                      required
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder={unSubAny.inputPlaceholder || "xmpl@gmail.com"}
                      className="w-full bg-transparent text-[#565E69] text-xs md:text-sm outline-none"
                    />
                  </div>
                </div>

                {/* Reasons Choice */}
                <div className="flex flex-col gap-2 pt-1">
                  <span
                    className="text-xs md:text-sm font-medium"
                    style={{ color: unsubscribe.reasonsTitle?.textColor || "inherit" }}
                  >
                    {unsubscribe.reasonsTitle?.value || "Help us understand why (optional):"}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {unsubscribe.reasonsList?.map((reason: string) => {
                      const isSelected = selectedReason === reason
                      return (
                        <button
                          key={reason}
                          type="button"
                          onClick={() => setSelectedReason(isSelected ? "" : reason)}
                          className={`px-3 py-1.5 rounded-sm text-xs transition-all border ${
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-muted/40 hover:bg-muted text-foreground border-border/50"
                          }`}
                        >
                          {reason}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 pt-3">
                  <button
                    type="submit"
                    className="h-11 w-full bg-primary text-primary-foreground text-xs md:text-sm font-medium rounded-sm shadow-sm hover:opacity-90 transition cursor-pointer"
                  >
                    {unSubAny.buttonText || "Confirm Unsubscribe"}
                  </button>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-1">
                    <a
                      href={unSubAny.exploreJourneysUrl || "/journeys"}
                      className="text-xs text-primary underline hover:opacity-80 transition"
                    >
                      {unSubAny.exploreJourneysLabel ||
                        "Keep my subscription & explore journeys"}
                    </a>
                    <a
                      href={unSubAny.returnHomeUrl || "/"}
                      className="text-xs text-primary underline hover:opacity-80 transition"
                    >
                      {unSubAny.returnHomeLabel || "Return Home"}
                    </a>
                  </div>
                </div>
              </form>
            ) : (
              /* Success State Preview */
              <div className="w-full rounded-sm bg-orange-50/70 p-6 border border-border/50 text-left">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-xs md:text-sm font-semibold">
                    Unsubscribed Successfully
                  </span>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground mb-4">
                  <span className="font-semibold text-foreground">{testEmail}</span> will no
                  longer receive travel dispatches and updates.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsUnsubscribed(false)}
                    className="h-9 px-4 rounded-sm bg-primary text-primary-foreground text-xs font-medium cursor-pointer"
                  >
                    {unSubAny.resubscribeButtonText || "Resubscribe by Mistake?"}
                  </button>
                  <a
                    href={unSubAny.returnHomeUrl || "/"}
                    className="h-9 px-4 rounded-sm border border-border text-xs font-medium inline-flex items-center justify-center bg-background text-foreground"
                  >
                    {unSubAny.returnHomeLabel || "Return Home"}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default UnsubscribePreview
