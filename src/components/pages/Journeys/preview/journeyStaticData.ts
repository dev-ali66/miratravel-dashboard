/* =====================================================
   JOURNEYS — STATIC FRONTEND REFERENCE DATA
   Exact 1:1 match with frontend/lib/data/journey-overview.ts
===================================================== */

export const overviewHeroData = {
  title: "Ancient Albania & Beyond",
  imageSrc: "/images/overview-hero.png",
  posterSrc: "/images/overview-hero.png",
  videoSrc: "/videos/overview-hero.mp4",
  imageAlt: "Ancient Albania & Beyond",
  tags: [
    "Self-drive",
    "Private Journey",
    "Culture",
  ],
  highlightBadge: "Perfect for Couples • Slow Travel • First-time Albania",
  price: "€3,495",
  priceSuffix: "per person",
  occupancyText: "Based on double occupancy",
  taxesLabel: "Taxes & fees",
  taxesValue: "Calculated at checkout",
  ctaText: "Request This Journey",
  ctaHref: "",
  contactPromptText: "Questions on this journey?",
  contactLinkText: "Contact our travel experts",
  contactHref: "/contact-us",
  benefits: [
    "Free cancellation up to 60 days",
    "Flexible payment plans available",
    "Financial protection",
    "Personal travel specialist",
    "Direct local support",
  ],
}

export const journeyTabsData = [
  { id: "overview", label: "Overview" },
  { id: "itinerary", label: "Itinerary" },
  { id: "accommodation", label: "Accommodation" },
  { id: "included", label: "What's Included" },
  { id: "addons", label: "Add Onn’s" },
]

export const whyWeDesignedData = {
  title: "Why we designed this journey?",
  paragraphs: [
    "Lorem ipsum dolor sit amet consectetur. Viverra blandit neque at risus euismod tincidunt sit nec velit. Hendrerit potenti eleifend hendrerit lobortis enim duis duis rhoncus vulputate. Integer volutpat purus feugiat eros sed volutpat mauris faucibus.",
    "Lorem ipsum dolor sit amet consectetur. Egestas cras malesuada suscipit felis pretium. Rutrum eget eleifend est dui pulvinar elementum magnis. Vulputate commodo ultricies id tincidunt imperdiet mattis. Et nam consequat urna senectus molestie.\nElit at sed dignissim enim gravida elementum quis ut a. Nunc nunc commodo faucibus nisi cum. Amet neque diam iaculis.",
  ],
  signature: "— MIRA",
}

export const convinceData = {
  title: "Is this Journey for you?",
  items: [
    "You Love Culture and local traditions.",
    "You Love Culture and local traditions.",
    "You Love Culture and local traditions.",
    "You Love Culture and local traditions.",
    "You Love Culture and local traditions.",
  ],
}

export const overviewListData = {
  title: "Journey Overview",
  titlegraphs: [
    "Immerse yourself in the timeless beauty and rich history of Italy on this carefully curated 7-day journey. From the ancient ruins of Rome to the Renaissance splendor of Florence, experience the very best of Italian culture, cuisine, and art.",
    "This journey is designed for travelers who appreciate depth over breadth. Rather than rushing through a checklist of sites, we’ve built in time to truly absorb each destination. You’ll enjoy skip-the-line access to major attractions, private guided tours with expert historians, and authentic culinary experiences that reveal the soul of Italian culture.",
  ],
  highlightsTitle: "Highlights",
  highlights: [
    "Private Colosseum and Roman Forum tour",
    "Vatican Museums with art historian guide",
    "Pompeii archaeological exploration",
    "Tuscany wine tasting and cooking class",
    "Florence Renaissance art masterpieces",
    "Authentic trattoria dining experiences",
  ],
}

export const overviewGalleryData = {
  title: "Visuals & Moments",
  featuredImage: {
    src: "/images/albania-journey1.jpg",
    alt: "Featured Visual - Lake Koman",
  },
  secondaryImages: [
    {
      src: "/images/albania-journey2.png",
      alt: "Secondary Visual 1 - Theth Church",
    },
    {
      src: "/images/albania-journey3.png",
      alt: "Secondary Visual 2 - Valbona Pass",
    },
    {
      src: "/images/albania-journey4.jpg",
      alt: "Secondary Visual 3 - Historic Tower",
    },
    {
      src: "/images/albania-journey5.jpg",
      alt: "Secondary Visual 4 - Alpine Landscape",
    },
  ],
}

export const journeyRouteData = {
  title: "The Journey Route",
  description:
    "Lorem ipsum dolor sit amet consectetur. Viverra blandit neque at risus euismod tincidunt sit nec velit. Hendrerit potenti eleifend hendrerit lobortis enim duis duis rhoncus vulputate.",
  mapImage: {
    src: "/images/map-card.png",
    alt: "Journey Route Map",
  },
  stops: [
    { name: "Tirana", days: "Day 1-2" },
    { name: "Shkodër", days: "Day 3" },
    { name: "Theth", days: "Day 4-5" },
    { name: "Valbona", days: "Day 6-7" },
    { name: "Lake Koman", days: "Day 8" },
    { name: "Krujë", days: "Day 9-10" },
  ],
}

export const dayByDayItineraryData = {
  title: "Day by Day Itinerary",
  subtitle:
    "Lorem ipsum dolor sit amet consectetur. Viverra blandit neque at risus euismod tincidunt sit nec velit.",
  days: [
    {
      dayNumber: 1,
      dayLabel: "Day 1",
      title: "Arrive in Tirana & Welcome Dinner",
      location: "Tirana",
      detailedHeading: "ARRIVAL IN TIRANA & WELCOME DINNER",
      description:
        "Lorem ipsum dolor sit amet consectetur. Viverra blandit neque at risus euismod tincidunt sit nec velit. Hendrerit potenti eleifend hendrerit lobortis enim duis duis rhoncus vulputate. Integer volutpat purus feugiat eros sed volutpat mauris faucibus.",
      thumbnail: "/images/albania-journey1.jpg",
      images: [
        "/images/albania-journey1.jpg",
        "/images/albania-journey2.png",
        "/images/albania-journey3.png",
      ],
    },
    {
      dayNumber: 2,
      dayLabel: "Day 2",
      title: "Exploring Historic Shkodër & Rozafa Castle",
      location: "Shkodër",
      detailedHeading: "HISTORIC SHKODËR & ROZAFA FORTRESS",
      description:
        "Journey north to Shkodër, one of Europe's oldest continuously inhabited cities. Explore the ancient Illyrian Rozafa Castle with sweeping lake panoramas and the Venetian-style historic boulevard.",
      thumbnail: "/images/albania-journey2.png",
      images: [
        "/images/albania-journey2.png",
        "/images/albania-journey4.jpg",
      ],
    },
    {
      dayNumber: 3,
      dayLabel: "Day 3",
      title: "The Accursed Mountains & Theth Valley",
      location: "Theth",
      detailedHeading: "INTO THE ACCURSED MOUNTAINS",
      description:
        "Traverse high alpine switchbacks into the glacial valley of Theth. Visit the iconic 1892 stone reconciliation lock-in tower and the dramatic Grunas waterfall nestled beneath 2,500m limestone peaks.",
      thumbnail: "/images/albania-journey3.png",
      images: [
        "/images/albania-journey3.png",
        "/images/albania-journey5.jpg",
      ],
    },
    {
      dayNumber: 4,
      dayLabel: "Day 4",
      title: "Valbona Pass Traverse on Foot",
      location: "Valbona",
      detailedHeading: "ACROSS THE DRAMATIC VALBONA PASS",
      description:
        "A legendary traverse following shepherd trails through ancient beech forests and scree slopes, connecting isolated valleys that have preserved centuries of Kanun customary law.",
      thumbnail: "/images/albania-journey4.jpg",
      images: [
        "/images/albania-journey4.jpg",
        "/images/albania-journey6.jpg",
      ],
    },
    {
      dayNumber: 5,
      dayLabel: "Day 5",
      title: "Emerald Waters of Lake Koman Ferry",
      location: "Lake Koman",
      detailedHeading: "FJORD-LIKE WATERS OF KOMAN",
      description:
        "Board a scenic passenger boat navigating sheer limestone canyon walls rising straight out of turquoise waters, often described as one of the world's most spectacular inland ferry rides.",
      thumbnail: "/images/albania-journey5.jpg",
      images: [
        "/images/albania-journey5.jpg",
        "/images/albania-journey7.jpg",
      ],
    },
  ],
}

export const accommodationData = {
  philosophy: {
    badge: "Our Philosophy",
    title: "Selected for Character, Location, and Authentic Connection",
    description:
      "Lorem ipsum dolor sit amet consectetur. Viverra blandit neque at risus euismod tincidunt sit nec velit. Hendrerit potenti eleifend hendrerit lobortis enim duis duis rhoncus vulputate.",
    principles: [
      {
        icon: "character",
        title: "Distinct Character",
        description: "Stone kulla towers and restored merchant villas.",
      },
      {
        icon: "location",
        title: "Prime Setting",
        description: "Directly facing peaks, lakes, and ancient cobblestones.",
      },
      {
        icon: "comfort",
        title: "Subtle Comfort",
        description: "Locally woven linens, organic breakfasts, quiet nights.",
      },
      {
        icon: "connection",
        title: "Personal Connection",
        description: "Warm family hosts sharing authentic regional dishes.",
      },
    ],
  },
  destinations: {
    badge: "Destination by Destination",
    title: "Your Accommodation Journey",
    description:
      "Each destination on your route offers a distinct type of stay. Below we outline the character and setting of accommodation at each stop.",
    stays: [
      {
        step: "DAY 01-02",
        duration: "2 NIGHTS",
        city: "Tirana",
        stayType: "Boutique Heritage Hotel",
        description:
          "An intimate, design-forward retreat situated near the leafy Blloku quarter, blending Ottoman details with modern craft.",
        image: "/images/albania-journey6.jpg",
        confirmedBy: "Personally confirmed by Mira",
      },
      {
        step: "DAY 03-04",
        duration: "2 NIGHTS",
        city: "Theth Valley",
        stayType: "Traditional Alpine Kulla",
        description:
          "A lovingly preserved stone lodge surrounded by jagged peaks, offering homemade mountain cheeses and fireside conversation.",
        image: "/images/albania-journey7.jpg",
        confirmedBy: "Personally confirmed by Mira",
      },
      {
        step: "DAY 05",
        duration: "1 NIGHT",
        city: "Valbona",
        stayType: "Riverside Mountain Chalet",
        description:
          "Handcrafted timber rooms perched alongside the crystalline Valbona river with sweeping canyon vistas.",
        image: "/images/albania-journey8.jpg",
        confirmedBy: "Personally confirmed by Mira",
      },
    ],
  },
  standards: {
    badge: "STANDARDS",
    title: "What You Can Expect",
    description:
      "Independent character, quiet settings, and thoughtful local hospitality are non-negotiable across every property.",
    expectations: [
      "Private en-suite bathroom in all rooms",
      "Locally sourced, generous breakfast",
      "Quiet, contemplative surroundings",
      "High-speed Wi-Fi throughout",
      "Authentic regional architecture",
      "Dedicated personal host or concierge",
    ],
  },
  visualReference: {
    badge: "VISUAL REFERENCE",
    title: "Atmospheric Details",
    description:
      "A glimpse into the textures, morning views, and secluded gardens awaiting you.",
    featuredImage: {
      src: "/images/albania-journey9.jpg",
      alt: "Featured stay visual",
    },
    galleryImages: [
      {
        src: "/images/albania-journey1.jpg",
        alt: "Stay detail 1",
      },
      {
        src: "/images/albania-journey2.png",
        alt: "Stay detail 2",
      },
    ],
  },
}

export const whatsIncludedData = {
  includedTitle: "What's Included",
  includedItems: [
    "Private chauffeur-driven 4WD vehicle for mountain traverses",
    "Certified English-speaking mountain and cultural guides",
    "All boutique hotel and alpine guesthouse accommodations with breakfast",
    "Traditional family dinners in Theth and Valbona",
    "Lake Koman boat cruise and priority access",
    "All national park permits and entrance admissions",
    "24/7 dedicated in-country concierge support",
  ],
  notIncludedTitle: "What's Not Included",
  notIncludedItems: [
    "International transatlantic flights",
    "Personal travel and medical insurance",
    "Alcoholic beverages outside of guided tastings",
    "Gratuities for drivers and mountain guides",
  ],
  importantInfoTitle: "Important Information",
  importantInfoItems: [
    "Valbona Pass hike requires a good baseline level of fitness (6-7 hours hiking with 800m elevation gain).",
    "Pack sturdy, broken-in trail boots and breathable layered alpine clothing.",
    "Dietary preferences (vegetarian, vegan, allergies) are seamlessly arranged when communicated ahead.",
    "ATMs are unavailable in remote mountain valleys; cash for small personal purchases will be coordinated in Tirana.",
  ],
}

export const addonsData = {
  title: "Optional Journey Enhancements",
  items: [
    {
      id: 1,
      itemNumber: 1,
      title: "Private Sunset Wine Tasting in Historic Krujë",
      price: "€120 / person",
      dayLabel: "TIRANA & KRUJË",
      detailedHeading: "PRIVATE HISTORIC CELLAR TASTING",
      description:
        "Sample rare indigenous Kallmet and Shesh i Bardhë varietals paired with aged cheeses inside a private 17th-century castle vaulted cellar.",
      thumbnail: "/images/albania-journey4.jpg",
      image: "/images/albania-journey4.jpg",
    },
    {
      id: 2,
      itemNumber: 2,
      title: "Helicopter Hop: Tirana to Theth Alpine Peaks",
      price: "€850 / flight",
      dayLabel: "MOUNTAIN PASS",
      detailedHeading: "AERIAL SPECTACLE OF THE ACCURSED PEAKS",
      description:
        "Bypass highway switchbacks with an exhilarating 25-minute flight soaring over the sheer limestone cliffs of the north.",
      thumbnail: "/images/albania-journey5.jpg",
      image: "/images/albania-journey5.jpg",
    },
    {
      id: 3,
      itemNumber: 3,
      title: "Traditional Artisan Culinary Masterclass",
      price: "€95 / person",
      dayLabel: "SHKODËR",
      detailedHeading: "HANDS-ON GASTRONOMY WITH A MASTER CHEF",
      description:
        "Learn the delicate art of wood-fired tava kosi and flaky byrek alongside a celebrated local culinary preservationist.",
      thumbnail: "/images/albania-journey6.jpg",
      image: "/images/albania-journey6.jpg",
    },
  ],
}

export const similarJourneysData = {
  title: "Similar Journeys",
  subtitle:
    "Other carefully curated routes across the region that might capture your imagination.",
  journeys: [
    {
      id: "albanian-riviera",
      title: "The Wild Coast & Ancient Ports",
      description: "From secluded Ionian coves to Ottoman stone hillside towns.",
      image: "/images/explore-journey1.png",
      days: "7 DAYS",
      label: "COASTAL ESCAPE",
      priceFrom: "€2,400",
      tags: ["COASTAL", "CULTURE", "BOUTIQUE"],
    },
    {
      id: "unesco-heritage-crossroads",
      title: "UNESCO Stone Cities & Canyon Trails",
      description: "Centuries of cultural harmony, fortress vistas, and thermal springs.",
      image: "/images/explore-journey2.png",
      days: "8 DAYS",
      label: "HERITAGE FOCUS",
      priceFrom: "€2,650",
      tags: ["HERITAGE", "SLOW TRAVEL", "WINE"],
    },
    {
      id: "alps-to-adriatic",
      title: "High Alps to Turquoise Adriatic",
      description: "The complete journey bridging dramatic north gorges and warm southern seas.",
      image: "/images/explore-journey3.png",
      days: "12 DAYS",
      label: "SIGNATURE ROUTE",
      priceFrom: "€3,900",
      tags: ["SIGNATURE", "EXPEDITION", "LUXURY"],
    },
  ],
}
