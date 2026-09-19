import { ColorField, DynamicStyledField } from "../../../shared/FormControls"
import { RepeaterList } from "../../../shared/RepeaterList"
import type { FooterSocialLink } from "../../footerTypes"
import type { FooterFormSectionProps } from "./sectionTypes"

export const SocialLinksFormSection = ({ context }: FooterFormSectionProps) => {
  const { theme, content, updateContent } = context
  const socialLinks = content.socialLinks ?? []

  return (
    <div className="space-y-6">
      <p className="text-xs text-muted-foreground">
        Add custom social media platforms and icons.
      </p>

      <RepeaterList<FooterSocialLink>
        items={socialLinks}
        onChange={(newSocialLinks) => updateContent({ socialLinks: newSocialLinks })}
        addLabel="Add Social Link"
        emptyLabel="No social links added."
        itemLabel={(link) => link.platform || "Untitled Social"}
        newItem={() => ({
          platform: "",
          url: "",
          icon: "",
          iconAlt: "",
          iconSize: theme.socialIconSize ?? "14px",
          itemSize: theme.socialItemSize ?? "32px",
          backgroundColor: theme.socialBackgroundColor ?? "rgba(255,255,255,0.10)",
          textColor: theme.socialTextColor ?? "#FFFFFF",
          borderColor: theme.socialBorderColor ?? "transparent",
          borderWidth: "0px",
          borderRadius: theme.socialBorderRadius ?? "4px",
          hoverBackgroundColor: theme.socialHoverBackgroundColor ?? "rgba(255,255,255,0.18)",
          hoverTextColor: theme.socialHoverTextColor ?? "#FFFFFF",
        })}
        renderItem={(link, updateLink) => (
          <div className="space-y-4 p-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DynamicStyledField
                label="Platform Name"
                type="text"
                value={link.platform ?? ""}
                onChange={(val) =>
                  updateLink({ ...link, platform: typeof val === "object" ? val.value : val })
                }
              />

              <DynamicStyledField
                label="URL"
                type="text"
                value={link.url ?? ""}
                onChange={(val) =>
                  updateLink({ ...link, url: typeof val === "object" ? val.value : val })
                }
              />
            </div>

            <div className="space-y-3 rounded-lg border border-border/60 bg-muted/20 p-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Custom Icon
              </span>
              <DynamicStyledField
                type="image"
                label="Icon Image"
                value={link.icon ?? ""}
                fieldName="footerSocialIcon"
                onChange={(val) =>
                  updateLink({
                    ...link,
                    icon: typeof val === "object" ? val.url || val.value || val : val,
                  })
                }
              />
              <DynamicStyledField
                label="Icon Alt Text"
                type="text"
                value={link.iconAlt ?? ""}
                onChange={(val) =>
                  updateLink({ ...link, iconAlt: typeof val === "object" ? val.value : val })
                }
              />
            </div>

            <div className="space-y-3 rounded-lg border border-border/60 bg-muted/20 p-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Override Colors & Sizes
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <ColorField
                  label="Background"
                  value={link.backgroundColor ?? theme.socialBackgroundColor ?? "rgba(255,255,255,0.10)"}
                  onChange={(value) => updateLink({ ...link, backgroundColor: value })}
                />
                <ColorField
                  label="Icon / Text"
                  value={link.textColor ?? theme.socialTextColor ?? "#FFFFFF"}
                  onChange={(value) => updateLink({ ...link, textColor: value })}
                />
                <ColorField
                  label="Border Color"
                  value={link.borderColor ?? theme.socialBorderColor ?? "transparent"}
                  onChange={(value) => updateLink({ ...link, borderColor: value })}
                />
                <ColorField
                  label="Hover Background"
                  value={link.hoverBackgroundColor ?? theme.socialHoverBackgroundColor ?? "rgba(255,255,255,0.18)"}
                  onChange={(value) => updateLink({ ...link, hoverBackgroundColor: value })}
                />
                <ColorField
                  label="Hover Icon / Text"
                  value={link.hoverTextColor ?? theme.socialHoverTextColor ?? "#FFFFFF"}
                  onChange={(value) => updateLink({ ...link, hoverTextColor: value })}
                />
                <DynamicStyledField
                  type="text"
                  label="Item Size"
                  value={link.itemSize ?? theme.socialItemSize ?? "32px"}
                  onChange={(val) => updateLink({ ...link, itemSize: typeof val === "object" ? val.value : val })}
                />
                <DynamicStyledField
                  type="text"
                  label="Icon Size"
                  value={link.iconSize ?? theme.socialIconSize ?? "14px"}
                  onChange={(val) => updateLink({ ...link, iconSize: typeof val === "object" ? val.value : val })}
                />
                <DynamicStyledField
                  type="text"
                  label="Border Radius"
                  value={link.borderRadius ?? theme.socialBorderRadius ?? "4px"}
                  onChange={(val) => updateLink({ ...link, borderRadius: typeof val === "object" ? val.value : val })}
                />
              </div>
            </div>
          </div>
        )}
      />
    </div>
  )
}

