import type { JourneyData } from "../journeyTypes"

export const emptyJourney: JourneyData = {
  slug: "",
  title: "",
  subtitle: "",
  price: 1500,
  currency: "EUR",
  minDays: 5,
  maxDays: 7,
  pace: "BALANCED",
  comfortLevel: "BOUTIQUE",
  status: "DRAFT",
  featured: false,

  journeyType: ["PRIVATE_JOURNEY"],
  travelStyle: ["CULTURE_HERITAGE"],
  perfectFor: ["COUPLES"],

  hero: {
    label: "MIRA EXCLUSIVE JOURNEY",
    title: "",
    subtitle: "",
    badge: "Bespoke Experience",
    buttons: [],
    background_image: "",
    video: "",
    backgroundMultimedia: {
      show: "image",
      image: {
        url: "",
        alt: "",
        opacity: 1,
        fit: "cover",
      },
    },
    style: {},
  },

  overview: {
    badge: "Journey Overview",
    title: "Experience Unrivaled Luxury",
    subtitle: "Curated experiences tailored to perfection",
    overviewText: "",
    highlightsList: [],
    routeSummary: "",
    featuresList: [],
    backgroundMultimedia: {
      show: "color",
      color: {
        color: "#ffffff",
        opacity: 1,
      },
    },
    style: {},
  },

  itinerary: {
    badge: "Day by Day",
    title: "Crafted Itinerary",
    description: "Detailed daily journey highlights and schedule.",
    chaptersList: [
      {
        id: "chap-1",
        chapterNumber: "Chapter I",
        title: "The Beginning",
        subtitle: "Days 1–3 · Tirana & surroundings",
        description: "Introductory exploration of historic Albanian architecture and culinary culture.",
        days: [
          {
            id: "day-1",
            dayNumber: 1,
            title: "Arrival in Tirana & Welcome Cocktail",
            subtitle: "Private airport transfer",
            location: "Tirana",
            description: "Arrive at Tirana airport with private transfer to your boutique hotel. Enjoy an evening welcome cocktail and traditional introductory dinner.",
            stayName: "Plaza Hotel Tirana",
            image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "day-2",
            dayNumber: 2,
            title: "Historic Berat Castle & Wine Tasting",
            subtitle: "UNESCO fortress grounds",
            location: "Berat",
            description: "Explore the UNESCO listed town of Berat, visit the castle grounds, and enjoy exclusive wine tasting at a family vineyard.",
            stayName: "Mangalem Heritage Hotel",
            image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "day-3",
            dayNumber: 3,
            title: "Gjirokastër Stone City Exploration",
            subtitle: "Ottoman architecture & fortress",
            location: "Gjirokastër",
            description: "Discover Gjirokastër's Ottoman architecture, ancient fortress museum, and artisan craft bazaar.",
            stayName: "Gjirokastër Castle Hotel",
            image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
          },
        ],
      },
      {
        id: "chap-2",
        chapterNumber: "Chapter II",
        title: "Into the Mountains",
        subtitle: "Days 4–7 · Northern Alps & Valbona",
        description: "Breathtaking mountain passes, pristine alpine valleys, and secluded waterfalls.",
        days: [
          {
            id: "day-4",
            dayNumber: 4,
            title: "Theth National Park & Blue Eye Exploration",
            subtitle: "Alpine springs & isolation tower",
            location: "Theth",
            description: "Journey into the heart of the Albanian Alps. Hike to the natural turquoise Blue Eye spring and visit the traditional lock-in tower.",
            stayName: "Theth Alpine Sanctuary",
            image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
          },
        ],
      },
    ],
    daysList: [
      {
        id: "day-1",
        dayNumber: 1,
        title: "Arrival in Tirana & Welcome Cocktail",
        subtitle: "Private transfer & introductory dinner",
        duration: "Full Day",
        location: "Tirana",
        description: "Arrive at your destination with seamless VIP airport assistance.",
        meals: ["Dinner"],
        activities: ["Private Transfer", "Welcome Cocktail"],
        highlights: ["Bespoke Hospitality"],
        stayName: "Plaza Hotel Tirana",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      },
    ],
    backgroundMultimedia: {
      show: "color",
      color: {
        color: "#FAF6F0",
        opacity: 1,
      },
    },
    style: {},
  },

  accommodations: {
    badge: "Where You Stay",
    title: "Handpicked Luxury Stays",
    description: "Exquisite accommodations curated for comfort and style.",
    staysList: [
      {
        id: "stay-1",
        name: "Grand Horizon Sanctuary",
        stayType: "Luxury Resort",
        city: "Main Region",
        duration: "3 Nights",
        nights: 3,
        description: "Enjoy panoramic views, personal butler service, and private spa access.",
        imageMultimedia: {
          show: "image",
          image: { url: "", alt: "" },
        },
        amenities: ["Private Pool", "Spa & Wellness", "Gourmet Dining"],
        websiteUrl: "",
      },
    ],
    backgroundMultimedia: {
      show: "color",
      color: {
        color: "#ffffff",
        opacity: 1,
      },
    },
    style: {},
  },

  whatsIncluded: {
    badge: "Inclusions",
    title: "What's Included & Excluded",
    description: "Transparent details on all amenities and services provided.",
    inclusions: [
      {
        id: "inc-1",
        category: "Stays & Dining",
        title: "All Boutique Accommodations",
        description: "Includes daily luxury breakfasts and selected dinners.",
      },
      {
        id: "inc-2",
        category: "Transport",
        title: "Private Chauffeur & Transfers",
        description: "Dedicated high-end vehicle throughout the journey.",
      },
    ],
    exclusions: [
      {
        id: "exc-1",
        category: "Flights",
        title: "International Airfare",
        description: "Flights to and from arrival airport are excluded.",
      },
    ],
    notes: ["Travel insurance is highly recommended.", "Custom extensions available upon request."],
    backgroundMultimedia: {
      show: "color",
      color: {
        color: "#f8fafc",
        opacity: 1,
      },
    },
    style: {},
  },

  addOns: {
    badge: "Optional Upgrades",
    title: "Enhance Your Journey",
    description: "Select exclusive experiences to personalize your stay.",
    itemsList: [
      {
        id: "addon-1",
        title: "Private Helicopter Scenic Flight",
        category: "Excursion",
        duration: "45 Mins",
        price: 450,
        currency: "EUR",
        description: "Breathtaking aerial views over mountains and coastline.",
        features: ["Private Pilot", "Champagne Service"],
        imageMultimedia: {
          show: "image",
          image: { url: "", alt: "" },
        },
      },
    ],
    backgroundMultimedia: {
      show: "color",
      color: {
        color: "#ffffff",
        opacity: 1,
      },
    },
    style: {},
  },

  gallery: {
    badge: "Visual Story",
    title: "Journey Gallery",
    description: "Immerse yourself in the atmosphere of this destination.",
    items: [],
    backgroundMultimedia: {
      show: "color",
      color: {
        color: "#0f172a",
        opacity: 1,
      },
    },
    style: {},
  },

  metadata: {
    seo: {
      metaTitle: "",
      metaDescription: "",
      metaKeywords: [],
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      canonicalUrl: "",
    },
  },

  data: {},
}
