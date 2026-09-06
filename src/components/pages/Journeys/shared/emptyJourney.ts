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
      badge: "Signature Journey",
      title: null,
      subtitle: null,
      buttons: [
        {
          label: "Request This Journey",
          url: "#request",
          style: "primary",
          backgroundColor: "#235347",
          textColor: "#FFFFFF",
        },
        {
          label: "Questions on this journey?",
          url: "/contact-us",
          style: "link",
          textColor: "#464136",
        },
        {
          label: "Contact our travel experts",
          url: "/contact-us",
          style: "link",
          textColor: "#af6348",
        },
      ],
    },
    accommodation: {
      philosophy: "We handpick authentic boutique properties, alpine lodges, and heritage stays.",
      stays: [],
    },
    gallery: {
      title: "Journey Visuals & Moments",
      images: [],
    },
    itinerary: [],
    addons: [],
  },

  itinerary: [],
  accommodations: null,
  addOns: [],
}
