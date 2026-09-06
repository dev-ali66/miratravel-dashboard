import type { Journey } from "../journeyTypes"

export const emptyJourney: Journey = {
  id: undefined,
  slug: "",
  title: "",
  subtitle: null,
  price: 0,
  currency: "EUR",
  minDays: 1,
  maxDays: 1,

  journeyHeroImage: [],
  journeyGallery: [],
  highlights: [],
  included: [],
  notIncluded: [],

  journeyType: ["PRIVATE_JOURNEY"],
  travelStyle: ["CULTURE_HERITAGE"],
  perfectFor: ["COUPLES"],
  pace: "BALANCED",
  comfortLevel: "BOUTIQUE",

  status: "DRAFT",
  featured: false,

  metadata: {
    seo: {
      title: null,
      description: null,
      keywords: [],
      canonicalUrl: null,
    },
  },

  data: {
    hero: {
      title: null,
      subtitle: null,
      background_image: null,
      video: null,
      backgroundMultimedia: null,
      tags: [],
      highlightBadge: null,
      priceSuffix: "per person",
      occupancyText: "Based on double occupancy",
      taxesLabel: "Taxes & fees",
      taxesValue: "Calculated at checkout",
      ctaText: "Request This Journey",
      contactPromptText: "Questions on this journey?",
      benefits: [],
    },
    whyWeDesigned: {
      title: "Why we designed this journey?",
      paragraphs: [],
      signature: "— MIRA",
    },
    isThisForYou: {
      title: "Is this Journey for you?",
      items: [],
    },
    overviewList: {
      title: "Journey Overview",
      titlegraphs: [],
      highlightsTitle: "Highlights",
      highlights: [],
    },
    route: {
      title: "Route Overview",
      description: null,
      mapImage: null,
      stops: [],
    },
    accommodation: {
      philosophy: {
        badge: "ACCOMMODATION PHILOSOPHY",
        title: "Where You Will Stay",
        description: null,
        principles: [],
      },
      destinations: {
        badge: "DESTINATION BY DESTINATION",
        title: "Selected Properties",
        description: null,
        stays: [],
      },
    },
    whatsIncluded: {
      includedTitle: "What's Included",
      includedItems: [],
      notIncludedTitle: "What's Not Included",
      notIncludedItems: [],
      importantInfoTitle: "Important Notes",
      importantInfoItems: [],
    },
    addons: {
      title: "Optional Add-ons",
      subtitle: null,
      items: [],
    },
    itinerary: {
      title: "Day-by-Day Itinerary",
      subtitle: null,
      days: [],
    },
  },

  itinerary: [],
  accommodations: null,
  addOns: [],
}
