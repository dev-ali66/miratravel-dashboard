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
    value: "",
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
    show: "video",
    color: {
      color: "#171717",
      opacity: 100,
      width: "100%",
      height: "100%",
      aspectRatio: "auto",
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
    show: "image",
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
    show: "color",
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
    show: "image",
    color: {
      ...emptyCanonicalMultimedia.color,
      color: "#EDE7D8",
    },
  },
  backgroundMultimedia: {
    ...emptyCanonicalMultimedia,
    show: "color",
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
  featured: false,
  price: null,
  priceType: "PER_PERSON",
  parentId: null,
  parent: null,
  hero: emptyHero,
  essence: emptyEssence,
  faq: emptyFaq,
  metadata: emptySeo,
  geoData: null,
}
