import { ArrowRight } from "lucide-react"

import { useCmsDraft } from "../shared/CmsDraftContext"
import type {
  FooterPageData,
  FooterSocialLink,
} from "./footerTypes"

export const FooterPreview = () => {
  const page =
    useCmsDraft<FooterPageData>()

  const data = page?.data

  const theme = data?.theme ?? {}
  const content = data?.content ?? {}

  const brand = content.brand ?? {}
  const logo = brand.logo ?? {}

  const columns = content.columns ?? []
  const socialLinks =
    content.socialLinks ?? []

  const contact =
    content.contact ?? {}

  const newsletter =
    content.newsletter ?? {}

  const certifications =
    content.certifications ?? []

  /* ============================================================
     THEME
  ============================================================ */

  const backgroundColor =
    theme.backgroundColor ??
    "#16330D"

  const textColor =
    theme.textColor ??
    "#FFFFFF"

  const headingColor =
    theme.headingColor ??
    "#FFFFFF"

  const mutedTextColor =
    theme.mutedTextColor ??
    "rgba(255,255,255,0.72)"

  const accentColor =
    theme.accentColor ??
    "#C97B4A"

  const borderColor =
    theme.borderColor ??
    "rgba(255,255,255,0.15)"

  const bottomTextColor =
    theme.bottomTextColor ??
    "rgba(255,255,255,0.60)"

  /* ============================================================
     SOCIAL DEFAULTS
  ============================================================ */

  const socialBackgroundColor =
    theme.socialBackgroundColor ??
    "rgba(255,255,255,0.10)"

  const socialTextColor =
    theme.socialTextColor ??
    "#FFFFFF"

  const socialBorderColor =
    theme.socialBorderColor ??
    "transparent"

  const socialHoverBackgroundColor =
    theme.socialHoverBackgroundColor ??
    "rgba(255,255,255,0.18)"

  const socialHoverTextColor =
    theme.socialHoverTextColor ??
    "#FFFFFF"

  const socialIconSize =
    theme.socialIconSize ??
    "14px"

  const socialItemSize =
    theme.socialItemSize ??
    "32px"

  const socialBorderRadius =
    theme.socialBorderRadius ??
    "4px"

  const socialGap =
    theme.socialGap ??
    "8px"

  /* ============================================================
     SOCIAL ICON
  ============================================================ */

  const renderSocialIcon = (
    link: FooterSocialLink
  ) => {
    /*
     * Custom uploaded icon
     */
    if (link.icon) {
      return (
        <img
          src={link.icon}
          alt={
            link.iconAlt ??
            link.platform ??
            "Social icon"
          }
          className="object-contain"
          style={{
            width:
              link.iconSize ??
              socialIconSize,

            height:
              link.iconSize ??
              socialIconSize,
          }}
        />
      )
    }

    /*
     * No icon uploaded.
     * Use platform initials as fallback.
     */
    const platform =
      link.platform?.trim() ?? ""

    const fallback =
      platform.length > 0
        ? platform
            .slice(0, 2)
            .toUpperCase()
        : "•"

    return (
      <span
        className="font-semibold leading-none"
        style={{
          fontSize:
            link.iconSize ??
            socialIconSize,
        }}
      >
        {fallback}
      </span>
    )
  }

  return (
    <footer
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor,
        color: textColor,
      }}
    >

      {/* ========================================================
          BACKGROUND IMAGE
      ======================================================== */}

      {theme.backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              `url(${theme.backgroundImage})`,
          }}
        />
      )}

      {/* ========================================================
          BACKGROUND OVERLAY
      ======================================================== */}

      {theme.backgroundImage && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor,
            opacity: 0.84,
          }}
        />
      )}

      {/* ========================================================
          MAIN CONTAINER
      ======================================================== */}

      <div
        className="
          relative
          mx-auto
          max-w-295
          px-6
          py-10
          md:px-10
          md:py-12
        "
      >

        {/* ======================================================
            TOP SECTION
        ====================================================== */}

        <div
          className="
            grid
            grid-cols-1
            gap-10
            md:grid-cols-[1.7fr_repeat(4,1fr)_1.1fr]
            md:gap-7
          "
        >

          {/* ====================================================
              BRAND
          ==================================================== */}

          <div className="min-w-0">

            {logo.url ? (
              <img
                src={logo.url}
                alt={logo.alt ?? ""}
                className="
                  h-auto
                  max-h-14.5
                  w-auto
                  max-w-47.5
                  object-contain
                  object-left
                "
              />
            ) : brand.name ? (
              <div
                className="
                  font-serif
                  text-3xl
                  leading-none
                  tracking-[-0.04em]
                  md:text-[42px]
                "
                style={{
                  color: headingColor,
                }}
              >
                {brand.name}
              </div>
            ) : null}

            {/* DESCRIPTION */}

            {brand.description && (
              <p
                className="
                  mt-5
                  max-w-65
                  text-[10px]
                  leading-[1.6]
                  md:text-[11px]
                "
                style={{
                  color:
                    mutedTextColor,
                }}
              >
                {brand.description}
              </p>
            )}

            {/* ==================================================
                SOCIAL
            ================================================== */}

            {socialLinks.length > 0 && (
              <div
                className="mt-6 flex items-center"
                style={{
                  gap: socialGap,
                }}
              >
                {socialLinks.map(
                  (link, index) => {

                    const itemSize =
                      link.itemSize ??
                      socialItemSize

                    const bg =
                      link.backgroundColor ??
                      socialBackgroundColor

                    const color =
                      link.textColor ??
                      socialTextColor

                    const border =
                      link.borderColor ??
                      socialBorderColor

                    const radius =
                      link.borderRadius ??
                      socialBorderRadius

                    return (
                      <a
                        key={index}
                        href={
                          link.url || "#"
                        }
                        target={
                          link.url
                            ? "_blank"
                            : undefined
                        }
                        rel={
                          link.url
                            ? "noreferrer"
                            : undefined
                        }
                        className="
                          group
                          flex
                          items-center
                          justify-center
                          overflow-hidden
                          transition-all
                          duration-200
                        "
                        style={{
                          width: itemSize,
                          height: itemSize,

                          backgroundColor:
                            bg,

                          color,

                          borderColor:
                            border,

                          borderWidth:
                            link.borderWidth ??
                            "0px",

                          borderStyle:
                            "solid",

                          borderRadius:
                            radius,

                          ["--social-hover-bg" as string]:
                            link.hoverBackgroundColor ??
                            socialHoverBackgroundColor,

                          ["--social-hover-color" as string]:
                            link.hoverTextColor ??
                            socialHoverTextColor,
                        }}
                        onMouseEnter={(event) => {
                          event.currentTarget.style.backgroundColor =
                            link.hoverBackgroundColor ??
                            socialHoverBackgroundColor

                          event.currentTarget.style.color =
                            link.hoverTextColor ??
                            socialHoverTextColor
                        }}
                        onMouseLeave={(event) => {
                          event.currentTarget.style.backgroundColor =
                            bg

                          event.currentTarget.style.color =
                            color
                        }}
                        title={
                          link.platform ?? ""
                        }
                        aria-label={
                          link.platform ?? "Social link"
                        }
                      >
                        {renderSocialIcon(
                          link
                        )}
                      </a>
                    )
                  }
                )}
              </div>
            )}
          </div>

          {/* ====================================================
              LINK COLUMNS
          ==================================================== */}

          {columns.map(
            (column, columnIndex) => (
              <div
                key={columnIndex}
                className="min-w-0"
              >

                {column.title && (
                  <p
                    className="
                      text-[12px]
                      font-semibold
                      leading-none
                    "
                    style={{
                      color:
                        column.titleColor ??
                        headingColor,
                    }}
                  >
                    {column.title}
                  </p>
                )}

                {(column.links ?? [])
                  .length > 0 && (
                  <ul className="mt-5 space-y-3">
                    {(
                      column.links ?? []
                    ).map(
                      (
                        link,
                        linkIndex
                      ) => (
                        <li
                          key={linkIndex}
                        >
                          {link.label && (
                            <a
                              href={
                                link.url ||
                                "#"
                              }
                              className="
                                block
                                text-[10px]
                                leading-none
                                transition-opacity
                                hover:opacity-60
                              "
                              style={{
                                color:
                                  mutedTextColor,
                              }}
                            >
                              {link.label}
                            </a>
                          )}
                        </li>
                      )
                    )}
                  </ul>
                )}

              </div>
            )
          )}

          {/* ====================================================
              CONTACT
          ==================================================== */}

          {(contact.title ||
            contact.email ||
            contact.phone ||
            contact.address) && (
            <div className="min-w-0">

              {contact.title && (
                <p
                  className="
                    text-[12px]
                    font-semibold
                    leading-none
                  "
                  style={{
                    color:
                      headingColor,
                  }}
                >
                  {contact.title}
                </p>
              )}

              <div className="mt-5 space-y-3">

                {contact.phone && (
                  <div
                    className="
                      flex
                      items-start
                      gap-3
                    "
                  >
                    <span
                      className="text-[10px]"
                      style={{
                        color:
                          mutedTextColor,
                      }}
                    >
                      ☎
                    </span>

                    <span
                      className="
                        text-[10px]
                        leading-[1.4]
                      "
                      style={{
                        color:
                          mutedTextColor,
                      }}
                    >
                      {contact.phone}
                    </span>
                  </div>
                )}

                {contact.email && (
                  <div
                    className="
                      flex
                      items-start
                      gap-3
                    "
                  >
                    <span
                      className="text-[10px]"
                      style={{
                        color:
                          mutedTextColor,
                      }}
                    >
                      @
                    </span>

                    <span
                      className="
                        break-all
                        text-[10px]
                        leading-[1.4]
                      "
                      style={{
                        color:
                          mutedTextColor,
                      }}
                    >
                      {contact.email}
                    </span>
                  </div>
                )}

                {contact.address && (
                  <p
                    className="
                      text-[10px]
                      leading-normal
                    "
                    style={{
                      color:
                        mutedTextColor,
                    }}
                  >
                    {contact.address}
                  </p>
                )}

              </div>
            </div>
          )}
        </div>

        {/* ======================================================
            NEWSLETTER + CERTIFICATIONS
        ====================================================== */}

        {(newsletter.text ||
          newsletter.linkText ||
          certifications.length > 0) && (
          <div
            className="
              mt-10
              flex
              flex-col
              gap-5
              border-t
              pt-4
              md:flex-row
              md:items-center
              md:justify-between
            "
            style={{
              borderColor,
            }}
          >

            {/* NEWSLETTER */}

            {(newsletter.text ||
              newsletter.linkText) && (
              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >

                {newsletter.text && (
                  <span
                    className="text-[10px]"
                    style={{
                      color:
                        mutedTextColor,
                    }}
                  >
                    {newsletter.text}
                  </span>
                )}

                {newsletter.linkText && (
                  <a
                    href={
                      newsletter.url ||
                      "#"
                    }
                    className="
                      group
                      inline-flex
                      items-center
                      gap-1
                      text-[10px]
                      transition-opacity
                      hover:opacity-70
                    "
                    style={{
                      color:
                        accentColor,
                    }}
                  >
                    <span>
                      {newsletter.linkText}
                    </span>

                    <ArrowRight
                      size={11}
                      strokeWidth={1.5}
                      className="
                        transition-transform
                        group-hover:translate-x-0.5
                      "
                    />
                  </a>
                )}

              </div>
            )}

            {/* CERTIFICATIONS */}

            {certifications.length > 0 && (
              <div className="flex items-center gap-4">

                {certifications.map(
                  (
                    certification,
                    index
                  ) => (
                    <a
                      key={index}
                      href={
                        certification.url ||
                        "#"
                      }
                      target={
                        certification.url
                          ? "_blank"
                          : undefined
                      }
                      rel={
                        certification.url
                          ? "noreferrer"
                          : undefined
                      }
                      className="
                        block
                        transition-opacity
                        hover:opacity-70
                      "
                      title={
                        certification.name ??
                        ""
                      }
                    >
                      {certification.image ? (
                        <img
                          src={
                            certification.image
                          }
                          alt={
                            certification.alt ??
                            certification.name ??
                            ""
                          }
                          className="
                            h-7
                            w-auto
                            max-w-17.5
                            object-contain
                          "
                        />
                      ) : certification.name ? (
                        <span
                          className="text-[9px]"
                          style={{
                            color:
                              mutedTextColor,
                          }}
                        >
                          {
                            certification.name
                          }
                        </span>
                      ) : null}
                    </a>
                  )
                )}

              </div>
            )}
          </div>
        )}

        {/* ======================================================
            COPYRIGHT
        ====================================================== */}

        {content.copyright && (
          <div
            className="
              border-t
              py-4
              text-center
            "
            style={{
              borderColor,
            }}
          >
            <p
              className="text-[9px]"
              style={{
                color:
                  bottomTextColor,
              }}
            >
              {content.copyright}
            </p>
          </div>
        )}

      </div>
    </footer>
  )
}