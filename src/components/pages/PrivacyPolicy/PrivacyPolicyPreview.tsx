import React, { useState } from "react"
import type { PolicyPart } from "./types"
import { FileText, Database, Sliders, Globe, ShieldCheck, UserCheck, Mail } from "lucide-react"

interface PrivacyPolicyPreviewProps {
  parts: PolicyPart[]
  effectiveDate: string
  lastUpdated: string
}

function getPrivacyIcon(index: number) {
  const icons = [FileText, Database, Sliders, Globe, ShieldCheck, UserCheck, Mail]
  const IconComponent = icons[index % icons.length]
  return <IconComponent className="h-5 w-5 text-brand-green shrink-0" />
}

export function PrivacyPolicyPreview({
  parts,
  lastUpdated,
}: PrivacyPolicyPreviewProps) {
  const [activeSectionId, setActiveSectionId] = useState<string>(parts[0]?.id || "")

  return (
    <div className="@container w-full min-h-full bg-background text-foreground">
      {/* 1:1 Frontend Hero Banner */}
      <section className="relative w-full overflow-hidden bg-brand-primary px-6 py-12 text-center text-surface-light md:py-16">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-200 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-surface-light/20 bg-surface-light/10 px-3 py-1 text-[11px] font-medium tracking-widest text-surface-muted uppercase">
            MIRA ARCHIVE
          </div>

          <h1 className="font-serif text-3xl font-semibold tracking-tight text-surface-light md:text-4xl lg:text-5xl">
            Privacy Policy
          </h1>

          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-surface-muted md:text-base">
            We are committed to protecting your privacy and ensuring transparency about how we collect,
            use, and safeguard your personal information across all MIRA journeys and platforms.
          </p>

          <div className="text-xs text-surface-muted/70 pt-2">
            Last updated: {lastUpdated || "August 1, 2025"}
          </div>
        </div>
      </section>

      {/* 1:1 Frontend Main Body Layout */}
      <div className="w-full bg-background p-4 sm:p-6 md:p-8 lg:p-10">
        {parts.length === 0 ? (
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
                  Quick Navigation
                </h2>
                <nav className="flex flex-col gap-1.5">
                  {parts.map((part, idx) => {
                    const isActive = activeSectionId === part.id || (!activeSectionId && idx === 0)
                    return (
                      <button
                        key={part.id}
                        type="button"
                        onClick={() => {
                          setActiveSectionId(part.id)
                          const el = document.getElementById(`privacy-preview-section-${part.id}`)
                          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
                        }}
                        className={`flex w-full items-center gap-2.5 rounded-sm px-3 py-2.5 text-left text-xs font-medium transition-colors ${isActive
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                      >
                        {getPrivacyIcon(idx)}
                        <span className="truncate">{part.tabTitle || `Section ${idx + 1}`}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>
            </div>

            {/* Right Column: Dynamic Privacy Content Card */}
            <div className="lg:col-span-8 xl:col-span-9">
              <div className="rounded-md border border-border bg-card p-6 shadow-sm md:p-8 lg:p-10 text-card-foreground">
                {parts.map((part, idx) => {
                  return (
                    <React.Fragment key={part.id}>
                      <section
                        id={`privacy-preview-section-${part.id}`}
                        className="scroll-mt-6 transition-all"
                      >
                        <div className="mb-4 flex items-center gap-3">
                          {getPrivacyIcon(idx)}
                          <h2 className="font-serif text-xl font-semibold text-foreground md:text-2xl">
                            {part.fullTitle}
                          </h2>
                        </div>

                        <div
                          className="prose prose-neutral max-w-none text-sm leading-relaxed text-body-muted md:text-[15px] [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1 [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:text-sm [&_h3]:mt-3 [&_h3]:mb-1 [&_strong]:font-semibold [&_strong]:text-foreground"
                          dangerouslySetInnerHTML={{
                            __html: part.content || "<p class='italic text-neutral-400'>[Section content empty]</p>",
                          }}
                        />
                      </section>

                      {idx < parts.length - 1 && (
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
