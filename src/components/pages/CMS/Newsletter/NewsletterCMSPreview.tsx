import { useState } from "react"
import { useCmsDraft } from "../shared/CmsDraftContext"
import { normalizeNewsletterCmsPayload } from "./config/normalizeNewsletterCmsPayload"
import { SubscribePreview } from "./sections/subscribe/SubscribePreview"
import { UnsubscribePreview } from "./sections/unsubscribe/UnsubscribePreview"

export function NewsletterCMSPreview() {
  const page = useCmsDraft<any>()
  const normalizedDraft = normalizeNewsletterCmsPayload(page)
  const [activeTab, setActiveTab] = useState<"subscribe" | "unsubscribe">("subscribe")

  return (
    <div className="w-full bg-background text-foreground antialiased min-h-screen">
      <div className="sticky top-0 z-10 flex items-center justify-center gap-2 bg-card/90 backdrop-blur p-2 border-b border-border/50 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab("subscribe")}
          className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
            activeTab === "subscribe"
              ? "bg-primary text-primary-foreground font-semibold"
              : "bg-muted/50 hover:bg-muted text-muted-foreground"
          }`}
        >
          Subscribe Layout
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("unsubscribe")}
          className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
            activeTab === "unsubscribe"
              ? "bg-primary text-primary-foreground font-semibold"
              : "bg-muted/50 hover:bg-muted text-muted-foreground"
          }`}
        >
          Unsubscribe Layout
        </button>
      </div>

      {activeTab === "subscribe" ? (
        <SubscribePreview draft={normalizedDraft} />
      ) : (
        <UnsubscribePreview draft={normalizedDraft} />
      )}
    </div>
  )
}

export default NewsletterCMSPreview
