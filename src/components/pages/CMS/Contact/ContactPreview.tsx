import { useCmsDraft } from "../shared/CmsDraftContext"
import { type ContactPageData, DEFAULT_CONTACT_SECTIONS } from "./contactTypes"
import { UniversalMultimediaPreview } from "../Home/shared/preview/UniversalMultimediaPreview"
import { FormBuilderPreview } from "../shared/formBuilder/FormBuilderPreview"

const contactColor = (color: string | undefined, opacity?: number) => {
  if (!color || opacity === undefined || opacity >= 100) return color
  const match = color.match(/^#([0-9a-f]{6})$/i)
  if (!match) return color
  const red = parseInt(match[1].slice(0, 2), 16)
  const green = parseInt(match[1].slice(2, 4), 16)
  const blue = parseInt(match[1].slice(4, 6), 16)
  return `rgba(${red}, ${green}, ${blue}, ${opacity / 100})`
}

const contactStyle = (style: any, fallback: string) => ({
  color: contactColor(style?.textColor ?? fallback, style?.textOpacity),
  backgroundColor: contactColor(
    style?.backgroundColor,
    style?.backgroundOpacity
  ),
})

export const ContactContentPreview = () => {
  const page = useCmsDraft<ContactPageData>()

  const sections =
    page?.data?.sections && page.data.sections.length > 0
      ? page.data.sections
      : DEFAULT_CONTACT_SECTIONS

  const sectionKeyAliases: Record<string, string[]> = {
    contact_hero: ["contact_hero", "pageHero"],
    process_steps: ["process_steps", "stepList"],
    inquiry_form: ["inquiry_form", "contactForm"],
    personal_approach: ["personal_approach", "textImageFeature"],
    contact_info: ["contact_info", "infoColumns"],
    final_cta: ["final_cta", "ctaBanner"],
  }

  const getSection = (key: string) => {
    const aliases = sectionKeyAliases[key] ?? [key]
    return sections.find(
      (section: { key?: string; type?: string }) =>
        aliases.includes(section.key ?? "") ||
        aliases.includes(section.type ?? "")
    )
  }

  const hero = getSection("contact_hero")

  const process = getSection("process_steps")

  const inquiry = getSection("inquiry_form")

  const approach = getSection("personal_approach")

  const contactInfo = getSection("contact_info")

  const cta = getSection("final_cta")

  return (
    <div className="w-full overflow-hidden bg-[#FDF8F1] text-[#24351c]">
      {/* =====================================================
          HERO
      ====================================================== */}

      {hero && (
        <section
          className="relative flex min-h-[420px] items-center bg-cover bg-center overflow-hidden"
          style={{ backgroundColor: hero.bgColor ?? "#24351C" }}
        >
          {((hero.content as any)?.contentMultimedia || hero.bgImages?.url) && (
            <UniversalMultimediaPreview
              multimedia={
                (hero.content as any)?.contentMultimedia ?? {
                  type: "image",
                  url: hero.bgImages?.url,
                }
              }
              mode="background"
              className="absolute inset-0"
              containerClassName="absolute inset-0"
            />
          )}
          <div className="absolute inset-0 bg-black/35" />

          <div className="relative z-10 mx-auto w-full container px-4 lg:px-0 py-16 md:py-24">
            <div className="max-w-xl text-white">
              <p
                className="mb-4 text-xs font-semibold tracking-[0.25em] uppercase text-accent"
                style={contactStyle(
                  (hero.content as any)?.contactHeroEyebrowStyle,
                  "#FFFFFF"
                )}
              >
                {hero.content?.eyebrow}
              </p>

              <h1
                className="font-heading text-3xl md:text-5xl leading-tight font-semibold"
                style={contactStyle(
                  (hero.content as any)?.contactHeroTitleLine1Style,
                  "#FFFFFF"
                )}
              >
                <span>{hero.content?.titleLine1}</span>
                <br />
                <span
                  style={contactStyle(
                    (hero.content as any)?.contactHeroTitleLine2Style,
                    "#FFFFFF"
                  )}
                >
                  {hero.content?.titleLine2}
                </span>
              </h1>

              <p
                className="mt-5 max-w-md text-sm leading-6 text-white/90"
                style={contactStyle(
                  (hero.content as any)?.contactHeroDescriptionStyle,
                  "#FFFFFFCC"
                )}
              >
                {hero.content?.description}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          PROCESS
      ====================================================== */}

      {process && (
        <section
          className="relative overflow-hidden w-full bg-neutral-100 xl:pt-20 xlg:pt-[76px] lgx:pt-[66px] md:pt-[60px] pt-12 xl:pb-[126px] xlg:pb-[110px] lgx:pb-[100px] md:pb-[80px] pb-14"
          style={{
            backgroundColor: process.bgColor ?? "#FDF8F1",
          }}
        >
          {(process.content as any)?.contentMultimedia && (
            <UniversalMultimediaPreview
              multimedia={(process.content as any).contentMultimedia}
              mode="background"
              className="absolute inset-0"
              containerClassName="absolute inset-0"
            />
          )}
          <div className="relative z-10 mx-auto container px-4 lg:px-0">
            <h2
              className="w-full text-primary text-center font-heading font-medium text-2xl md:text-[34px] xlg:text-4xl xl:text-[40px] leading-[46px] md:leading-[52px] xl:leading-[56px] tracking-[2px] xl:tracking-[3px] capitalize"
              style={contactStyle(
                (process.content as any)?.contactStepsTitleStyle,
                "#24351C"
              )}
            >
              {process.content?.title}
            </h2>

            <div className="mt-14 grid grid-cols-1 gap-8 md:gap-10 lg:gap-12 xl:gap-20 md:grid-cols-3">
              {process.items?.map(
                (
                  item: {
                    id?: string
                    index?: string
                    title?: string
                    description?: string
                  },
                  index: number
                ) => (
                  <div key={item.id ?? index} className="flex flex-col gap-4">
                    <p
                      className="text-accent md:text-[15px] text-sm xl:text-base font-medium uppercase tracking-[1.5px] xl:tracking-[2px]"
                      style={contactStyle(
                        (item as any).contactStepIndexStyle,
                        "#B87858"
                      )}
                    >
                      {item.index}
                    </p>

                    <h3
                      className="text-title font-heading text-xl md:text-[24px] lg:text-[26px] xl:text-[30px] font-semibold leading-7 md:leading-8 lgx:leading-9 xl:leading-[40px]"
                      style={contactStyle(
                        (item as any).contactStepTitleStyle,
                        "#24351C"
                      )}
                    >
                      {item.title}
                    </h3>

                    <p
                      className="text-subtitle text-sm md:text-[15px] xl:text-base font-normal leading-[20px] md:leading-[22px] xl:leading-[24px]"
                      style={contactStyle(
                        (item as any).contactStepDescriptionStyle,
                        "#6B7280"
                      )}
                    >
                      {item.description}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          INQUIRY FORM
      ====================================================== */}

      {inquiry && (
        <section
          className="relative overflow-hidden w-full py-16 md:py-24"
          style={{
            backgroundColor: inquiry.bgColor ?? "#F5F0E8",
          }}
        >
          {(inquiry.content as any)?.contentMultimedia && (
            <UniversalMultimediaPreview
              multimedia={(inquiry.content as any).contentMultimedia}
              mode="background"
              className="absolute inset-0"
              containerClassName="absolute inset-0"
            />
          )}
          <div className="relative z-10 mx-auto container px-4 lg:px-0">
            <p
              className="text-xs font-semibold tracking-[0.2em] uppercase text-accent"
              style={contactStyle(
                (inquiry.content as any)?.contactSectionEyebrowStyle,
                "#B87858"
              )}
            >
              {inquiry.content?.eyebrow}
            </p>

            <h2
              className="mt-2 font-heading text-2xl md:text-4xl font-semibold"
              style={contactStyle(
                (inquiry.content as any)?.contactSectionTitleStyle,
                "#24351C"
              )}
            >
              {inquiry.content?.title}
            </h2>

            {inquiry.content?.description && (
              <p
                className="mt-3 max-w-xl text-sm leading-6 text-subtitle"
                style={contactStyle(
                  (inquiry.content as any)?.contactSectionDescriptionStyle,
                  "#6B7280"
                )}
              >
                {inquiry.content.description}
              </p>
            )}

            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-[1fr_380px]">
              {/* FORM */}
              <div className="space-y-4">
                <FormBuilderPreview fields={inquiry.fields ?? []} />

                {inquiry.buttons?.[0] && (
                  <button
                    type="button"
                    className="bg-[#18370F] px-8 py-3 text-xs font-semibold tracking-wider text-white uppercase rounded-xs"
                    onClick={async () => {
                      const fields = Array.from(
                        document.querySelectorAll<
                          | HTMLInputElement
                          | HTMLTextAreaElement
                          | HTMLSelectElement
                        >("input[name], textarea[name], select[name]")
                      )
                      const invalid = fields.find(
                        (field) => !field.checkValidity()
                      )
                      if (invalid) {
                        invalid.reportValidity()
                        return
                      }
                      const payload = Object.fromEntries(
                        fields
                          .filter((input) => input.name)
                          .map((input) => [input.name, input.value])
                      )
                      const button = inquiry.buttons?.[0]
                      if (!button) return
                      const url = (button as any).apiUrl || button.url
                      if (/^https?:\/\//i.test(url)) {
                        await fetch(url, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(payload),
                        })
                      } else {
                        console.log("Contact inquiry", payload)
                      }
                    }}
                  >
                    {inquiry.buttons[0].label}
                  </button>
                )}
              </div>

              {/* IMAGE */}
              <div>
                {((inquiry.content as any)?.sideMultimedia ||
                  inquiry.sideImages?.[0]?.url) && (
                  <UniversalMultimediaPreview
                    multimedia={
                      (inquiry.content as any)?.sideMultimedia ?? {
                        type: "image",
                        url: inquiry.sideImages?.[0]?.url,
                        alt: inquiry.sideImages?.[0]?.alt,
                      }
                    }
                    className="h-full min-h-[320px] w-full object-cover rounded-xs"
                    containerClassName="h-full min-h-[320px] w-full"
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          PERSONAL APPROACH
      ====================================================== */}

      {approach && (
        <section
          className="relative overflow-hidden w-full py-16 md:py-24"
          style={{
            backgroundColor: approach.bgColor ?? "#FDF8F1",
          }}
        >
          {(approach.content as any)?.contentMultimedia && (
            <UniversalMultimediaPreview
              multimedia={(approach.content as any).contentMultimedia}
              mode="background"
              className="absolute inset-0"
              containerClassName="absolute inset-0"
            />
          )}
          <div className="relative z-10 mx-auto container px-4 lg:px-0 grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div>
              {((approach.content as any)?.leftMultimedia ||
                approach.sideImages?.[0]?.url) && (
                <UniversalMultimediaPreview
                  multimedia={
                    (approach.content as any)?.leftMultimedia ?? {
                      type: "image",
                      url: approach.sideImages?.[0]?.url,
                      alt: approach.sideImages?.[0]?.alt,
                    }
                  }
                  className="h-[340px] md:h-[440px] w-full rounded-xs object-cover"
                  containerClassName="h-[340px] md:h-[440px] w-full"
                />
              )}
            </div>

            <div>
              <p
                className="text-xs font-semibold tracking-[0.2em] uppercase text-accent"
                style={contactStyle(
                  (approach.content as any)?.contactSectionEyebrowStyle,
                  "#B87858"
                )}
              >
                {approach.content?.eyebrow}
              </p>

              <h2
                className="mt-3 font-heading text-2xl md:text-4xl font-semibold"
                style={contactStyle(
                  (approach.content as any)?.contactSectionTitleStyle,
                  "#24351C"
                )}
              >
                {approach.content?.title}
              </h2>

              {approach.content?.description && (
                <p
                  className="mt-4 text-sm md:text-base leading-relaxed text-subtitle"
                  style={contactStyle(
                    (approach.content as any)?.contactSectionDescriptionStyle,
                    "#6B7280"
                  )}
                >
                  {approach.content.description}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          CONTACT INFO
      ====================================================== */}

      {contactInfo && (
        <section
          className="relative overflow-hidden w-full py-14 md:py-20"
          style={{
            backgroundColor: contactInfo.bgColor ?? "#FBF9F5",
          }}
        >
          {(contactInfo.content as any)?.contentMultimedia && (
            <UniversalMultimediaPreview
              multimedia={(contactInfo.content as any).contentMultimedia}
              mode="background"
              className="absolute inset-0"
              containerClassName="absolute inset-0"
            />
          )}
          <div className="relative z-10 mx-auto container px-4 lg:px-0 grid grid-cols-1 gap-8 text-center md:grid-cols-3">
            {contactInfo.items?.map(
              (
                item: {
                  id?: string
                  icon?: string
                  iconMultimedia?: Record<string, any>
                  label?: string
                  value?: string
                  url?: string | null
                  contactInfoLabelStyle?: any
                  contactInfoValueStyle?: any
                },
                index: number
              ) => (
                <div key={item.id ?? index} className="flex flex-col items-center">
                  <p
                    className="flex items-center justify-center gap-1 text-xs font-semibold tracking-wider uppercase text-muted-foreground"
                    style={contactStyle(item.contactInfoLabelStyle, "#9CA3AF")}
                  >
                    {(item.iconMultimedia || item.icon) && (
                      <UniversalMultimediaPreview
                        multimedia={
                          item.iconMultimedia ?? {
                            type: "image",
                            url: item.icon,
                          }
                        }
                        className="h-4 w-4 object-contain"
                        containerClassName="h-4 w-4"
                      />
                    )}
                    {item.label}
                  </p>

                  {item.url ? (
                    <a
                      href={item.url}
                      className="mt-2 block text-sm md:text-base font-medium text-primary hover:underline"
                      style={contactStyle(
                        item.contactInfoValueStyle,
                        "#24351C"
                      )}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p
                      className="mt-2 text-sm md:text-base font-medium text-primary"
                      style={contactStyle(
                        item.contactInfoValueStyle,
                        "#24351C"
                      )}
                    >
                      {item.value}
                    </p>
                  )}
                </div>
              )
            )}
          </div>
        </section>
      )}

      {/* =====================================================
          CTA
      ====================================================== */}

      {cta && (
        <section
          className="relative overflow-hidden w-full py-16 md:py-24 text-center"
          style={{
            backgroundColor: cta.bgColor ?? "#FBF9F5",
          }}
        >
          {(cta.content as any)?.contentMultimedia && (
            <UniversalMultimediaPreview
              multimedia={(cta.content as any).contentMultimedia}
              mode="background"
              className="absolute inset-0"
              containerClassName="absolute inset-0"
            />
          )}

          <div className="relative z-10 mx-auto container px-4 lg:px-0">
            <h2
              className="font-heading text-2xl md:text-4xl font-semibold"
              style={contactStyle(
                (cta.content as any)?.contactSectionTitleStyle,
                "#24351C"
              )}
            >
              {cta.content?.title}
            </h2>

            <p
              className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-subtitle"
              style={contactStyle(
                (cta.content as any)?.contactSectionDescriptionStyle,
                "#6B7280"
              )}
            >
              {cta.content?.description}
            </p>

            {cta.buttons?.[0] && (
              <a
                href={cta.buttons[0].url}
                className="mt-7 inline-flex px-8 py-3 text-xs font-semibold tracking-wider uppercase rounded-xs"
                style={{
                  backgroundColor:
                    (cta.buttons[0] as any).backgroundColor ?? "#18370F",
                  color: (cta.buttons[0] as any).textColor ?? "#FFFFFF",
                  border:
                    (cta.buttons[0] as any).style === "outline"
                      ? `1px solid ${(cta.buttons[0] as any).textColor ?? "#FFFFFF"}`
                      : undefined,
                }}
              >
                {cta.buttons[0].label}
              </a>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
