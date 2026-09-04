import {
  ColorField,
  DynamicStyledField,
} from "../../../shared/FormControls"
import { RepeaterList } from "../../../shared/RepeaterList"

import type { FooterSocialLink } from "../../footerTypes"
import type { FooterFormSectionProps } from "./sectionTypes"

export const SocialLinksFormSection = ({
  context,
}: FooterFormSectionProps) => {
  const {
    theme,
    content,
    updateContent,
    TextField,
  } = context

  const socialLinks = content.socialLinks ?? []

  return (
    <div className="rounded-lg border border-border/60 p-3">
      <p className="mb-1 text-xs font-semibold text-foreground">
        Social Links
      </p>

      <p className="mb-3 text-[11px] text-muted-foreground">
        Add any social platform and upload your own icon.
        No platform is hardcoded.
      </p>

      <RepeaterList<FooterSocialLink>
        items={socialLinks}
        onChange={(newSocialLinks) =>
          updateContent({
            socialLinks:
              newSocialLinks,
          })
        }
        addLabel="Add social link"
        emptyLabel="No social links."
        itemLabel={(link) =>
          link.platform ||
          "Untitled social"
        }
        newItem={() => ({
          platform: "",
          url: "",
          icon: "",
          iconAlt: "",
          iconSize:
            theme.socialIconSize ??
            "14px",
          itemSize:
            theme.socialItemSize ??
            "32px",
          backgroundColor:
            theme.socialBackgroundColor ??
            "rgba(255,255,255,0.10)",
          textColor:
            theme.socialTextColor ??
            "#FFFFFF",
          borderColor:
            theme.socialBorderColor ??
            "transparent",
          borderWidth: "0px",
          borderRadius:
            theme.socialBorderRadius ??
            "4px",
          hoverBackgroundColor:
            theme.socialHoverBackgroundColor ??
            "rgba(255,255,255,0.18)",
          hoverTextColor:
            theme.socialHoverTextColor ??
            "#FFFFFF",
        })}
        renderItem={(
          link,
          updateLink
        ) => (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <TextField
                label="Platform name"
                value={
                  link.platform ?? ""
                }
                onChange={(value) =>
                  updateLink({
                    ...link,
                    platform: value,
                  })
                }
              />

              <TextField
                label="Social URL"
                value={
                  link.url ?? ""
                }
                onChange={(value) =>
                  updateLink({
                    ...link,
                    url: value,
                  })
                }
              />
            </div>

            <div className="rounded-md border border-border/50 p-3">
              <p className="mb-3 text-[11px] font-semibold text-foreground">
                Custom Icon
              </p>

              <div className="flex flex-col gap-3">
                <DynamicStyledField
                  type="image"
                  label="Icon"
                  value={
                    link.icon ?? ""
                  }
                  fieldName="footerSocialIcon"
                  onChange={(value) =>
                    updateLink({
                      ...link,
                      icon: value,
                    })
                  }
                />

                <TextField
                  label="Icon alt text"
                  value={
                    link.iconAlt ?? ""
                  }
                  onChange={(value) =>
                    updateLink({
                      ...link,
                      iconAlt: value,
                    })
                  }
                />
              </div>
            </div>

            <div className="rounded-md border border-border/50 p-3">
              <p className="mb-3 text-[11px] font-semibold text-foreground">
                Size
              </p>

              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <TextField
                  label="Item size"
                  value={
                    link.itemSize ??
                    theme.socialItemSize ??
                    "32px"
                  }
                  onChange={(value) =>
                    updateLink({
                      ...link,
                      itemSize: value,
                    })
                  }
                />

                <TextField
                  label="Icon size"
                  value={
                    link.iconSize ??
                    theme.socialIconSize ??
                    "14px"
                  }
                  onChange={(value) =>
                    updateLink({
                      ...link,
                      iconSize: value,
                    })
                  }
                />
              </div>
            </div>

            <div className="rounded-md border border-border/50 p-3">
              <p className="mb-3 text-[11px] font-semibold text-foreground">
                Colors
              </p>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <ColorField
                  label="Background"
                  value={
                    link.backgroundColor ??
                    theme.socialBackgroundColor ??
                    "rgba(255,255,255,0.10)"
                  }
                  onChange={(value) =>
                    updateLink({
                      ...link,
                      backgroundColor:
                        value,
                    })
                  }
                />

                <ColorField
                  label="Icon / text"
                  value={
                    link.textColor ??
                    theme.socialTextColor ??
                    "#FFFFFF"
                  }
                  onChange={(value) =>
                    updateLink({
                      ...link,
                      textColor:
                        value,
                    })
                  }
                />

                <ColorField
                  label="Border"
                  value={
                    link.borderColor ??
                    theme.socialBorderColor ??
                    "transparent"
                  }
                  onChange={(value) =>
                    updateLink({
                      ...link,
                      borderColor:
                        value,
                    })
                  }
                />

                <ColorField
                  label="Hover background"
                  value={
                    link.hoverBackgroundColor ??
                    theme.socialHoverBackgroundColor ??
                    "rgba(255,255,255,0.18)"
                  }
                  onChange={(value) =>
                    updateLink({
                      ...link,
                      hoverBackgroundColor:
                        value,
                    })
                  }
                />

                <ColorField
                  label="Hover icon / text"
                  value={
                    link.hoverTextColor ??
                    theme.socialHoverTextColor ??
                    "#FFFFFF"
                  }
                  onChange={(value) =>
                    updateLink({
                      ...link,
                      hoverTextColor:
                        value,
                    })
                  }
                />
              </div>
            </div>

            <div className="rounded-md border border-border/50 p-3">
              <p className="mb-3 text-[11px] font-semibold text-foreground">
                Border & Shape
              </p>

              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <TextField
                  label="Border width"
                  value={
                    link.borderWidth ??
                    "0px"
                  }
                  onChange={(value) =>
                    updateLink({
                      ...link,
                      borderWidth:
                        value,
                    })
                  }
                />

                <TextField
                  label="Border radius"
                  value={
                    link.borderRadius ??
                    theme.socialBorderRadius ??
                    "4px"
                  }
                  onChange={(value) =>
                    updateLink({
                      ...link,
                      borderRadius:
                        value,
                    })
                  }
                />
              </div>
            </div>
          </div>
        )}
      />
    </div>
  )
}
