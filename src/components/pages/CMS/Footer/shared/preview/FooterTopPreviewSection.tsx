import type { FooterPreviewSectionProps } from "./sectionTypes"
import { UniversalMultimediaPreview } from "../../../Home/shared/preview/UniversalMultimediaPreview"

export const FooterTopPreviewSection = ({
  context,
}: FooterPreviewSectionProps) => {
  const { theme, content, renderSocialIcon } = context

  const brand = content.brand ?? {}
  const logo = brand.logo ?? {}
  const brandMedia = brand.footerBrandMultimedia
  const columns = content.columns ?? []
  const socialLinks = content.socialLinks ?? []
  const contact = content.contact ?? {}

  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.7fr_repeat(4,1fr)_1.1fr] md:gap-7">
      <div className="min-w-0">
        {brandMedia?.type || brandMedia?.url ? (
          <UniversalMultimediaPreview
            multimedia={brandMedia}
            fallbackAlt={logo.alt ?? "Brand logo"}
            className="h-auto max-h-14.5 w-auto max-w-47.5 object-contain object-left"
            containerClassName="max-h-14.5 max-w-47.5"
          />
        ) : logo.url ? (
          <UniversalMultimediaPreview
            multimedia={{ type: "image", url: logo.url, alt: logo.alt }}
            fallbackAlt="Brand logo"
            className="h-auto max-h-14.5 w-auto max-w-47.5 object-contain object-left"
            containerClassName="max-h-14.5 max-w-47.5"
          />
        ) : brand.name ? (
          <div
            className="font-serif text-3xl leading-none tracking-[-0.04em] md:text-[42px]"
            style={{
              color: theme.headingColor,
            }}
          >
            {brand.name}
          </div>
        ) : null}

        {brand.description && (
          <p
            className="mt-5 max-w-65 text-[10px] leading-[1.6] md:text-[11px]"
            style={{
              color: theme.mutedTextColor,
            }}
          >
            {brand.description}
          </p>
        )}

        {socialLinks.length > 0 && (
          <div
            className="mt-6 flex items-center"
            style={{
              gap: theme.socialGap,
            }}
          >
            {socialLinks.map((link, index) => {
              const itemSize = link.itemSize ?? theme.socialItemSize

              const bg = link.backgroundColor ?? theme.socialBackgroundColor

              const color = link.textColor ?? theme.socialTextColor

              const border = link.borderColor ?? theme.socialBorderColor

              const radius = link.borderRadius ?? theme.socialBorderRadius

              return (
                <a
                  key={index}
                  href={link.url || "#"}
                  target={link.url ? "_blank" : undefined}
                  rel={link.url ? "noreferrer" : undefined}
                  className="group flex items-center justify-center overflow-hidden transition-all duration-200"
                  style={{
                    width: itemSize,
                    height: itemSize,

                    backgroundColor: bg,

                    color,

                    borderColor: border,

                    borderWidth: link.borderWidth ?? "0px",

                    borderStyle: "solid",

                    borderRadius: radius,

                    ["--social-hover-bg" as string]:
                      link.hoverBackgroundColor ??
                      theme.socialHoverBackgroundColor,

                    ["--social-hover-color" as string]:
                      link.hoverTextColor ?? theme.socialHoverTextColor,
                  }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.backgroundColor =
                      link.hoverBackgroundColor ??
                      theme.socialHoverBackgroundColor

                    event.currentTarget.style.color =
                      link.hoverTextColor ?? theme.socialHoverTextColor
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.backgroundColor = bg

                    event.currentTarget.style.color = color
                  }}
                  title={link.platform ?? ""}
                  aria-label={link.platform ?? "Social link"}
                >
                  {renderSocialIcon(link)}
                </a>
              )
            })}
          </div>
        )}
      </div>

      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className="min-w-0">
          {column.title && (
            <p
              className="text-[12px] leading-none font-semibold"
              style={{
                color: column.titleColor ?? theme.headingColor,
              }}
            >
              {column.title}
            </p>
          )}

          {(column.links ?? []).length > 0 && (
            <ul className="mt-5 space-y-3">
              {(column.links ?? []).map((link, linkIndex) => (
                <li key={linkIndex}>
                  {link.label && (
                    <a
                      href={link.url || "#"}
                      className="block text-[10px] leading-none transition-opacity hover:opacity-60"
                      style={{
                        color: theme.mutedTextColor,
                      }}
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      {(contact.title || contact.email || contact.phone || contact.address) && (
        <div className="min-w-0">
          {contact.title && (
            <p
              className="text-[12px] leading-none font-semibold"
              style={{
                color: theme.headingColor,
              }}
            >
              {contact.title}
            </p>
          )}

          <div className="mt-5 space-y-3">
            {contact.phone && (
              <div className="flex items-start gap-3">
                <span
                  className="text-[10px]"
                  style={{
                    color: theme.mutedTextColor,
                  }}
                >
                  ☎
                </span>

                <span
                  className="text-[10px] leading-[1.4]"
                  style={{
                    color: theme.mutedTextColor,
                  }}
                >
                  {contact.phone}
                </span>
              </div>
            )}

            {contact.email && (
              <div className="flex items-start gap-3">
                <span
                  className="text-[10px]"
                  style={{
                    color: theme.mutedTextColor,
                  }}
                >
                  @
                </span>

                <span
                  className="text-[10px] leading-[1.4] break-all"
                  style={{
                    color: theme.mutedTextColor,
                  }}
                >
                  {contact.email}
                </span>
              </div>
            )}

            {contact.address && (
              <p
                className="text-[10px] leading-normal"
                style={{
                  color: theme.mutedTextColor,
                }}
              >
                {contact.address}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
