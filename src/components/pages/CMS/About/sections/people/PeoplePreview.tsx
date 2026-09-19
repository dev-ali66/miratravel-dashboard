import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { Globe } from "lucide-react"

export type PeoplePreviewProps = {
  section: any
}

// Preset scatter coordinates matching frontend layout
const desktopScatterStyles = [
  "w-[195px] h-[195px] xl:w-[288px] xl:h-[288px] left-[10%] xl:left-[16.2%] top-0",
  "w-[145px] h-[145px] xl:w-[208px] xl:h-[208px] left-[50%] top-[2%] xl:top-[4.1%]",
  "w-[195px] h-[195px] xl:w-[288px] xl:h-[288px] left-[82.5%] xl:left-[80.7%] top-[13%] xl:top-[15.2%]",
  "w-[145px] h-[155px] xl:w-[208px] xl:h-[224px] left-0 top-[31.4%]",
  "w-[195px] h-[195px] xl:w-[288px] xl:h-[288px] left-[3%] xl:left-[5.4%] top-[64.6%]",
  "w-[145px] h-[145px] xl:w-[208px] xl:h-[208px] left-[36%] top-[80%] xl:top-[78.6%]",
  "w-[145px] h-[145px] xl:w-[208px] xl:h-[208px] left-[80%] xl:left-[77.8%] top-[76%] xl:top-[74.9%]",
]

function renderSocialIcon(iconStr: string) {
  const norm = (iconStr || "").toLowerCase().trim()
  if (norm.includes("linkedin")) {
    return (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
      </svg>
    )
  }
  if (norm.includes("instagram")) {
    return (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    )
  }
  if (norm.includes("twitter") || norm.includes("x")) {
    return (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    )
  }
  if (norm.includes("facebook")) {
    return (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    )
  }
  return <Globe className="w-3.5 h-3.5" />
}

export function PeoplePreview({ section }: PeoplePreviewProps) {
  if (!section) return null

  const peopleList = Array.isArray(section.members)
    ? section.members
    : Array.isArray(section.people)
    ? section.people
    : Array.isArray(section.items)
    ? section.items
    : []

  return (
    <section className="relative w-full overflow-hidden py-16 lg:py-24 bg-[#FAF7F2]">
      {section.backgroundMultimedia && (
        <UniversalMultimediaPreview multimedia={section.backgroundMultimedia} mode="background" />
      )}

      <div className="relative z-10 mx-auto w-full max-w-[1508px] px-4 sm:px-6 lg:px-8">
        {/* Desktop Scattered Cloud Layout (lg+) */}
        <div className="relative w-full aspect-[1508/960] hidden lg:block">
          {/* Floating Scatter Cards */}
          {peopleList.map((person: any, idx: number) => {
            const style = desktopScatterStyles[idx % desktopScatterStyles.length]
            const socialList = Array.isArray(person?.social) ? person.social : []

            return (
              <div
                key={idx}
                className={`absolute ${style} overflow-hidden rounded-md shadow-md group transition-transform duration-300 hover:scale-105 hover:z-20`}
              >
                <UniversalMultimediaPreview multimedia={person.multimedia} />

                {/* Hover overlay showing name, designation, and social links */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end text-white">
                  <div className="font-serif font-medium text-sm sm:text-base leading-tight">
                    <DynamicStyledTextPreview as="span" data={person.name} fallbackColor="#ffffff" />
                  </div>
                  <div className="text-[11px] font-medium tracking-wider text-[#E5A84B] mt-0.5">
                    <DynamicStyledTextPreview
                      as="span"
                      data={person.designation || person.role}
                      fallbackColor="#E5A84B"
                    />
                  </div>

                  {socialList.length > 0 && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/20">
                      {socialList.map((soc: any, sIdx: number) => (
                        <a
                          key={sIdx}
                          href={soc.url || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="text-white/80 hover:text-white transition-colors p-1"
                          title={soc.label || soc.icon}
                        >
                          {renderSocialIcon(soc.icon)}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          {/* Centered Editorial Text Block */}
          <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none z-10">
            <div className="pointer-events-auto flex flex-col justify-center items-center text-center max-w-[550px] xl:max-w-[665px] px-4">
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-[2.64px] mb-3">
                <DynamicStyledTextPreview as="span" data={section.eyebrow} fallbackColor="#B86B3A" />
              </span>
              <h2 className="font-serif font-light text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight mb-4">
                <DynamicStyledTextPreview as="span" data={section.title} fallbackColor="#182D09" />
              </h2>
              <div className="text-sm sm:text-base leading-relaxed text-[#4B5563] whitespace-pre-line">
                <DynamicStyledTextPreview as="div" data={section.description} fallbackColor="#4B5563" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile & Tablet Flow (< lg) */}
        <div className="flex flex-col items-center lg:hidden">
          <div className="flex flex-col items-center text-center max-w-[600px] mb-10">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-[2.64px] mb-2">
              <DynamicStyledTextPreview as="span" data={section.eyebrow} fallbackColor="#B86B3A" />
            </span>
            <h2 className="font-serif font-light text-3xl sm:text-4xl leading-tight mb-3">
              <DynamicStyledTextPreview as="span" data={section.title} fallbackColor="#182D09" />
            </h2>
            <div className="text-sm sm:text-base leading-relaxed text-[#4B5563] whitespace-pre-line">
              <DynamicStyledTextPreview as="div" data={section.description} fallbackColor="#4B5563" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {peopleList.map((person: any, idx: number) => {
              const socialList = Array.isArray(person?.social) ? person.social : []
              return (
                <div
                  key={idx}
                  className="bg-white/80 rounded-xl p-4 border border-black/5 shadow-sm flex flex-col space-y-3"
                >
                  <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-muted">
                    <UniversalMultimediaPreview multimedia={person.multimedia} />
                  </div>
                  <div>
                    <h3 className="text-base font-serif font-medium text-[#182D09]">
                      <DynamicStyledTextPreview as="span" data={person.name} fallbackColor="#182D09" />
                    </h3>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#B86B3A] mt-0.5">
                      <DynamicStyledTextPreview
                        as="span"
                        data={person.designation || person.role}
                        fallbackColor="#B86B3A"
                      />
                    </p>
                  </div>

                  {socialList.length > 0 && (
                    <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                      {socialList.map((soc: any, sIdx: number) => (
                        <a
                          key={sIdx}
                          href={soc.url || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors p-1"
                          title={soc.label || soc.icon}
                        >
                          {renderSocialIcon(soc.icon)}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default PeoplePreview


