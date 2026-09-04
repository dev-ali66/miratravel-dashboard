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

        sharedInfo: {
            text: "Add shared info details here.",
            style: {
                backgroundColor: "#FFFFFF",
                textColor: "#C97B4A",
            },
        },

        regionGlance: {
            label: "REGION AT A GLANCE",
            title: "A glimpse of the region",
            description:
                "Discover the landscapes, culture and places that shape this remarkable destination.",
            style: {
                backgroundColor: "#F7F6F2",
                labelTextColor: "#C97B4A",
                titleTextColor: "#1A2E2A",
                descriptionTextColor: "#737373",
            },
        },

        regionCharacter: {
            label: "Character",
            title: "What makes North Albania singular",
            items: [
                {
                    id: "alpine-wilderness",
                    icon: "mountain",
                    title: "Untouched Alpine Wilderness",
                    description: "The Accursed Mountains offer trekking with a frontier quality that the Alps lost generations ago, without the crowds.",
                    href: "/destinations/albania/north-albania/wilderness",
                    linkText: "Read More",
                },
                {
                    id: "highland-culture",
                    icon: "home",
                    title: "Living Highland Culture",
                    description: "Ancient highland traditions remain informally observed in remote villages, genuinely alive and part of daily life.",
                    href: "/destinations/albania/north-albania/culture",
                    linkText: "Read More",
                },
                {
                    id: "slow-journeys",
                    icon: "compass",
                    title: "The Great Slow Journeys",
                    description: "The Komani Lake ferry and Valbona-to-Theth trail remain unhurried experiences that are impossible to replicate.",
                    href: "/destinations/albania/north-albania/slow-journeys",
                    linkText: "Read More",
                },
            ],
            style: {
                backgroundColor: "#F7F6F2",
                borderColor: "#DED9D2",
                labelTextColor: "#C97B4A",
                titleTextColor: "#1A2E2A",
                descriptionTextColor: "#737373",
                iconColor: "#C97B4A",
                hoverBackgroundColor: "#D4D4D4",
                linkTextColor: "#C97B4A",
            },
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
            facts: [
                {
                    label: "Highest Peak",
                    value: "2,694 m",
                    description: "Jezerca, Accursed Mountains",
                },
                {
                    label: "Area Covered",
                    value: "6,680 km²",
                    description: "Shkodër & Kukës counties",
                },
                {
                    label: "Language",
                    value: "Gheg Albanian",
                    description: "Italian among younger locals",
                },
                {
                    label: "Best Access",
                    value: "Shkodër",
                    description: "3 hrs north of Tirana",
                },
                {
                    label: "Trek Season",
                    value: "May - Oct",
                    description: "Peak window: Jul-Sep",
                },
                {
                    label: "Currency",
                    value: "Albanian Lek",
                    description: "Cash only in mountains",
                },
            ],
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
            style: {
                backgroundColor: "#171717",
                iconColor: "#666666",
                labelTextColor: "#666666",
                titleTextColor: "#FFFFFF",
                descriptionTextColor: "#8C8C8C",
                valueTextColor: "#B3B3B3",
            },
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
            beforeTravel: {
                label: "BEFORE YOU TRAVEL",
                title: "Everything you need to know before you go",
                image: "",
                imageAlt: "Travel landscape",
                items: [
                    { id: "getting-there", title: "Getting there", content: "Plan your route carefully and allow time for the journey." },
                    { id: "what-to-pack", title: "What to pack", content: "Pack comfortable layers and essentials suited to the season." },
                    { id: "local-customs", title: "Local customs", content: "A little local knowledge makes every journey more rewarding." },
                ],
                style: {
                    backgroundColor: "#E9E7DF",
                    labelTextColor: "#C97B4A",
                    titleTextColor: "#1A1814",
                    bodyTextColor: "#737373",
                    borderColor: "rgba(41,37,32,0.15)",
                    iconColor: "#737373",
                },
            },

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