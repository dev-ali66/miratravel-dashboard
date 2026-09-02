/* =====================================================
   LOCATION — EMPTY / DEFAULT DRAFT
   Full default skeleton covering every one of the 18
   structured `data` sections plus geoData/metadata. Used
   for the Add flow (clean draft) and as the base object
   mergeWithDefaults() merges API data over.
===================================================== */

import type { LocationData } from "../locationTypes"

export const emptyLocation: LocationData = {
    name: "",
    slug: "",
    type: "PLACE",
    parentId: null,

    geoData: {
        area: {
            unit: "km²",
            value: 0,
        },

        mapZoom: 12,
        latitude: 0,
        longitude: 0,
        timezone: "",
    },

    metadata: {
        seo: {
            title: "",
            keywords: [],
            description: "",
            canonicalUrl: "",
        },
    },

    data: {
        name: "",
        title: "",
        subtitle: "",
        description: "",
        shortDescription: "",

        hero: {
            title: "",
            description: "",
            breadcrumb: "",
            background_image: "",
            video: "",
            showVideo: false,
            button: {
                name: "Explore Journey",
                url: "",
            },
        },

        card: {
            title: "",
            subtitle: "",
            background_image: "",
            button: {
                label: "EXPLORE",
                url: "",
            },
        },

        why: {
            subtitle: "",
            title: "",
            description_paragraphs: [""],
            image: "",
            tags: [],
        },

        info: {
            headline: "",
            description: "",
        },

        essence: {
            label: "The Essence of Albania",
            title: "A country that kept its secrets for fifty years",
            paragraphs: [
                "Albania spent half a century behind the world's most impenetrable iron curtain. What emerged was not a country broken by isolation, but one that had been preserved by it — its landscapes untouched, its culture intact, its people remarkable in their warmth.",
                "This is not a destination that will hold your hand. The roads are challenging, the language unfamiliar, the infrastructure still catching up with the ambition of its people. But for travellers who understand that the best experiences require some effort, Albania repays every mile.",
                "Unlike its Mediterranean neighbours, Albania has no mass-market image to overcome, no clichés to push past. You arrive with no preconceptions and leave with stories that nobody else has told.",
            ],
            quote: "You arrive with no preconceptions and leave with stories nobody else has told.",
            // left blank on purpose: the layout's own default
            // image is a local Next.js asset import, not a URL
            // this dashboard can reach — EssencePreview already
            // falls back to a real hosted placeholder image
            // whenever this is empty.
            imageSrc: "",
            imageAlt: "The Essence of Albania — landscapes and heritage",
            statValue: "2,753",
            statLabel: "km of rivers and lakes",
            facts: [],

            style: {
                sectionBackgroundColor: "",
                label: {
                    textColor: "#b45309",
                    fontSize: "",
                },
                title: {
                    textColor: "#1a2e05",
                    fontSize: "",
                },
                paragraph: {
                    textColor: "#4b5563",
                    fontSize: "",
                },
                quote: {
                    textColor: "#57534e",
                    fontSize: "",
                },
                statBadge: {
                    backgroundColor: "#ffffff",
                    textColor: "#1a2e05",
                },
            },
        },

        statistics: {
            area: {
                value: 0,
                unit: "km²",
            },

            elevation: {
                value: 0,
                unit: "m",
            },

            population: {
                value: 0,
                year: 2026,
            },
        },

        climate: {
            types: [],
            description: "",
        },

        culture: {
            cuisine: [],
            description: "",
            majorLanguages: [],
            majorReligions: [],
            famousFestivals: [],
        },

        safety: {
            description: "",
            emergencyNumber: "112",
        },

        geography: {
            highestPoint: {
                name: "",
                unit: "m",
                elevation: 0,
            },

            majorLandscapes: [],
        },

        travelInfo: {
            visa: {
                description: "",
            },

            currency: {
                description: "",
                majorCurrency: "",
            },

            bestTimeToVisit: {
                summer: "",
                winter: "",
                general: "",
            },

            popularTransportation: [],
        },

        experiences: {
            title: "Experiences",
            location: "",
            description: "",
            load_more_button: "Load More",
            seasonInfo: "All information is available on site. The season runs from May to October — book private activities in advance during peak periods.",
            seasonLocation: "",

            featured_experience: {
                image: "",
                title: "",
                category: "",
                duration: "",
                subtitle: "",
                action_text: "More info",
            },

            cards: [],

            footer: {
                note: "",
                region: "",
            },
        },

        practical_information: {
            title: "Before you travel",
            sub_heading: "PRACTICAL INFORMATION",
            side_image: "",
            accordion_items: [],
        },

        faq_section: {
            image: "",
            title: "Frequently Asked Questions",
            questions: [],
        },

        imageGalary: [],

        local_guide: {
            title: "Everything you need to know before you go",
            sub_heading: "LOCAL GUIDE ARTICLES",
            main_image: "",
            articles: [],
        },

        travel_insights: {
            title: "Everything you need to know before you go",
            sub_heading: "TRAVEL INSIGHTS",
            main_image: "",
            articles: [],
        },

        videoGalary: {
            alt: "",
            url: "",
            thumbnail: "",
        },
    },
}