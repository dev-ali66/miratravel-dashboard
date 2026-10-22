import type { ExperienceData } from "../experienceTypes"

export const emptyCanonicalMultimedia = {
  show: "color" as const,
  image: {
    url: "",
    alt: "",
    opacity: 100,
    overlayColor: "#000000",
    overlayOpacity: 0,
    width: "100%",
    height: "auto",
    aspectRatio: "auto",
    fit: "cover",
  },
  video: {
    url: "",
    alt: "",
    autoplay: true,
    loop: true,
    muted: true,
    opacity: 100,
    overlayColor: "#000000",
    overlayOpacity: 0,
    width: "100%",
    height: "auto",
    aspectRatio: "auto",
    fit: "cover",
  },
  color: {
    color: "#171717",
    opacity: 100,
    width: "100%",
    height: "100%",
    aspectRatio: "auto",
  },
}

export const emptyHero = {
  breadcrumb: {
    value: "EXPERIENCES",
    textColor: "#d29393",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  title: {
    value: "",
    textColor: "#FFFFFF",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  subtitle: {
    value: "",
    textColor: "#E5E7EB",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  description: {
    value: "",
    textColor: "#F3F4F6",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  isCenter: false,
  buttons: [],
  backgroundMultimedia: {
    ...emptyCanonicalMultimedia,
    show: "video" as const,
    color: {
      color: "#171717",
      opacity: 100,
      width: "100%",
      height: "100%",
      aspectRatio: "auto",
    },
  },
}

export const emptyTheExperience = {
  label: {
    value: "THE EXPERIENCE",
    textColor: "#af6348",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  title: {
    value: "",
    textColor: "#182d09",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  summary: {
    value: "",
    textColor: "#565e69",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  narrative: {
    value: "",
    textColor: "#333333",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  quote: {
    value: "",
    textColor: "#182d09",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  imageMultimedia: {
    ...emptyCanonicalMultimedia,
    show: "image" as const,
    image: {
      ...emptyCanonicalMultimedia.image,
      url: "",
      alt: "The Experience",
    },
  },
  backgroundMultimedia: {
    ...emptyCanonicalMultimedia,
    show: "color" as const,
    color: {
      ...emptyCanonicalMultimedia.color,
      color: "#FFFFFF",
    },
  },
}

export const emptyHighlights = {
  label: {
    value: "KEY HIGHLIGHTS",
    textColor: "#af6348",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  title: {
    value: "What makes this unforgettable",
    textColor: "#182d09",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  items: [
    {
      id: "h1",
      badge: "Highlight 01",
      title: {
        value: "",
        textColor: "#182d09",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      description: {
        value: "",
        textColor: "#565e69",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
    },
    {
      id: "h2",
      badge: "Highlight 02",
      title: {
        value: "",
        textColor: "#182d09",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      description: {
        value: "",
        textColor: "#565e69",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
    },
    {
      id: "h3",
      badge: "Highlight 03",
      title: {
        value: "",
        textColor: "#182d09",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      description: {
        value: "",
        textColor: "#565e69",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
    },
  ],
}

export const emptyPracticalInfo = {
  duration: {
    value: "Half Day (~4 hours)",
    textColor: "#182d09",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  season: {
    value: "May – October",
    textColor: "#182d09",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  activityLevel: {
    value: "Moderate — comfortable walking pace",
    textColor: "#182d09",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  groupSize: {
    value: "Private (2-8 guests)",
    textColor: "#182d09",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  locationNotes: {
    value: "Direct pick-up from your accommodation or dedicated rendezvous point.",
    textColor: "#565e69",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
}

export const emptyMiraTouch = {
  label: {
    value: "THE MIRA TOUCH",
    textColor: "#af6348",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  title: {
    value: "Distinction, Privacy & Insider Access",
    textColor: "#182d09",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  description: {
    value: "Every MIRA experience is curated with private access, master hosts, and bespoke comfort designed around your journey rhythm.",
    textColor: "#565e69",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  items: [
    {
      title: {
        value: "Private Insider Access",
        textColor: "#182d09",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      description: {
        value: "Behind-the-scenes access unavailable to general visitors.",
        textColor: "#565e69",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
    },
    {
      title: {
        value: "Local Master Guide",
        textColor: "#182d09",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      description: {
        value: "Accompanied by dedicated specialists and respected local storytellers.",
        textColor: "#565e69",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
    },
  ],
  imageMultimedia: {
    ...emptyCanonicalMultimedia,
    show: "image" as const,
    image: {
      ...emptyCanonicalMultimedia.image,
      url: "",
      alt: "The MIRA Touch",
    },
  },
}

export const emptyEnquiryCta = {
  title: {
    value: "Include This Experience in Your Journey",
    textColor: "#FFFFFF",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  subtitle: {
    value: "Our travel architects will seamlessly integrate this into your bespoke itinerary.",
    textColor: "#E5E7EB",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  badgeText: "EXPERIENCE RESERVATION",
  primaryButtonText: "Include in My Journey",
  secondaryButtonText: "Enquire About This Experience",
  note: {
    value: "Available exclusively for MIRA bespoke journeys.",
    textColor: "#9CA3AF",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  backgroundMultimedia: {
    ...emptyCanonicalMultimedia,
    show: "color" as const,
    color: {
      ...emptyCanonicalMultimedia.color,
      color: "#182d09",
    },
  },
}

export const emptyEssence = {
  label: {
    value: "EXPERIENCE ESSENCE",
    textColor: "#af6348",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  title: {
    value: "",
    textColor: "#182d09",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  paragraphs: {
    value: "",
    textColor: "#565e69",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  quote: {
    value: "",
    textColor: "#1A1209",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  stat: {
    statValue: {
      value: "",
      textColor: "#ffffff",
      textOpacity: 1,
      backgroundColor: null,
      backgroundOpacity: 1,
    },
    statLabel: {
      value: "",
      textColor: "#ffffff",
      textOpacity: 0.75,
      backgroundColor: null,
      backgroundOpacity: 1,
    },
    statBadgeBg: "#E5A84B",
  },
  imageMultimedia: {
    ...emptyCanonicalMultimedia,
    show: "image" as const,
    image: {
      ...emptyCanonicalMultimedia.image,
      url: "",
      alt: "Featured Experience",
      height: "100%",
    },
    color: {
      ...emptyCanonicalMultimedia.color,
      color: "#EDE7D8",
    },
  },
  backgroundMultimedia: {
    ...emptyCanonicalMultimedia,
    show: "color" as const,
    color: {
      ...emptyCanonicalMultimedia.color,
      color: "#FFF8F2",
    },
  },
}

export const emptyFaq = {
  title: {
    value: "Frequently Asked Questions",
    textColor: "#182d09",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  imageMultimedia: {
    ...emptyCanonicalMultimedia,
    show: "image" as const,
    color: {
      ...emptyCanonicalMultimedia.color,
      color: "#EDE7D8",
    },
  },
  backgroundMultimedia: {
    ...emptyCanonicalMultimedia,
    show: "color" as const,
    color: {
      ...emptyCanonicalMultimedia.color,
      color: "#F8F5EE",
    },
  },
  items: [],
}

export const emptySeo = {
  seo: {
    title: "",
    description: "",
    keywords: [] as string[],
    canonicalUrl: "",
    robots: {
      index: true,
      follow: true,
    },
  },
}

export const emptyExperience: ExperienceData = {
  name: "",
  slug: "",
  status: "DRAFT",
  featured: false,
  primaryType: "CULTURE_HERITAGE",
  secondaryTypes: [],
  attributes: ["PRIVATE"],
  price: 0,
  currency: "EUR",
  priceType: "PER_PERSON",
  countryId: null,
  country: null,
  regionId: null,
  region: null,
  placeId: null,
  place: null,
  parentId: null,
  parent: null,
  subtitle: "",
  summary: "",
  theExperience: emptyTheExperience,
  highlights: emptyHighlights,
  practicalInfo: emptyPracticalInfo,
  miraTouch: emptyMiraTouch,
  enquiryCta: emptyEnquiryCta,
  journeys: [],
  stories: [],
  hero: emptyHero,
  essence: emptyEssence,
  faq: emptyFaq,
  metadata: emptySeo,
  geoData: null,
}
