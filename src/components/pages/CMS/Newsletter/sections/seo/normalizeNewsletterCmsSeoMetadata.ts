export function normalizeNewsletterCmsSeoMetadata(metadata: any) {
  const safeMeta = metadata && typeof metadata === "object" ? metadata : {}
  return {
    title: safeMeta.title ?? "Newsletter | Curated Balkan Travel Inspiration | MIRA",
    description: safeMeta.description ?? "",
    keywords: Array.isArray(safeMeta.keywords) ? safeMeta.keywords : [],
    canonicalUrl: safeMeta.canonicalUrl ?? "",
    robots: {
      index: safeMeta.robots?.index ?? true,
      follow: safeMeta.robots?.follow ?? true,
    },
  }
}
