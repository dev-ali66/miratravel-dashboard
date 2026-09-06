import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. REAL DATA JSON WITH REAL HTTPS IMAGES
const realJourney = {
  // --- Prisma Database Top-Level Model Fields ---
  id: "clx9a8b7c0001journeymira2026",
  slug: "ancient-albania-and-beyond",
  title: "Ancient Albania & Beyond",
  subtitle: "A curated 7-day luxury expedition across jagged alpine peaks, Ottoman citadel heritage, and turquoise coastal fjords.",
  price: 3495.00,
  currency: "EUR",
  minDays: 7,
  maxDays: 10,
  journeyHeroImage: [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1800&q=85"
  ],
  journeyGallery: [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
  ],
  highlights: [
    "Private Colosseum of Shkodra & Venetian Rozafa Fortress exploration",
    "Scenic Lake Koman navigation via traditional emerald water cruise",
    "Hike the legendary Valbona to Theth Pass with certified alpine guides",
    "Restored Ottoman stone tower (kulla) stay with private chef gastronomy",
    "Ancient UNESCO citadel of Berat & artisan vintage cellar tasting",
    "Secluded Ionian coastal coves and Byzantine monastery at Butrint"
  ],
  included: [
    "Private chauffeur-driven 4WD luxury vehicle for entire expedition",
    "Certified English-speaking mountain and cultural art historian guides",
    "All boutique heritage hotel and alpine kulla accommodations with breakfast",
    "All gourmet dinners featuring farm-to-table regional gastronomy",
    "Lake Koman private boat charter and priority national park admissions",
    "24/7 dedicated in-country personal concierge and travel specialist"
  ],
  notIncluded: [
    "International transatlantic and intra-European flights",
    "Comprehensive personal travel and medical insurance",
    "Alcoholic beverages outside of curated private wine tastings",
    "Discretionary personal expenses, spa treatments, and gratuities"
  ],
  journeyType: [
    "PRIVATE_JOURNEY",
    "SELF_DRIVE_JOURNEY"
  ],
  travelStyle: [
    "CULTURE_HERITAGE",
    "MOUNTAINS",
    "SLOW_TRAVEL",
    "LUXURY"
  ],
  perfectFor: [
    "COUPLES",
    "NATURE_LOVERS",
    "FIRST_TIME_VISITORS",
    "FOOD_WINE"
  ],
  pace: "BALANCED",
  comfortLevel: "BOUTIQUE",
  status: "PUBLISHED",
  featured: true,
  createdAt: "2026-03-01T10:00:00.000Z",
  updatedAt: "2026-03-05T14:30:00.000Z",

  // --- Metadata (SEO & Versioning) ---
  metadata: {
    seo: {
      metaTitle: "Ancient Albania & Beyond | Luxury Bespoke Journeys by MIRA",
      metaDescription: "Experience an intimate 7-day traverse through Albania's Accursed Mountains, Ottoman citadels, and turquoise waters with private guides and heritage stays.",
      metaKeywords: [
        "luxury albania journey",
        "theth valley",
        "valbona pass trek",
        "lake koman cruise",
        "berat unesco",
        "mira journeys"
      ],
      ogTitle: "Ancient Albania & Beyond — Handcrafted Alpine & Cultural Traverse",
      ogDescription: "An immersive journey through remote alpine towers, emerald glacial rivers, and ancient UNESCO stonework.",
      ogImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      canonicalUrl: "https://mira-travel.com/journeys/ancient-albania-and-beyond",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "TouristTrip",
        "name": "Ancient Albania & Beyond",
        "touristType": [
          "Cultural",
          "Adventure",
          "Luxury"
        ],
        "offers": {
          "@type": "Offer",
          "price": "3495.00",
          "priceCurrency": "EUR"
        }
      }
    },
    version: 1,
    author: "MIRA Curators"
  },

  // --- Layout Data (Sections & Subcomponents) ---
  data: {
    // 1. Hero Section
    hero: {
      title: "Ancient Albania & Beyond",
      subtitle: "A curated 7-day luxury expedition across jagged alpine peaks and Ottoman citadel heritage.",
      price: "€3,495",
      priceSuffix: "per person",
      occupancyText: "Based on double occupancy",
      taxesLabel: "Taxes & fees",
      taxesValue: "Calculated at checkout",
      ctaText: "Request This Journey",
      ctaHref: "#request",
      contactPromptText: "Questions on this journey?",
      contactLinkText: "Contact our travel experts",
      contactHref: "/contact-us",
      benefits: [
        "Free cancellation up to 60 days",
        "Flexible payment plans available",
        "Financial protection",
        "Personal travel specialist",
        "Direct local support"
      ],
      backgroundMultimedia: {
        type: "video",
        url: "/videos/overview-hero.mp4",
        posterUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=85",
        alt: "Panoramic aerial view over the Accursed Mountains and Lake Koman",
        opacity: 100,
        overlay: true,
        autoplay: true,
        loop: true,
        muted: true
      }
    },

    // 2. Overview Tab
    overview: {
      backgroundMultimedia: {
        type: "color",
        url: "",
        posterUrl: "",
        alt: "Overview Section Background",
        opacity: 100,
        overlay: false,
        autoplay: false,
        loop: false,
        muted: false
      },
      whyTitle: "Why we designed this journey?",
      whyParagraphs: [
        "We created Ancient Albania & Beyond for travelers who yearn for Europe as it once was: deeply rooted in hospitality, unblemished by mass tourism, and crowned by wild, dramatic geological monuments.",
        "Rather than skimming through tourist hubs, this journey opens private doors into centuries-old stone kullas, arranges private sunrise navigations on Lake Koman, and pairs mountain traverses with quiet evenings enjoying heritage vintage wines."
      ],
      whySignature: "— MIRA",
      overviewTitle: "Journey Overview",
      titlegraphs: [
        "Immerse yourself in the timeless beauty and rich heritage of the Western Balkans. From the ancient cobblestone quarters of Berat to the jagged limestone heights of the Accursed Mountains, experience the finest Albanian craft, gastronomy, and nature.",
        "Every mile has been carefully measured to provide a leisurely, contemplative rhythm. You will enjoy skip-the-line access to major citadel sites, private guide accompaniment from regional historians, and intimate evenings hosted by generational families."
      ],
      highlightsTitle: "Highlights",
      highlights: [
        "Private Colosseum of Shkodra & Venetian Rozafa Fortress exploration",
        "Scenic Lake Koman navigation via traditional emerald water cruise",
        "Hike the legendary Valbona to Theth Pass with certified alpine guides",
        "Restored Ottoman stone tower (kulla) stay with private chef gastronomy",
        "Ancient UNESCO citadel of Berat & artisan vintage cellar tasting",
        "Secluded Ionian coastal coves and Byzantine monastery at Butrint"
      ],
      galleryTitle: "Visuals & Moments",
      featuredImage: {
        src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
        alt: "Scenic glacial emerald waters and limestone fjord cliffs of Lake Koman"
      },
      secondaryImages: [
        {
          src: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
          alt: "Traditional mountain pass drive through Northern Albania"
        },
        {
          src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80",
          alt: "Scenic boat traverse on crystalline alpine waters"
        },
        {
          src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
          alt: "Boutique heritage stone hotel courtyard and terrace"
        },
        {
          src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
          alt: "Artisan farm-to-table slow food dining experience"
        }
      ],
      convinceTitle: "Is this Journey for you?",
      convinceItems: [
        "You appreciate raw, untouched alpine wilderness and authentic hospitality.",
        "You prefer boutique historic retreats over generic commercial resorts.",
        "You enjoy moderate guided hikes through breathtaking mountain landscapes.",
        "You desire skip-the-line access with personal cultural art historians.",
        "You love farm-to-table regional cuisine paired with rare indigenous wines."
      ]
    },

    // 3. Itinerary Tab
    itinerarySection: {
      backgroundMultimedia: {
        type: "color",
        url: "",
        posterUrl: "",
        alt: "Itinerary Section Background",
        opacity: 100,
        overlay: false,
        autoplay: false,
        loop: false,
        muted: false
      },
      routeTitle: "Journey Route",
      routeDescription: "Follow the highlights of Albania on a carefully designed route, crafted to maximize your experience and create lasting memories.",
      mapImage: {
        src: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80",
        alt: "Albania Comprehensive Journey Route Map"
      },
      stops: [
        { name: "Tirana", days: "Day 1, 7", coordinates: { lat: 41.3275, lng: 19.8187 } },
        { name: "Shkodër", days: "Day 2", coordinates: { lat: 42.0683, lng: 19.5126 } },
        { name: "Theth Valley", days: "Day 3", coordinates: { lat: 42.3956, lng: 19.7744 } },
        { name: "Valbona Pass", days: "Day 4", coordinates: { lat: 42.4517, lng: 19.8928 } },
        { name: "Lake Koman", days: "Day 5", coordinates: { lat: 42.1122, lng: 19.8242 } },
        { name: "Berat Citadel", days: "Day 6", coordinates: { lat: 40.7058, lng: 19.9522 } },
        { name: "Tirana Departure", days: "Day 7", coordinates: { lat: 41.3275, lng: 19.8187 } }
      ],
      dayByDayTitle: "Day by Day Itinerary",
      dayByDaySubtitle: "Click on each day to reveal more details and experiences.",
      days: [
        {
          dayNumber: 1,
          dayLabel: "Day 1",
          title: "Arrive in Tirana & Welcome Gastronomy",
          location: "Tirana",
          detailedHeading: "ARRIVAL IN TIRANA & PRIVATE CHEF WELCOME",
          description: "Touch down in Tirana and transfer privately to your boutique heritage hotel. Unwind with an intimate evening welcome dinner celebrating modern Albanian gastronomy, paired with vintage wines.",
          thumbnail: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
          images: [
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80"
          ]
        },
        {
          dayNumber: 2,
          dayLabel: "Day 2",
          title: "Historic Shkodër & Venetian Citadel",
          location: "Shkodër",
          detailedHeading: "ANCIENT ILLYRIAN ROZAFA CITADEL",
          description: "Journey north into Shkodër, one of Europe's oldest inhabited cities. Explore the ancient Illyrian fortress of Rozafa with sweeping lake panoramas, followed by an afternoon stroll along the pedestrian quarter.",
          thumbnail: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80",
          images: [
            "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1000&q=80"
          ]
        },
        {
          dayNumber: 3,
          dayLabel: "Day 3",
          title: "Into the Accursed Mountains & Theth Valley",
          location: "Theth",
          detailedHeading: "GLACIAL VALLEYS & HERITAGE STONE KULLAS",
          description: "Traverse high mountain switchbacks into the remote glacial valley of Theth. Visit the iconic 1892 stone church, the historic reconciliation lock-in tower, and take a leisurely walk to the turquoise Grunas waterfall.",
          thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
          images: [
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1000&q=80"
          ]
        },
        {
          dayNumber: 4,
          dayLabel: "Day 4",
          title: "Valbona Pass Alpine Traverse",
          location: "Valbona",
          detailedHeading: "RIDGE TOP TRAVERSE OVER VALBONA PASS",
          description: "Undertake the legendary alpine crossing connecting Theth with the Valbona valley on foot with certified guides. Pack horses assist with luggage while you take in panoramic vistas of 2,500m limestone spires.",
          thumbnail: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
          images: [
            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80"
          ]
        },
        {
          dayNumber: 5,
          dayLabel: "Day 5",
          title: "Emerald Waters of Lake Koman",
          location: "Lake Koman",
          detailedHeading: "FJORD NAVIGATION ABOARD A TRADITIONAL BOAT",
          description: "Board a private ferry through the sheer vertical canyon walls of Lake Koman. Stop at a secluded riverside guesthouse for fresh trout, wild mountain berries, and homemade raki.",
          thumbnail: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80",
          images: [
            "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80"
          ]
        }
      ]
    },

    // 4. Accommodation Tab
    accommodation: {
      backgroundMultimedia: {
        type: "color",
        url: "",
        posterUrl: "",
        alt: "Accommodation Section Background",
        opacity: 100,
        overlay: false,
        autoplay: false,
        loop: false,
        muted: false
      },
      badge: "OUR PHILOSOPHY",
      title: "Where You Stay",
      description: "We believe accommodation should be an organic continuation of your journey, chosen for character, authenticity, and profound connection with the landscape.",
      principles: [
        {
          icon: "character",
          title: "Distinct Character",
          description: "Historic villas, stone houses, and intimate family properties shaped by heritage."
        },
        {
          icon: "location",
          title: "Exceptional Setting",
          description: "Positioned directly inside ancient walls, beside secluded bays, or amidst alpine tranquility."
        },
        {
          icon: "comfort",
          title: "Subtle Luxury",
          description: "Generous spaces, exquisite linens, and effortless comfort without ostentation."
        },
        {
          icon: "connection",
          title: "Warm Connection",
          description: "Hosts who greet you by name and offer intimate insights into regional customs."
        }
      ],
      destinationsBadge: "DESTINATION BY DESTINATION",
      destinationsTitle: "Your Accommodation Journey",
      destinationsDescription: "Each destination on your route offers a distinct type of stay. Below we outline the character and setting of accommodation at each stop — exact properties are confirmed personally during the booking process.",
      stays: [
        {
          step: "DAY 01-02",
          duration: "2 NIGHTS",
          city: "Tirana",
          stayType: "Boutique Heritage Hotel",
          description: "An intimate, design-forward retreat situated near the leafy Blloku quarter, blending Ottoman details with modern craft.",
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
          confirmedBy: "Personally confirmed by Mira"
        },
        {
          step: "DAY 03-04",
          duration: "2 NIGHTS",
          city: "Theth Valley",
          stayType: "Traditional Alpine Kulla",
          description: "A lovingly preserved stone lodge surrounded by jagged peaks, offering homemade mountain cheeses and fireside conversation.",
          image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
          confirmedBy: "Personally confirmed by Mira"
        },
        {
          step: "DAY 05",
          duration: "1 NIGHT",
          city: "Valbona",
          stayType: "Riverside Mountain Chalet",
          description: "Handcrafted timber rooms perched alongside the crystalline Valbona river with sweeping canyon vistas.",
          image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
          confirmedBy: "Personally confirmed by Mira"
        }
      ],
      standardsBadge: "STANDARDS",
      standardsTitle: "What You Can Expect",
      standardsDescription: "Independent character, quiet settings, and thoughtful local hospitality are non-negotiable across every property.",
      expectations: [
        "Private en-suite bathroom in all rooms",
        "Locally sourced, generous breakfast",
        "Quiet, contemplative surroundings",
        "High-speed Wi-Fi throughout",
        "Authentic regional architecture",
        "Dedicated personal host or concierge"
      ],
      visualReference: {
        badge: "VISUAL REFERENCE",
        title: "Atmospheric Details",
        description: "A glimpse into the textures, morning views, and secluded gardens awaiting you.",
        featuredImage: {
          src: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
          alt: "Featured stay visual - Heritage stone masonry and private mountain balcony"
        },
        galleryImages: [
          {
            src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
            alt: "Stay detail 1 - Mountain breakfast table with fresh figs and honey"
          },
          {
            src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
            alt: "Stay detail 2 - Warm timber interiors and artisan linen bed"
          }
        ]
      }
    },

    // 5. What's Included Tab
    whatsIncluded: {
      backgroundMultimedia: {
        type: "color",
        url: "",
        posterUrl: "",
        alt: "What's Included Section Background",
        opacity: 100,
        overlay: false,
        autoplay: false,
        loop: false,
        muted: false
      },
      includedTitle: "What's Included",
      includedItems: [
        "Private chauffeur-driven 4WD vehicle for mountain traverses",
        "Certified English-speaking mountain and cultural guides",
        "All boutique hotel and alpine guesthouse accommodations with breakfast",
        "Traditional family dinners in Theth and Valbona",
        "Lake Koman boat cruise and priority access",
        "All national park permits and entrance admissions",
        "24/7 dedicated in-country concierge support"
      ],
      notIncludedTitle: "What's Not Included",
      notIncludedItems: [
        "International transatlantic flights",
        "Personal travel and medical insurance",
        "Alcoholic beverages outside of guided tastings",
        "Gratuities for drivers and mountain guides"
      ],
      importantInfoTitle: "Important Information",
      importantInfoItems: [
        "Valbona Pass hike requires a good baseline level of fitness (6-7 hours hiking with 800m elevation gain).",
        "Pack sturdy, broken-in trail boots and breathable layered alpine clothing.",
        "Dietary preferences (vegetarian, vegan, allergies) are seamlessly arranged when communicated ahead.",
        "ATMs are unavailable in remote mountain valleys; cash for small personal purchases will be coordinated in Tirana."
      ]
    },

    // 6. Addons Tab
    addonsSection: {
      backgroundMultimedia: {
        type: "color",
        url: "",
        posterUrl: "",
        alt: "Add-ons Section Background",
        opacity: 100,
        overlay: false,
        autoplay: false,
        loop: false,
        muted: false
      },
      title: "Optional Journey Enhancements",
      items: [
        {
          id: "addon-wine-tasting",
          itemNumber: 1,
          title: "Private Sunset Wine Tasting in Historic Krujë",
          price: "€120 / person",
          dayLabel: "TIRANA & KRUJË",
          detailedHeading: "PRIVATE HISTORIC CELLAR TASTING",
          description: "Sample rare indigenous Kallmet and Shesh i Bardhë varietals paired with aged cheeses inside a private 17th-century castle vaulted cellar.",
          thumbnail: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80",
          image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: "addon-helicopter",
          itemNumber: 2,
          title: "Helicopter Hop: Tirana to Theth Alpine Peaks",
          price: "€850 / flight",
          dayLabel: "MOUNTAIN PASS",
          detailedHeading: "AERIAL SPECTACLE OF THE ACCURSED PEAKS",
          description: "Bypass highway switchbacks with an exhilarating 25-minute flight soaring over the sheer limestone cliffs of the north.",
          thumbnail: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80",
          image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: "addon-cooking",
          itemNumber: 3,
          title: "Traditional Artisan Culinary Masterclass",
          price: "€95 / person",
          dayLabel: "SHKODËR",
          detailedHeading: "HANDS-ON GASTRONOMY WITH A MASTER CHEF",
          description: "Learn the delicate art of wood-fired tava kosi and flaky byrek alongside a celebrated local culinary preservationist.",
          thumbnail: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80",
          image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1000&q=80"
        }
      ]
    },

    // 7. Similar Journeys Section
    similarJourneysSection: {
      backgroundMultimedia: {
        type: "color",
        url: "",
        posterUrl: "",
        alt: "Similar Journeys Section Background",
        opacity: 100,
        overlay: false,
        autoplay: false,
        loop: false,
        muted: false
      },
      title: "Similar Journeys",
      subtitle: "Other carefully curated routes across the region that might capture your imagination.",
      journeys: [
        {
          id: "albanian-riviera",
          title: "The Wild Coast & Ancient Ports",
          description: "From secluded Ionian coves to Ottoman stone hillside towns.",
          image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
          days: "7 DAYS",
          label: "COASTAL ESCAPE",
          priceFrom: "€2,400",
          tags: [
            "COASTAL",
            "CULTURE",
            "BOUTIQUE"
          ]
        },
        {
          id: "unesco-heritage-crossroads",
          title: "UNESCO Stone Cities & Canyon Trails",
          description: "Centuries of cultural harmony, fortress vistas, and thermal springs.",
          image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
          days: "8 DAYS",
          label: "HERITAGE FOCUS",
          priceFrom: "€2,650",
          tags: [
            "HERITAGE",
            "SLOW TRAVEL",
            "WINE"
          ]
        },
        {
          id: "alps-to-adriatic",
          title: "High Alps to Turquoise Adriatic",
          description: "The complete journey bridging dramatic north gorges and warm southern seas.",
          image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80",
          days: "12 DAYS",
          label: "SIGNATURE ROUTE",
          priceFrom: "€3,900",
          tags: [
            "SIGNATURE",
            "EXPEDITION",
            "LUXURY"
          ]
        }
      ]
    }
  }
};

// 2. EMPTY SCHEMA JSON - exact same keys, but with pristine initialized empty states
function createEmptyTemplate(obj) {
  if (Array.isArray(obj)) {
    if (obj.length > 0 && typeof obj[0] === 'object' && obj[0] !== null) {
      return [createEmptyTemplate(obj[0])];
    }
    return [];
  }
  if (typeof obj === 'object' && obj !== null) {
    const res = {};
    for (const key of Object.keys(obj)) {
      res[key] = createEmptyTemplate(obj[key]);
    }
    return res;
  }
  if (typeof obj === 'string') return "";
  if (typeof obj === 'number') return 0;
  if (typeof obj === 'boolean') return false;
  return null;
}

const emptyJourney = createEmptyTemplate(realJourney);

emptyJourney.id = "";
emptyJourney.slug = "";
emptyJourney.title = "";
emptyJourney.subtitle = "";
emptyJourney.price = 0;
emptyJourney.currency = "EUR";
emptyJourney.minDays = 0;
emptyJourney.maxDays = 0;
emptyJourney.pace = "BALANCED";
emptyJourney.comfortLevel = "BOUTIQUE";
emptyJourney.status = "DRAFT";
emptyJourney.featured = false;
emptyJourney.data.hero.backgroundMultimedia.type = "image";
emptyJourney.data.hero.backgroundMultimedia.opacity = 100;
emptyJourney.data.hero.backgroundMultimedia.overlay = true;
emptyJourney.data.overview.backgroundMultimedia.type = "color";
emptyJourney.data.itinerarySection.backgroundMultimedia.type = "color";
emptyJourney.data.accommodation.backgroundMultimedia.type = "color";
emptyJourney.data.whatsIncluded.backgroundMultimedia.type = "color";
emptyJourney.data.addonsSection.backgroundMultimedia.type = "color";
emptyJourney.data.similarJourneysSection.backgroundMultimedia.type = "color";

function getAllKeys(obj, prefix = '') {
  let keys = [];
  if (typeof obj === 'object' && obj !== null) {
    for (const k of Object.keys(obj)) {
      const fullPath = prefix ? `${prefix}.${k}` : k;
      keys.push(fullPath);
      if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
        keys = keys.concat(getAllKeys(obj[k], fullPath));
      }
    }
  }
  return keys;
}

const realKeys = getAllKeys(realJourney).sort();
const emptyKeys = getAllKeys(emptyJourney).sort();

const diff1 = realKeys.filter(k => !emptyKeys.includes(k));
const diff2 = emptyKeys.filter(k => !realKeys.includes(k));

if (diff1.length > 0 || diff2.length > 0) {
  console.error("Key Mismatch Error:", { diff1, diff2 });
  process.exit(1);
}

console.log(`Success! Key parity 100% matched: ${realKeys.length} keys validated.`);

const targetDir = path.join(__dirname);
fs.writeFileSync(path.join(targetDir, 'journey_real_data.json'), JSON.stringify(realJourney, null, 2));
fs.writeFileSync(path.join(targetDir, 'journey_empty_schema.json'), JSON.stringify(emptyJourney, null, 2));

console.log("Saved journey_real_data.json and journey_empty_schema.json with real live HTTPS image links!");
