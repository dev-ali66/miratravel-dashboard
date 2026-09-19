export function normalizeSeoMetadata(metadata: any) {
  const safeMeta = metadata && typeof metadata === "object" ? metadata : {}
  return {
    title: safeMeta.title ?? "",
    description: safeMeta.description ?? "",
    keywords: Array.isArray(safeMeta.keywords) ? safeMeta.keywords : [],
    canonicalUrl: safeMeta.canonicalUrl ?? "",
    robots: {
      index: safeMeta.robots?.index ?? true,
      follow: safeMeta.robots?.follow ?? true,
    },
  }
}
