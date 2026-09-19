import { emptyHomePayload } from "../Home/shared/emptyHomePayload"

export function getDefaultCmsPageData(slug: string, name: string) {
  const normalizedSlug = slug.toLowerCase()

  if (normalizedSlug === "home") {
    return emptyHomePayload
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
          backgroundColor: "#09090b",
          textColor: "#a1a1aa",
          headingColor: "#ffffff",
          accentColor: "#2563eb",
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
