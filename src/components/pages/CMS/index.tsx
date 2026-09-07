import { useGetPages } from "@/hooks/cms/useGetPages"
import { Link } from "react-router-dom"

export default function CMSPage() {
  const { data, isLoading } = useGetPages()

  const fetchedPages = data?.data ?? []

  const STANDARD_PAGES = [
    { name: "Home", slug: "home", description: "Manage homepage content, sections, theme and media." },
    { name: "Navbar", slug: "navbar", description: "Manage site-wide navbar branding and theme." },
    { name: "Footer", slug: "footer", description: "Manage site footer, links, social media, and copyright." },
    { name: "Contact Us", slug: "contact-us", description: "Manage contact page information and details." },
    { name: "Call To Action", slug: "cta", description: "Manage site-wide Call to Action banner." },
    { name: "FAQ", slug: "faq", description: "Manage frequently asked questions and category lists." },
  ]

  // Combine standard pages with any extra pages from API
  const displayedPages = STANDARD_PAGES.map((stdPage) => {
    const matched = fetchedPages.find(
      (p) => p.slug.toLowerCase() === stdPage.slug.toLowerCase()
    )
    return {
      ...stdPage,
      id: matched?.id,
      name: matched?.name || stdPage.name,
      isExisting: !!matched,
    }
  })

  // Add any custom pages created in backend that aren't in STANDARD_PAGES
  fetchedPages.forEach((fp) => {
    if (!displayedPages.some((dp) => dp.slug.toLowerCase() === fp.slug.toLowerCase())) {
      displayedPages.push({
        name: fp.name,
        slug: fp.slug,
        description: `Manage content for ${fp.name} page.`,
        id: fp.id,
        isExisting: true,
      })
    }
  })

  return (
    <div className="w-full animate-in pt-2 duration-700 fade-in slide-in-from-bottom-4">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Content Management System
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure site pages, branding, footers, and section content.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {displayedPages.map((page) => (
            <div
              key={page.slug}
              className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div>
                <h3 className="mb-2 pr-8 text-[17px] font-bold text-foreground capitalize">
                  Manage {page.name} Page
                </h3>
                <p className="mb-6 text-[13px] leading-relaxed text-muted-foreground">
                  {page.description}
                </p>
              </div>
              <Link
                to={page.id ? `/cms/${page.slug}&&${page.id}` : `/cms/${page.slug}`}
                className="group/link inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
              >
                Edit {page.name} Page
                <span className="transition-transform group-hover/link:translate-x-1">
                  &rarr;
                </span>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

