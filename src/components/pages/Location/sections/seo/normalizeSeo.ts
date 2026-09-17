export function normalizeSeo(seoData: any) {
  const safeSeo = seoData && typeof seoData === "object" ? seoData : {}

  return {
    title: safeSeo.title ?? "",
    description: safeSeo.description ?? "",
    keywords: Array.isArray(safeSeo.keywords) ? safeSeo.keywords : [],
    canonicalUrl: safeSeo.canonicalUrl ?? "",
    robots: {
      index: safeSeo.robots?.index ?? true,
      follow: safeSeo.robots?.follow ?? true,
    },
  }
}
