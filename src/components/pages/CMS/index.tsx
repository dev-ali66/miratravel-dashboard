import MiraLoader from "@/components/shared/MiraLoader"
import { useGetPages } from "@/hooks/cms/useGetPages"
import { Link } from "react-router-dom"
import { FileText, Layers, Globe, CheckCircle2 } from "lucide-react"
import { PageHeader, CompactStatCard } from "@/components/shared/PageHeader"

export default function CMSPage() {
  const { data, isLoading } = useGetPages()

  const fetchedPages = data?.data ?? []

  const STANDARD_PAGES = [
    { name: "Home", slug: "home", description: "Manage homepage content, sections, theme and media." },
    { name: "About Us", slug: "about-us", description: "Manage about us hero, philosophy, approach, regional knowledge, and people." },
    { name: "Journey CMS", slug: "journey", description: "Manage Journey CMS hero banner, editorial highlight, signature journeys, all journeys header, and SEO." },
    { name: "Stories CMS", slug: "stories", description: "Manage Stories CMS hero banner, mira stories, and SEO." },
    { name: "Newsletter CMS", slug: "newsletter", description: "Manage Newsletter subscription title, introductory text, email input label, placeholders, and SEO." },
    { name: "FAQ", slug: "faq", description: "Manage FAQ page intro, topics, questions & answers, advice card, note CTA, and SEO." },
    { name: "Contact Us", slug: "contact-us", description: "Manage contact page hero, process steps, inquiry form, and contact details." },
    { name: "Footer", slug: "footer", description: "Manage site footer, links, social media, and copyright." },
  ]

  const ALLOWED_SLUGS = ["home", "about-us", "journey", "journeys", "stories", "newsletter", "faq", "contact-us", "footer"]

  // Combine standard pages with any extra allowed pages from API
  const displayedPages = STANDARD_PAGES.filter((p) =>
    ALLOWED_SLUGS.includes(p.slug.toLowerCase())
  ).map((stdPage) => {
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
    if (
      ALLOWED_SLUGS.includes(fp.slug.toLowerCase()) &&
      !displayedPages.some((dp) => dp.slug.toLowerCase() === fp.slug.toLowerCase())
    ) {
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
      <PageHeader
        icon={FileText}
        title="Content Management"
        subtitle="Configure site pages, branding, footers, and section content."
        stats={
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full">
            <CompactStatCard
              label="Templates"
              value={`${displayedPages.length} Pages`}
              subtext="Site page layouts"
              icon={FileText}
              iconColor="text-primary"
            />
            <CompactStatCard
              label="DB Synced"
              value={`${displayedPages.filter((p) => p.isExisting).length} Active`}
              subtext="Saved in  DB"
              icon={CheckCircle2}
              iconColor="text-emerald-500"
            />
            <CompactStatCard
              label="Core Slugs"
              value={`${ALLOWED_SLUGS.length} Defined`}
              subtext="Protected routes"
              icon={Layers}
              iconColor="text-blue-500"
            />
            <CompactStatCard
              label="Delivery"
              value="Headless"
              subtext="Zero downtime cache"
              icon={Globe}
              iconColor="text-purple-500"
            />
          </div>
        }
      />

      {isLoading ? (
        <MiraLoader text="Loading CMS pages..." className="py-12 min-h-[300px]" />
      ) : (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
          {displayedPages.map((page) => (
            <div
              key={page.slug}
              className="group relative flex flex-col gap-2 justify-between overflow-hidden rounded-xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div>
                <h3 className=" text-[14px] font-bold text-foreground capitalize">
                  Manage : {page.name} Page
                </h3>
                <p className=" text-[13px] leading-relaxed text-muted-foreground">
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

