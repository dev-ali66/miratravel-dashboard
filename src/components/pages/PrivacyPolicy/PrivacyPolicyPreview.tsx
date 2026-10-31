import React, { useState } from "react"
import type { PolicyItem, LegalHeroData } from "./types"
import { LegalHeroPreview } from "@/components/pages/CMS/shared/LegalHeroPreview"
import { FileText, Database, Sliders, Globe, ShieldCheck, UserCheck, Mail } from "lucide-react"

interface PrivacyPolicyPreviewProps {
  items: PolicyItem[]
  effectiveDate?: string
  lastUpdated: string
  hero: LegalHeroData
}

function getPrivacyIcon(index: number) {
  const icons = [FileText, Database, Sliders, Globe, ShieldCheck, UserCheck, Mail]
  const IconComponent = icons[index % icons.length]
  return <IconComponent className="h-5 w-5 text-brand-green shrink-0" />
}

export function PrivacyPolicyPreview({
  items,
  lastUpdated,
  hero,
}: PrivacyPolicyPreviewProps) {
  const [activeSectionId, setActiveSectionId] = useState<string>(items[0]?.id || "")

  return (
    <div className="@container w-full min-h-full bg-background text-foreground">
      {/* 1:1 Home CMS Matched Hero Banner */}
      <LegalHeroPreview hero={hero} lastUpdated={lastUpdated || "August 1, 2025"} />

      {/* 1:1 Frontend Main Body Layout */}
      <div className="w-full bg-background p-4 sm:p-6 md:p-8 lg:p-10">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border bg-card/60 py-16 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              No Privacy Policy sections available to preview.
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              Add sections in the editor above to view live changes here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left Column: Quick Navigation Sidebar */}
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="sticky top-6 rounded-md border border-border bg-card p-4 shadow-sm md:p-5 text-card-foreground">
                <h2 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-foreground">
                  Policy Navigation
                </h2>
                <nav className="flex flex-col gap-1.5">
                  {items.map((item, idx) => {
                    const isActive = activeSectionId === item.id || (!activeSectionId && idx === 0)
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setActiveSectionId(item.id)
                          const el = document.getElementById(`preview-section-${item.id}`)
                          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
                        }}
                        className={`flex w-full items-center gap-2.5 rounded-sm px-3 py-2.5 text-left text-xs font-medium transition-colors ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        {getPrivacyIcon(idx)}
                        <span className="truncate">{item.tabTitle || `Item ${idx + 1}`}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>
            </div>

            {/* Right Column: Dynamic Content Card */}
            <div className="lg:col-span-8 xl:col-span-9">
              <div className="rounded-md border border-border bg-card p-6 shadow-sm md:p-8 lg:p-10 text-card-foreground">
                {items.map((item, idx) => {
                  return (
                    <React.Fragment key={item.id}>
                      <section
                        id={`preview-section-${item.id}`}
                        className="scroll-mt-6 transition-all"
                      >
                        <div className="mb-4 flex items-center gap-3">
                          {getPrivacyIcon(idx)}
                          <h2 className="font-serif text-xl font-semibold text-foreground md:text-2xl">
                            {item.fullTitle}
                          </h2>
                        </div>

                        <div
                          className="prose prose-neutral max-w-none text-sm leading-relaxed text-body-muted md:text-[15px] [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1 [&_strong]:font-semibold [&_strong]:text-foreground [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-border-muted [&_th]:bg-muted/50 [&_th]:p-2.5 [&_th]:text-left [&_th]:text-xs [&_td]:border [&_td]:border-border-muted [&_td]:p-2.5 [&_td]:text-xs"
                          dangerouslySetInnerHTML={{
                            __html: item.content || "<p class='italic text-neutral-400'>[Section content empty]</p>",
                          }}
                        />
                      </section>

                      {idx < items.length - 1 && (
                        <hr className="my-8 border-t border-border-muted/80" />
                      )}
                    </React.Fragment>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
