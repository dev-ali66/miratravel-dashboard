import { THEME_COLORS } from "@/config/theme"
import { emptyHomePayload } from "../Home/shared/emptyHomePayload"
import { emptyFaqPayload } from "../Faq/config/emptyFaqPayload"

export function getDefaultCmsPageData(slug: string, name: string) {
  const normalizedSlug = slug.toLowerCase()

  if (normalizedSlug === "home") {
    return emptyHomePayload
  }

  if (normalizedSlug === "faq") {
    return emptyFaqPayload
  }

  if (normalizedSlug === "footer") {
    return {
      name: "Footer",
      slug: "footer",
      metadata: {
        title: "Footer",
        description: "Site footer",
      },
      data: {
        page: "footer",
        theme: {
          backgroundColor: THEME_COLORS.dark,
          textColor: THEME_COLORS.lightMuted,
          headingColor: THEME_COLORS.white,
          accentColor: THEME_COLORS.blue,
        },
        content: {
          brand: {
            name: "Mira",
            description: "Crafting luxury travel experiences worldwide.",
          },
          columns: [],
          socialLinks: [],
          copyright: `© ${new Date().getFullYear()} Mira. All rights reserved.`,
        },
      },
    }
  }

  return {
    name,
    slug,
    metadata: {
      title: name,
      description: `Manage ${name} page content`,
    },
    data: {},
  }
}
