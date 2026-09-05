import { useCmsDraft } from "../shared/CmsDraftContext"
import type { ContactPageData } from "./contactTypes"
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

  const sections = page?.data?.sections ?? [
    {
      key: "contact_hero",
      bgImages: {
        alt: "Aerial view of Mostar and the surrounding Balkan landscape",
        url: "https://images.unsplash.com/photo-1623536167776-922ccb1ff749?auto=format&fit=crop&w=2400&q=85",
        device: "desktop",
      },
      content: {
        eyebrow: "GET IN TOUCH",
        titleLine1: "Let's plan",
        titleLine2: "your journey",
        description:
          "Tell us about your travel plans and let us help you create an unforgettable experience.",
      },
    },
    {
      key: "process_steps",
      bgColor: "#FDF8F1",
      content: {
        title: "How it works",
      },
      items: [
        {
          id: "1",
          index: "01",
          title: "Tell us your plans",
          description:
            "Share your destination, dates and what kind of experience you are looking for.",
        },
        {
          id: "2",
          index: "02",
          title: "We create your journey",
          description:
            "Our team carefully plans a personalised itinerary around your interests.",
        },
        {
          id: "3",
          index: "03",
          title: "Enjoy the experience",
          description:
            "Everything is prepared so you can simply arrive and enjoy your journey.",
        },
      ],
    },
    {
      key: "inquiry_form",
      bgColor: "#F5F0E8",
      content: {
        eyebrow: "START A CONVERSATION",
        title: "Tell us what you have in mind",
      },
      fields: [
        {
          id: "name",
          type: "text",
          label: "Name",
          placeholder: "Your name",
        },
        {
          id: "email",
          type: "email",
          label: "Email",
          placeholder: "Your email",
        },
        {
          id: "message",
          type: "textarea",
          label: "Message",
          placeholder: "Tell us about your journey...",
        },
      ],
      buttons: [
        {
          label: "Send inquiry",
          url: "#",
        },
      ],
      sideImages: [
        {
          url: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=85",
          alt: "Historic architecture and landscape",
        },
      ],
    },
    {
      key: "personal_approach",
      bgColor: "#FDF8F1",
      content: {
        eyebrow: "A PERSONAL APPROACH",
        title: "Travel designed around you",
      },
      sideImages: [
        {
          url: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1200&q=85",
          alt: "Beautiful travel destination",
        },
      ],
    },
    {
      key: "contact_info",
      bgColor: "#FBF9F5",
      items: [
        {
          id: "email",
          label: "EMAIL",
          value: "hello@example.com",
          url: "mailto:hello@example.com",
        },
        {
          id: "phone",
          label: "PHONE",
          value: "+00 123 456 789",
          url: "tel:+00123456789",
        },
        {
          id: "location",
          label: "LOCATION",
          value: "Mostar, Bosnia & Herzegovina",
        },
      ],
    },
    {
      key: "final_cta",
      bgColor: "#FBF9F5",
      content: {
        title: "Ready to start your journey?",
        description: "Let's create something unforgettable together.",
      },
      buttons: [
        {
          label: "Start planning",
          url: "#",
        },
      ],
    },
  ]

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
          className="relative flex min-h-[420px] items-center bg-cover bg-center"
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

          <div className="relative z-10 mx-auto w-full max-w-6xl px-8">
            <div className="max-w-xl text-white">
              <p
                className="mb-4 text-[9px] tracking-[0.25em] uppercase"
                style={contactStyle(
                  (hero.content as any)?.contactHeroEyebrowStyle,
                  "#FFFFFF"
                )}
              >
                {hero.content?.eyebrow}
              </p>

              <h1
                className="font-serif text-4xl leading-tight"
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
                className="mt-5 max-w-md text-sm leading-6 text-white/80"
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
          className="relative overflow-hidden px-8 py-20"
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
          <div className="relative z-10 mx-auto max-w-6xl">
            <h2
              className="text-center font-serif text-2xl"
              style={contactStyle(
                (process.content as any)?.contactStepsTitleStyle,
                "#24351C"
              )}
            >
              {process.content?.title}
            </h2>

            <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3">
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
                  <div key={item.id ?? index}>
                    <p
                      className="text-[8px] tracking-[0.2em] uppercase"
                      style={contactStyle(
                        (item as any).contactStepIndexStyle,
                        "#B87858"
                      )}
                    >
                      {item.index}
                    </p>

                    <h3
                      className="mt-3 font-serif text-base"
                      style={contactStyle(
                        (item as any).contactStepTitleStyle,
                        "#24351C"
                      )}
                    >
                      {item.title}
                    </h3>

                    <p
                      className="mt-3 text-[10px] leading-5"
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
          className="relative overflow-hidden px-8 py-20"
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
          <div className="relative z-10 mx-auto max-w-6xl">
            <p
              className="text-[8px] tracking-[0.2em] uppercase"
              style={contactStyle(
                (inquiry.content as any)?.contactSectionEyebrowStyle,
                "#B87858"
              )}
            >
              {inquiry.content?.eyebrow}
            </p>

            <h2
              className="mt-2 font-serif text-2xl"
              style={contactStyle(
                (inquiry.content as any)?.contactSectionTitleStyle,
                "#24351C"
              )}
            >
              {inquiry.content?.title}
            </h2>

            {inquiry.content?.description && (
              <p
                className="mt-3 max-w-xl text-[11px] leading-5"
                style={contactStyle(
                  (inquiry.content as any)?.contactSectionDescriptionStyle,
                  "#6B7280"
                )}
              >
                {inquiry.content.description}
              </p>
            )}

            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-[1fr_320px]">
              {/* FORM */}

              <div className="space-y-3">
                <FormBuilderPreview fields={inquiry.fields ?? []} />
                {/* {inquiry.fields?.map(
                  (field: {
                    id: string
                      name?: string
                    type: string
                    label?: string
                    placeholder?: string
                    options?: {
                      value: string
                      label: string
                      default?: boolean
                    }[]
                    required?: boolean
                    pattern?: string
                    minLength?: number
                    maxLength?: number
                    errorMessage?: string
                    requiredErrorMessage?: string
                      labelStyle?: any
                      placeholderStyle?: any
                      requiredErrorStyle?: any
                      icon?: string
                  }) => {
                    if (
                      ["chipSelect", "select", "radio", "checkbox"].includes(
                        field.type
                      )
                    ) {
                      return (
                        <div key={field.id}>
                          <p className="mb-2 flex items-center gap-1 text-[8px]" style={contactStyle(field.labelStyle, "#24351C")}>
                            {field.icon && <UniversalMultimediaPreview multimedia={{ type: "image", url: field.icon }} className="h-4 w-4 object-contain" containerClassName="h-4 w-4" />}
                            {field.label}
                          </p>

                          {field.type === "select" ? (
                            <select
                              name={field.id}
                              required={field.required}
                              className="h-9 w-full border border-black/10 bg-transparent px-3 text-[9px]"
                            >
                              <option value="">Select an option</option>
                              {field.options?.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {field.options?.map(
                                (option: {
                                  value: string
                                  label: string
                                  default?: boolean
                                }) => (
                                  <label
                                    key={option.value}
                                    className={`border px-3 py-2 text-[7px] ${
                                      option.default
                                        ? "border-[#B87858] bg-[#B87858] text-white"
                                        : "border-black/10"
                                    }`}
                                  >
                                    {(field as any).icon && (
                                      <UniversalMultimediaPreview
                                        multimedia={{
                                          type: "image",
                                          url: (field as any).icon,
                                        }}
                                        className="h-4 w-4 object-contain"
                                        containerClassName="h-4 w-4"
                                      />
                                    )}
                                    <input
                                      type={
                                        field.type === "radio"
                                          ? "radio"
                                          : "checkbox"
                                      }
                                      name={field.id}
                                      value={option.value}
                                      defaultChecked={option.default}
                                      className="mr-1"
                                    />
                                    {option.label}
                                  </label>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      )
                    }

                    if (field.type === "textarea") {
                      return (
                        <textarea
                          key={field.id}
                          name={field.name ?? field.id}
                          required={field.required}
                          minLength={field.minLength}
                          maxLength={field.maxLength}
                          onInvalid={(event) =>
                            event.currentTarget.setCustomValidity(
                              field.required && !event.currentTarget.value
                                ? (field.requiredErrorMessage ?? "This field is required")
                                : (field.errorMessage ?? "Please enter a valid value")
                            )
                          }
                          onInput={(event) =>
                            event.currentTarget.setCustomValidity("")
                          }
                          className="min-h-[90px] w-full border border-black/10 bg-transparent p-3 text-[9px]"
                          placeholder={field.placeholder}
                          style={contactStyle(field.placeholderStyle, "#6B7280")}
                        />
                      )
                    }

                    return (
                      <input
                        key={field.id}
                        name={field.name ?? field.id}
                        type={field.type}
                        required={field.required}
                        minLength={field.minLength}
                        maxLength={field.maxLength}
                        pattern={field.pattern}
                        onInvalid={(event) =>
                          event.currentTarget.setCustomValidity(
                            field.required && !event.currentTarget.value
                              ? (field.requiredErrorMessage ?? "This field is required")
                              : (field.errorMessage ?? "Please enter a valid value")
                          )
                        }
                        onInput={(event) =>
                          event.currentTarget.setCustomValidity("")
                        }
                        className="h-9 w-full border border-black/10 bg-transparent px-3 text-[9px]"
                        placeholder={field.placeholder}
                        style={contactStyle(field.placeholderStyle, "#6B7280")}
                      />
                    )
                  }
                )} */}

                {inquiry.buttons?.[0] && (
                  <button
                    type="button"
                    className="bg-[#18370F] px-8 py-3 text-[8px] tracking-wider text-white uppercase"
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
                    className="h-full min-h-[320px] w-full object-cover"
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
          className="relative overflow-hidden px-8 py-20"
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
          <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-2">
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
                  className="h-[300px] w-full rounded object-cover"
                  containerClassName="h-[300px] w-full"
                />
              )}
            </div>

            <div>
              <p
                className="text-[8px] tracking-[0.2em] uppercase"
                style={contactStyle(
                  (approach.content as any)?.contactSectionEyebrowStyle,
                  "#B87858"
                )}
              >
                {approach.content?.eyebrow}
              </p>

              <h2
                className="mt-3 font-serif text-2xl"
                style={contactStyle(
                  (approach.content as any)?.contactSectionTitleStyle,
                  "#24351C"
                )}
              >
                {approach.content?.title}
              </h2>

              {approach.content?.description && (
                <p
                  className="mt-4 text-[11px] leading-6"
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
          className="relative overflow-hidden px-8 py-14"
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
          <div className="relative z-10 mx-auto grid max-w-4xl grid-cols-1 gap-8 text-center md:grid-cols-3">
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
                <div key={item.id ?? index}>
                  <p
                    className="flex items-center justify-center gap-1 text-[8px] tracking-wider uppercase"
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
                      className="mt-2 block text-[9px]"
                      style={contactStyle(
                        item.contactInfoValueStyle,
                        "#24351C"
                      )}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p
                      className="mt-2 text-[9px]"
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
          className="relative overflow-hidden px-8 py-20 text-center"
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

          <div className="relative z-10">
            <h2
              className="font-serif text-2xl"
              style={contactStyle(
                (cta.content as any)?.contactSectionTitleStyle,
                "#24351C"
              )}
            >
              {cta.content?.title}
            </h2>

            <p
              className="mx-auto mt-3 max-w-xl text-[10px] leading-5"
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
                className="mt-7 inline-flex px-10 py-3 text-[8px] tracking-wider uppercase"
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
