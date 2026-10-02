export function normalizeStoriesCmsSeoMetadata(metadata: any) {
  const safeMeta = metadata && typeof metadata === "object" ? metadata : {}
  return {
    title: safeMeta.title ?? "Stories | MIRA Travel",
    description: safeMeta.description ?? "",
    keywords: Array.isArray(safeMeta.keywords) ? safeMeta.keywords : [],
    canonicalUrl: safeMeta.canonicalUrl ?? "",
    robots: {
      index: safeMeta.robots?.index ?? true,
      follow: safeMeta.robots?.follow ?? true,
    },
  }
}
