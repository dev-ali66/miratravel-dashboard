import { useCmsPage } from "../shared/useCmsPage"
import { SaveBar } from "../shared/SaveBar"

import {
  DynamicStyledField,
  TextField,
  TextAreaField,
  ColorField,
} from "../shared/FormControls"

import { RepeaterList } from "../shared/RepeaterList"

import type {
  FooterCertification,
  FooterColumn,
  FooterColumnLink,
  FooterPageData,
  FooterSocialLink,
} from "./footerTypes"

export const FooterForm = () => {
  const {
    page,
    setPage,
    isLoading,
    isSaving,
    save,
  } = useCmsPage<FooterPageData>(
    "footer",
    "Footer"
  )

  const data = page?.data

  const theme = data?.theme ?? {}
  const content = data?.content ?? {}

  const brand = content.brand ?? {}
  const logo = brand.logo ?? {}

  const contact = content.contact ?? {}
  const newsletter = content.newsletter ?? {}

  const columns = content.columns ?? []
  const socialLinks = content.socialLinks ?? []
  const certifications = content.certifications ?? []

  /* ============================================================
     HELPERS
  ============================================================ */

  const updateData = (
    patch: Partial<NonNullable<FooterPageData["data"]>>
  ) => {
    setPage({
      ...page,
      data: {
        ...(page?.data ?? {}),
        ...patch,
      },
    })
  }

  const updateTheme = (
    patch: Partial<
      NonNullable<FooterPageData["data"]>["theme"]
    >
  ) => {
    updateData({
      theme: {
        ...(data?.theme ?? {}),
        ...patch,
      },
    })
  }

  const updateContent = (
    patch: Partial<
      NonNullable<FooterPageData["data"]>["content"]
    >
  ) => {
    updateData({
      content: {
        ...(data?.content ?? {}),
        ...patch,
      },
    })
  }

  return (
    <div className="flex flex-col">

      {/* ========================================================
          SAVE BAR
      ======================================================== */}

      <SaveBar
        title="Footer"
        description="Manage footer content, colors, background, links, contact, newsletter, social icons and certifications."
        onSave={save}
        isSaving={isSaving}
        isLoading={isLoading}
      />

      <div className="flex flex-col gap-6 p-4">

        {/* ======================================================
            FOOTER APPEARANCE
        ====================================================== */}

        <div className="rounded-lg border border-border/60 p-3">
          <p className="mb-3 text-xs font-semibold text-foreground">
            Footer Appearance
          </p>

          <div className="flex flex-col gap-3">

            <ColorField
              label="Background color"
              value={
                theme.backgroundColor ??
                "#1F3A1B"
              }
              onChange={(value) =>
                updateTheme({
                  backgroundColor: value,
                })
              }
            />

            <DynamicStyledField
              type="image"
              label="Background image"
              value={
                theme.backgroundImage ??
                ""
              }
              fieldName="footerBackgroundImage"
              onChange={(value) =>
                updateTheme({
                  backgroundImage: value,
                })
              }
            />

            <ColorField
              label="Text color"
              value={
                theme.textColor ??
                "#FFFFFF"
              }
              onChange={(value) =>
                updateTheme({
                  textColor: value,
                })
              }
            />

            <ColorField
              label="Heading color"
              value={
                theme.headingColor ??
                "#FFFFFF"
              }
              onChange={(value) =>
                updateTheme({
                  headingColor: value,
                })
              }
            />

            <ColorField
              label="Muted text color"
              value={
                theme.mutedTextColor ??
                "#D8DED5"
              }
              onChange={(value) =>
                updateTheme({
                  mutedTextColor: value,
                })
              }
            />

            <ColorField
              label="Accent color"
              value={
                theme.accentColor ??
                "#C97B4A"
              }
              onChange={(value) =>
                updateTheme({
                  accentColor: value,
                })
              }
            />

            <ColorField
              label="Border color"
              value={
                theme.borderColor ??
                "rgba(255,255,255,0.15)"
              }
              onChange={(value) =>
                updateTheme({
                  borderColor: value,
                })
              }
            />

          </div>
        </div>

        {/* ======================================================
            SOCIAL APPEARANCE
        ====================================================== */}

        <div className="rounded-lg border border-border/60 p-3">
          <p className="mb-1 text-xs font-semibold text-foreground">
            Social Appearance
          </p>

          <p className="mb-3 text-[11px] text-muted-foreground">
            Global social settings. Individual social items can
            override these values.
          </p>

          <div className="flex flex-col gap-3">

            <ColorField
              label="Background color"
              value={
                theme.socialBackgroundColor ??
                "rgba(255,255,255,0.10)"
              }
              onChange={(value) =>
                updateTheme({
                  socialBackgroundColor: value,
                })
              }
            />

            <ColorField
              label="Icon / text color"
              value={
                theme.socialTextColor ??
                "#FFFFFF"
              }
              onChange={(value) =>
                updateTheme({
                  socialTextColor: value,
                })
              }
            />

            <ColorField
              label="Border color"
              value={
                theme.socialBorderColor ??
                "transparent"
              }
              onChange={(value) =>
                updateTheme({
                  socialBorderColor: value,
                })
              }
            />

            <ColorField
              label="Hover background color"
              value={
                theme.socialHoverBackgroundColor ??
                "rgba(255,255,255,0.18)"
              }
              onChange={(value) =>
                updateTheme({
                  socialHoverBackgroundColor: value,
                })
              }
            />

            <ColorField
              label="Hover icon / text color"
              value={
                theme.socialHoverTextColor ??
                "#FFFFFF"
              }
              onChange={(value) =>
                updateTheme({
                  socialHoverTextColor: value,
                })
              }
            />

            <TextField
              label="Icon size"
              value={
                theme.socialIconSize ??
                "14px"
              }
              onChange={(value) =>
                updateTheme({
                  socialIconSize: value,
                })
              }
            />

            <TextField
              label="Item size"
              value={
                theme.socialItemSize ??
                "32px"
              }
              onChange={(value) =>
                updateTheme({
                  socialItemSize: value,
                })
              }
            />

            <TextField
              label="Border radius"
              value={
                theme.socialBorderRadius ??
                "4px"
              }
              onChange={(value) =>
                updateTheme({
                  socialBorderRadius: value,
                })
              }
            />

            <TextField
              label="Gap"
              value={
                theme.socialGap ??
                "8px"
              }
              onChange={(value) =>
                updateTheme({
                  socialGap: value,
                })
              }
            />

          </div>
        </div>

        {/* ======================================================
            BRAND
        ====================================================== */}

        <div className="rounded-lg border border-border/60 p-3">
          <p className="mb-3 text-xs font-semibold text-foreground">
            Brand
          </p>

          <div className="flex flex-col gap-3">

            <DynamicStyledField
              type="image"
              label="Logo"
              value={logo.url ?? ""}
              fieldName="footerBrandLogo"
              onChange={(value) =>
                updateContent({
                  brand: {
                    ...(content.brand ?? {}),
                    logo: {
                      ...(content.brand?.logo ?? {}),
                      url: value,
                    },
                  },
                })
              }
            />

            <TextField
              label="Logo alt text"
              value={logo.alt ?? ""}
              onChange={(value) =>
                updateContent({
                  brand: {
                    ...(content.brand ?? {}),
                    logo: {
                      ...(content.brand?.logo ?? {}),
                      alt: value,
                    },
                  },
                })
              }
            />

            <TextField
              label="Brand name"
              value={brand.name ?? ""}
              onChange={(value) =>
                updateContent({
                  brand: {
                    ...(content.brand ?? {}),
                    name: value,
                  },
                })
              }
            />

            <TextAreaField
              label="Description"
              value={brand.description ?? ""}
              onChange={(value) =>
                updateContent({
                  brand: {
                    ...(content.brand ?? {}),
                    description: value,
                  },
                })
              }
            />

          </div>
        </div>

        {/* ======================================================
            LINK COLUMNS
        ====================================================== */}

        <div className="rounded-lg border border-border/60 p-3">
          <p className="mb-3 text-xs font-semibold text-foreground">
            Link Columns
          </p>

          <RepeaterList<FooterColumn>
            items={columns}
            onChange={(newColumns) =>
              updateContent({
                columns: newColumns,
              })
            }
            addLabel="Add column"
            emptyLabel="No columns."
            itemLabel={(column) =>
              column.title || "Untitled column"
            }
            newItem={() => ({
              title: "",
              titleColor:
                theme.headingColor ??
                "#FFFFFF",
              links: [],
            })}
            renderItem={(
              column,
              updateColumn
            ) => (
              <div className="flex flex-col gap-3">

                <TextField
                  label="Column title"
                  value={column.title ?? ""}
                  onChange={(value) =>
                    updateColumn({
                      ...column,
                      title: value,
                    })
                  }
                />

                <ColorField
                  label="Column title color"
                  value={
                    column.titleColor ??
                    theme.headingColor ??
                    "#FFFFFF"
                  }
                  onChange={(value) =>
                    updateColumn({
                      ...column,
                      titleColor: value,
                    })
                  }
                />

                <RepeaterList<FooterColumnLink>
                  items={column.links ?? []}
                  onChange={(links) =>
                    updateColumn({
                      ...column,
                      links,
                    })
                  }
                  addLabel="Add link"
                  emptyLabel="No links."
                  itemLabel={(link) =>
                    link.label ||
                    "Untitled link"
                  }
                  newItem={() => ({
                    label: "",
                    url: "",
                  })}
                  renderItem={(
                    link,
                    updateLink
                  ) => (
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">

                      <TextField
                        label="Label"
                        value={link.label ?? ""}
                        onChange={(value) =>
                          updateLink({
                            ...link,
                            label: value,
                          })
                        }
                      />

                      <TextField
                        label="Link URL"
                        value={link.url ?? ""}
                        onChange={(value) =>
                          updateLink({
                            ...link,
                            url: value,
                          })
                        }
                      />

                    </div>
                  )}
                />

              </div>
            )}
          />
        </div>

        {/* ======================================================
            CONTACT
        ====================================================== */}

        <div className="rounded-lg border border-border/60 p-3">
          <p className="mb-3 text-xs font-semibold text-foreground">
            Contact
          </p>

          <div className="flex flex-col gap-3">

            <TextField
              label="Title"
              value={contact.title ?? ""}
              onChange={(value) =>
                updateContent({
                  contact: {
                    ...(content.contact ?? {}),
                    title: value,
                  },
                })
              }
            />

            <TextField
              label="Email"
              value={contact.email ?? ""}
              onChange={(value) =>
                updateContent({
                  contact: {
                    ...(content.contact ?? {}),
                    email: value,
                  },
                })
              }
            />

            <TextField
              label="Phone"
              value={contact.phone ?? ""}
              onChange={(value) =>
                updateContent({
                  contact: {
                    ...(content.contact ?? {}),
                    phone: value,
                  },
                })
              }
            />

            <TextAreaField
              label="Address"
              value={contact.address ?? ""}
              onChange={(value) =>
                updateContent({
                  contact: {
                    ...(content.contact ?? {}),
                    address: value,
                  },
                })
              }
            />

          </div>
        </div>

        {/* ======================================================
            SOCIAL LINKS
        ====================================================== */}

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

                {/* BASIC */}

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

                {/* CUSTOM ICON */}

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

                {/* SIZE */}

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

                {/* COLORS */}

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

                {/* BORDER */}

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

        {/* ======================================================
            NEWSLETTER
        ====================================================== */}

        <div className="rounded-lg border border-border/60 p-3">

          <p className="mb-3 text-xs font-semibold text-foreground">
            Newsletter
          </p>

          <div className="flex flex-col gap-3">

            <TextField
              label="Text"
              value={
                newsletter.text ?? ""
              }
              onChange={(value) =>
                updateContent({
                  newsletter: {
                    ...(content.newsletter ?? {}),
                    text: value,
                  },
                })
              }
            />

            <TextField
              label="Link text"
              value={
                newsletter.linkText ??
                ""
              }
              onChange={(value) =>
                updateContent({
                  newsletter: {
                    ...(content.newsletter ?? {}),
                    linkText: value,
                  },
                })
              }
            />

            <TextField
              label="URL"
              value={
                newsletter.url ?? ""
              }
              onChange={(value) =>
                updateContent({
                  newsletter: {
                    ...(content.newsletter ?? {}),
                    url: value,
                  },
                })
              }
            />

          </div>
        </div>

        {/* ======================================================
            CERTIFICATIONS
        ====================================================== */}

        <div className="rounded-lg border border-border/60 p-3">

          <p className="mb-3 text-xs font-semibold text-foreground">
            Certifications
          </p>

          <RepeaterList<FooterCertification>
            items={certifications}
            onChange={(newCertifications) =>
              updateContent({
                certifications:
                  newCertifications,
              })
            }
            addLabel="Add certification"
            emptyLabel="No certifications."
            itemLabel={(item) =>
              item.name ||
              "Untitled certification"
            }
            newItem={() => ({
              name: "",
              image: "",
              url: "",
              alt: "",
            })}
            renderItem={(
              certification,
              updateCertification
            ) => (
              <div className="flex flex-col gap-3">

                <TextField
                  label="Name"
                  value={
                    certification.name ??
                    ""
                  }
                  onChange={(value) =>
                    updateCertification({
                      ...certification,
                      name: value,
                    })
                  }
                />

                <DynamicStyledField
                  type="image"
                  label="Image"
                  value={
                    certification.image ??
                    ""
                  }
                  fieldName="footerCertificationImage"
                  onChange={(value) =>
                    updateCertification({
                      ...certification,
                      image: value,
                    })
                  }
                />

                <TextField
                  label="Alt text"
                  value={
                    certification.alt ??
                    ""
                  }
                  onChange={(value) =>
                    updateCertification({
                      ...certification,
                      alt: value,
                    })
                  }
                />

                <TextField
                  label="URL"
                  value={
                    certification.url ??
                    ""
                  }
                  onChange={(value) =>
                    updateCertification({
                      ...certification,
                      url: value,
                    })
                  }
                />

              </div>
            )}
          />

        </div>

        {/* ======================================================
            BOTTOM
        ====================================================== */}

        <div className="rounded-lg border border-border/60 p-3">

          <p className="mb-3 text-xs font-semibold text-foreground">
            Bottom / Copyright
          </p>

          <div className="flex flex-col gap-3">

            <TextField
              label="Copyright text"
              value={
                content.copyright ?? ""
              }
              onChange={(value) =>
                updateContent({
                  copyright: value,
                })
              }
            />

            <ColorField
              label="Bottom text color"
              value={
                theme.bottomTextColor ??
                "rgba(255,255,255,0.60)"
              }
              onChange={(value) =>
                updateTheme({
                  bottomTextColor: value,
                })
              }
            />

          </div>
        </div>

      </div>
    </div>
  )
}