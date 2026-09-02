import { useCmsDraft } from "../shared/CmsDraftContext"
import type { ContactPageData } from "./contactTypes"

export const ContactPreview = () => {
  const page = useCmsDraft<ContactPageData>()

  const sections =
    page?.data?.sections ?? [
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
          paragraphs: [
            "We believe the best journeys are personal, meaningful and thoughtfully designed.",
            "Our approach is simple: listen to what matters to you, understand how you like to travel and create an experience that feels uniquely yours.",
          ],
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
          description:
            "Let's create something unforgettable together.",
        },
        buttons: [
          {
            label: "Start planning",
            url: "#",
          },
        ],
      },
    ]

  const getSection = (key: string) =>
    sections.find(
      (section: {
        key: string
      }) => section.key === key
    )

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
          style={{
            backgroundImage: hero.bgImages?.url
              ? `url(${hero.bgImages.url})`
              : undefined,
          }}
        >
          <div className="absolute inset-0 bg-black/35" />

          <div className="relative z-10 mx-auto w-full max-w-6xl px-8">
            <div className="max-w-xl text-white">

              <p className="mb-4 text-[9px] uppercase tracking-[0.25em]">
                {hero.content?.eyebrow}
              </p>

              <h1 className="font-serif text-4xl leading-tight">
                {hero.content?.titleLine1}
                <br />
                {hero.content?.titleLine2}
              </h1>

              <p className="mt-5 max-w-md text-sm leading-6 text-white/80">
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
          className="px-8 py-20"
          style={{
            backgroundColor:
              process.bgColor ?? "#FDF8F1",
          }}
        >
          <div className="mx-auto max-w-6xl">

            <h2 className="text-center font-serif text-2xl">
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
                  <div
                    key={item.id ?? index}
                  >
                    <p className="text-[8px] uppercase tracking-[0.2em] text-[#B87858]">
                      {item.index}
                    </p>

                    <h3 className="mt-3 font-serif text-base">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-[10px] leading-5 text-gray-500">
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
          className="px-8 py-20"
          style={{
            backgroundColor:
              inquiry.bgColor ?? "#F5F0E8",
          }}
        >
          <div className="mx-auto max-w-6xl">

            <p className="text-[8px] uppercase tracking-[0.2em] text-[#B87858]">
              {inquiry.content?.eyebrow}
            </p>

            <h2 className="mt-2 font-serif text-2xl">
              {inquiry.content?.title}
            </h2>

            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-[1fr_320px]">

              {/* FORM */}

              <div className="space-y-3">

                {inquiry.fields?.map(
                  (
                    field: {
                      id: string
                      type: string
                      label?: string
                      placeholder?: string
                      options?: {
                        value: string
                        label: string
                        default?: boolean
                      }[]
                    }
                  ) => {

                    if (
                      field.type === "chipSelect"
                    ) {
                      return (
                        <div key={field.id}>

                          <p className="mb-2 text-[8px]">
                            {field.label}
                          </p>

                          <div className="flex flex-wrap gap-2">

                            {field.options?.map(
                              (
                                option: {
                                  value: string
                                  label: string
                                  default?: boolean
                                }
                              ) => (
                                <span
                                  key={option.value}
                                  className={`border px-3 py-2 text-[7px] ${
                                    option.default
                                      ? "border-[#B87858] bg-[#B87858] text-white"
                                      : "border-black/10"
                                  }`}
                                >
                                  {option.label}
                                </span>
                              )
                            )}

                          </div>
                        </div>
                      )
                    }

                    if (
                      field.type === "textarea"
                    ) {
                      return (
                        <textarea
                          key={field.id}
                          className="min-h-[90px] w-full border border-black/10 bg-transparent p-3 text-[9px]"
                          placeholder={
                            field.placeholder
                          }
                        />
                      )
                    }

                    return (
                      <input
                        key={field.id}
                        type={field.type}
                        className="h-9 w-full border border-black/10 bg-transparent px-3 text-[9px]"
                        placeholder={
                          field.placeholder
                        }
                      />
                    )
                  }
                )}

                {inquiry.buttons?.[0] && (
                  <button
                    type="button"
                    className="bg-[#18370F] px-8 py-3 text-[8px] uppercase tracking-wider text-white"
                  >
                    {inquiry.buttons[0].label}
                  </button>
                )}

              </div>

              {/* IMAGE */}

              <div>
                {inquiry.sideImages?.[0]?.url && (
                  <img
                    src={
                      inquiry.sideImages[0].url
                    }
                    alt={
                      inquiry.sideImages[0].alt ?? ""
                    }
                    className="h-full min-h-[320px] w-full object-cover"
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
          className="px-8 py-20"
          style={{
            backgroundColor:
              approach.bgColor ?? "#FDF8F1",
          }}
        >
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-2">

            <div>
              {approach.sideImages?.[0]?.url && (
                <img
                  src={
                    approach.sideImages[0].url
                  }
                  alt={
                    approach.sideImages[0].alt ?? ""
                  }
                  className="h-[300px] w-full rounded object-cover"
                />
              )}
            </div>

            <div>

              <p className="text-[8px] uppercase tracking-[0.2em] text-[#B87858]">
                {approach.content?.eyebrow}
              </p>

              <h2 className="mt-3 font-serif text-2xl">
                {approach.content?.title}
              </h2>

              <div className="mt-4 space-y-3">

                {approach.content?.paragraphs?.map(
                  (
                    paragraph: string,
                    index: number
                  ) => (
                    <p
                      key={index}
                      className="text-[11px] leading-6 text-gray-500"
                    >
                      {paragraph}
                    </p>
                  )
                )}

              </div>
            </div>

          </div>
        </section>
      )}

      {/* =====================================================
          CONTACT INFO
      ====================================================== */}

      {contactInfo && (
        <section
          className="px-8 py-14"
          style={{
            backgroundColor:
              contactInfo.bgColor ?? "#FBF9F5",
          }}
        >
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 text-center md:grid-cols-3">

            {contactInfo.items?.map(
              (
                item: {
                  id?: string
                  label?: string
                  value?: string
                  url?: string | null
                },
                index: number
              ) => (
                <div
                  key={item.id ?? index}
                >

                  <p className="text-[8px] uppercase tracking-wider text-gray-400">
                    {item.label}
                  </p>

                  {item.url ? (
                    <a
                      href={item.url}
                      className="mt-2 block text-[9px]"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="mt-2 text-[9px]">
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
          className="px-8 py-20 text-center"
          style={{
            backgroundColor:
              cta.bgColor ?? "#FBF9F5",
          }}
        >

          <h2 className="font-serif text-2xl">
            {cta.content?.title}
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-[10px] leading-5 text-gray-500">
            {cta.content?.description}
          </p>

          {cta.buttons?.[0] && (
            <a
              href={cta.buttons[0].url}
              className="mt-7 inline-flex bg-[#18370F] px-10 py-3 text-[8px] uppercase tracking-wider text-white"
            >
              {cta.buttons[0].label}
            </a>
          )}

        </section>
      )}

    </div>
  )
}
