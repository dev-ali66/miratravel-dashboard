import type { FooterPreviewSectionProps } from "./sectionTypes"
import { UniversalMultimediaPreview } from "../../../Home/shared/preview/UniversalMultimediaPreview"
import { getSafeString } from "../../../shared/FormControls"

const defaultNavColumns = [
  {
    title: "Explore",
    links: [
      { label: "Destinations", url: "/destinations" },
      { label: "Journeys", url: "/journeys" },
      { label: "Travel Insights", url: "/insights" },
      { label: "Mira Stories", url: "/stories" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "About Mira", url: "/about" },
      { label: "Why Mira", url: "/why-mira" },
      { label: "How we work", url: "/how-we-work" },
      { label: "Contact", url: "/contact" },
    ],
  },
  {
    title: "Plan",
    links: [
      { label: "Start a travel request", url: "/plan-your-journey" },
      { label: "Financial protection", url: "/financial-protection" },
      { label: "FAQ", url: "/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Privacy", url: "/privacy" },
      { label: "Cookies", url: "/cookies" },
      { label: "Terms and conditions", url: "/terms" },
      { label: "Complaints procedure", url: "/complaints" },
    ],
  },
]

export const FooterTopPreviewSection = ({
  context,
}: FooterPreviewSectionProps) => {
  const { theme, content, renderSocialIcon } = context

  const brand = content.brand ?? {}
  const logo = brand.logo ?? {}
  const brandMedia = brand.footerBrandMultimedia ?? (brand as any).multimedia
  const rawColumns = content.columns ?? []
  const columns = rawColumns.length > 0 ? rawColumns : defaultNavColumns
  const socialLinks = content.socialLinks ?? []
  const contact = content.contact ?? {
    title: "Connect",
    phone: "+44 123 456 7890",
    email: "hello@miratravel.com",
  }

  const brandName = getSafeString(brand.name, "MIRA")
  const description =
    getSafeString(brand.description) ||
    "Your Trusted partner for world-class travel experiences across 50+ destinations."

  const contactTitle = getSafeString(contact.title, "Connect")
  const contactPhone = getSafeString(contact.phone)
  const contactEmail = getSafeString(contact.email)
  const contactAddress = getSafeString(contact.address)

  const brandMediaUrl =
    brandMedia?.image?.url ||
    brandMedia?.video?.url ||
    (typeof brandMedia?.url === "string" ? brandMedia.url : "") ||
    (typeof logo?.url === "string" ? logo.url : "")

  return (
    <div className="w-full pt-14 md:pt-20 lgx:pt-[84px] xl:pt-[100px] xl:pb-[50px] lgx:pb-[42px] md:pb-10 pb-7">
      <div className="container px-4 lg:px-0 mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-8 xl:gap-20 w-full">
          {/* Brand Section */}
          <div className="w-full lg:w-[320px] xl:w-[350px] shrink-0 flex flex-col items-start text-left">
            {brandMediaUrl || brandMedia?.show === "image" || brandMedia?.show === "video" ? (
              <UniversalMultimediaPreview
                multimedia={brandMedia ?? { type: "image", url: brandMediaUrl, alt: logo.alt }}
                fallbackAlt={logo.alt ?? brandName}
                className="h-auto max-h-14 w-auto max-w-[200px] object-contain object-left"
                containerClassName="max-h-14 max-w-[200px]"
              />
            ) : (
              <div
                className="font-serif text-2xl font-bold tracking-tight md:text-3xl"
                style={{ color: theme.headingColor }}
              >
                {brandName}
              </div>
            )}

            <p
              className="text-[13px] md:text-[15px] xl:text-base font-normal leading-[18px] md:leading-5 xl:leading-[22.75px] text-left lg:max-w-[310px] xl:max-w-[324px] mt-5 md:mt-6 lgx:mt-[28px] xl:mt-[30px]"
              style={{ color: theme.mutedTextColor }}
            >
              {description}
            </p>

            {socialLinks.length > 0 && (
              <div
                className="flex items-center justify-start gap-3.5 mt-4 md:mt-8 lgx:mt-10 mid:mt-11 xl:mt-13 flex-wrap"
                style={{ gap: theme.socialGap || "14px" }}
              >
                {socialLinks.map((link, index) => {
                  const itemSize = getSafeString(link.itemSize || theme.socialItemSize, "36px")
                  const bg = getSafeString(link.backgroundColor || theme.socialBackgroundColor, "rgba(255,255,255,0.08)")
                  const color = getSafeString(link.textColor || theme.socialTextColor, "#FFFFFF")
                  const border = getSafeString(link.borderColor || theme.socialBorderColor)
                  const radius = getSafeString(link.borderRadius || theme.socialBorderRadius, "4px")
                  const url = getSafeString(link.url)

                  return (
                    <a
                      key={index}
                      href={url || "#"}
                      target={url ? "_blank" : undefined}
                      rel={url ? "noreferrer" : undefined}
                      className="group flex items-center justify-center overflow-hidden transition-all duration-200 hover:scale-110"
                      style={{
                        width: itemSize,
                        height: itemSize,
                        backgroundColor: bg,
                        color,
                        borderColor: border,
                        borderWidth: link.borderWidth ?? "0px",
                        borderStyle: "solid",
                        borderRadius: radius,
                      }}
                      title={getSafeString(link.platform)}
                      aria-label={getSafeString(link.platform) || "Social link"}
                    >
                      {renderSocialIcon(link)}
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          {/* Nav Columns + Connect Section (Responsive 1 -> 3 -> 5 columns) */}
          <div className="w-full flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xlg:grid-cols-5 gap-8 md:gap-10 items-start">
            {columns.map((column, columnIndex) => {
              const colTitle = getSafeString(column.title)
              const colLinks = column.links ?? []

              return (
                <div key={columnIndex} className="flex flex-col gap-4 md:gap-5 lgx:gap-6 xl:gap-8 min-w-0">
                  {colTitle && (
                    <h3
                      className="font-heading xl:text-[24px] lgx:text-[22px] lg:text-lg md:text-[18px] text-base font-semibold xl:leading-6 lgx:leading-[22px] md:leading-[18px] leading-4 tracking-[1px]"
                      style={{ color: (column as any).titleColor ?? theme.headingColor }}
                    >
                      {colTitle}
                    </h3>
                  )}

                  {colLinks.length > 0 && (
                    <ul className="flex flex-col gap-2 md:gap-3 xl:gap-4">
                      {colLinks.map((link, linkIndex) => {
                        const linkLabel = getSafeString(link.label)
                        const linkUrl = getSafeString(link.url)

                        return (
                          <li key={linkIndex}>
                            {linkLabel && (
                              <a
                                href={linkUrl || "#"}
                                className="inline-block text-[13px] md:text-sm lg:text-[15px] font-normal leading-5 transition-all duration-200 hover:translate-x-1 hover:underline"
                                style={{ color: theme.mutedTextColor }}
                              >
                                {linkLabel}
                              </a>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              )
            })}

            {/* Connect Column */}
            {(contactTitle || contactEmail || contactPhone || contactAddress) && (
              <div className="flex flex-col gap-4 md:gap-5 lgx:gap-6 xl:gap-8 min-w-0">
                <h3
                  className="font-heading xl:text-[24px] lgx:text-[22px] lg:text-lg md:text-[18px] text-base font-semibold xl:leading-6 lgx:leading-[22px] md:leading-[18px] leading-4 tracking-[1px]"
                  style={{ color: theme.headingColor }}
                >
                  {contactTitle}
                </h3>

                <div className="flex flex-col gap-2 md:gap-3 xl:gap-4">
                  {contactPhone && (
                    <a
                      href={`tel:${contactPhone}`}
                      className="flex items-center gap-3 text-[13px] md:text-sm lg:text-[15px] transition-all duration-200 hover:translate-x-1 hover:underline"
                      style={{ color: theme.mutedTextColor }}
                    >
                      <svg
                        className="size-5 text-neutral-100 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.75}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                        />
                      </svg>
                      <span>{contactPhone}</span>
                    </a>
                  )}

                  {contactEmail && (
                    <a
                      href={`mailto:${contactEmail}`}
                      className="flex items-center gap-3 text-[13px] md:text-sm lg:text-[15px] transition-all duration-200 hover:translate-x-1 hover:underline"
                      style={{ color: theme.mutedTextColor }}
                    >
                      <svg
                        className="size-5 text-neutral-100 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.75}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                        />
                      </svg>
                      <span className="break-all">{contactEmail}</span>
                    </a>
                  )}

                  {contactAddress && (
                    <p
                      className="text-xs leading-normal"
                      style={{ color: theme.mutedTextColor }}
                    >
                      {contactAddress}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

