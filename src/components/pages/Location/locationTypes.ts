export type ExperienceCard = {
    id: number
    image: string
    price: string
    title: string
    category: string
    subtitle: string
    action_text: string
    description: string
}

export type AccommodationStayItem = {
    id: string | number
    image?: string
    step?: string
    day?: number
    duration?: string
    city?: string
    location?: string
    subtitle?: string
    stayType?: string
    confirmedBy?: string
    confirmationBadge?: string
    description?: string
    nights?: number
}

export type PracticalItem = {
    id: string
    title: string
    content: string
    is_expanded: boolean
}

export type FAQItem = {
    id: number
    question: string
    answer: string
}

export type GalleryItem = {
    alt: string
    url: string
}

export type GuideArticle = {
    id: string
    number?: string
    category?: string
    title: string
    description?: string
    href?: string
    thumbnail: string
}

export const LOCATION_TYPES = [
    "CONTINENT",
    "SUBCONTINENT",
    "REGION",
    "COUNTRY",
    "ADMINISTRATIVE_AREA",
    "CITY",
    "TOWN",
    "VILLAGE",
    "DESTINATION",
    "PLACE",
    "LANDMARK",
] as const

export type LocationType = (typeof LOCATION_TYPES)[number]

export type LocationData = {
    id?: string

    name: string
    slug: string
    type: string
    parentId?: string | null

    /**
     * Included by the backend on every GET /locations response
     * (Prisma `include: { parent: true, children: true }`), so
     * edit-mode can resolve/display the current parent's name
     * without an extra request.
     */
    parent?: {
        id: string
        name: string
        type: string
    } | null

    children?: {
        id: string
        name: string
        type: string
    }[]

    createdAt?: string
    updatedAt?: string

    geoData: {
        area: {
            unit: string
            value: number
        }
        mapZoom: number
        latitude: number
        longitude: number
        timezone: string
    }

    metadata: {
        seo: {
            title: string
            keywords: string[]
            description: string
            canonicalUrl: string
        }
    }

    data: {
        name: string
        title: string
        subtitle: string
        description: string
        shortDescription: string

        hero: {
            title: string
            description: string
            breadcrumb: string
            background_image: string
            video?: string
            showVideo?: boolean
            button: {
                name: string
                url: string
            }
        }

        card: {
            title: string
            subtitle: string
            background_image: string
            button: {
                label: string
                url: string
            }
        }

        why: {
            subtitle: string
            title: string
            description_paragraphs: string[]
            image: string
            tags: string[]
        }

        info: {
            headline: string
            description: string
        }

        sharedInfo?: {
            text?: string
        }

        /**
         * Mirrors the real frontend `<Essence />` and
         * `<RegionEssence />` component props (label/title/
         * paragraphs/quote/imageSrc/imageAlt/statValue/statLabel
         * and optional facts). `style` is CMS-only: per-element
         * color/font-size overrides, editable in EssenceForm and
         * rendered by EssencePreview.
         */
        essence: {
            label: string
            title: string
            paragraphs: string[]
            quote: string
            imageSrc: string
            imageAlt: string
            statValue: string
            statLabel: string
            facts?: Array<{
                label: string
                value: string
                description: string
            }>

            style: {
                sectionBackgroundColor: string
                label: {
                    textColor: string
                    fontSize: string
                }
                title: {
                    textColor: string
                    fontSize: string
                }
                paragraph: {
                    textColor: string
                    fontSize: string
                }
                quote: {
                    textColor: string
                    fontSize: string
                }
                statBadge: {
                    backgroundColor: string
                    textColor: string
                }
            }
        }

        statistics: {
            area: {
                value: number
                unit: string
            }
            elevation: {
                value: number
                unit: string
            }
            population?: {
                value: number
                year: number
            }
        }

        climate: {
            types: string[]
            description: string
        }

        culture: {
            cuisine: string[]
            description: string
            majorLanguages: string[]
            majorReligions: string[]
            famousFestivals: string[]
        }

        safety: {
            description: string
            emergencyNumber: string
        }

        geography: {
            highestPoint: {
                name: string
                unit: string
                elevation: number
            }
            majorLandscapes: string[]
        }

        travelInfo: {
            visa: {
                description: string
            }

            currency: {
                description: string
                majorCurrency: string
            }

            bestTimeToVisit: {
                summer: string
                winter: string
                general: string
            }

            popularTransportation: string[]
        }

        experiences: {
            title: string
            location: string
            description: string
            load_more_button: string
            seasonInfo?: string
            seasonLocation?: string

            featured_experience: {
                image: string
                title: string
                category: string
                duration: string
                subtitle: string
                action_text: string
            }

            cards: ExperienceCard[]

            footer?: {
                note: string
                region: string
            }
        }

        practical_information: {
            title: string
            sub_heading: string
            side_image: string
            accordion_items: PracticalItem[]
        }

        faq_section: {
            image: string
            title: string
            questions: FAQItem[]
        }

        imageGalary: GalleryItem[]

        local_guide: {
            title: string
            sub_heading: string
            main_image: string
            articles: GuideArticle[]
        }

        travel_insights: {
            title: string
            sub_heading: string
            main_image: string
            articles: GuideArticle[]
        }

        accommodation_stays?: {
            badge?: string
            title?: string
            description?: string
            stays?: AccommodationStayItem[]
        }

        videoGalary: {
            alt: string
            url: string
            thumbnail: string
        }
    }
}