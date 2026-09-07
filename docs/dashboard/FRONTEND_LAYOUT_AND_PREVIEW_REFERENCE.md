# MIRA Frontend Layout & Preview Reference Guide
> **Purpose**: Complete reference of the public frontend (`frontend/` repository) architecture, page layouts, components, design system tokens, and styling patterns. Use this document to build pixel-perfect Live Previews in the Admin Dashboard (for Journeys, Itineraries, Bookings, CMS, and Destinations) that match the live website 1-to-1, even if the frontend repository folder is deleted.

---

## Table of Contents
1. [Frontend Design System & Tokens](#1-frontend-design-system--tokens)
   - [Color Palette](#color-palette)
   - [Typography & Fonts](#typography--fonts)
   - [Responsive Breakpoints & Spacing](#responsive-breakpoints--spacing)
2. [Journey & Itinerary Layout Specifications](#2-journey--itinerary-layout-specifications)
   - [Journey Detail Hero (`overview-hero.tsx`)](#journey-detail-hero)
   - [Journey Sticky Tabs (`journey-tabs.tsx`)](#journey-sticky-tabs)
   - [Tab 1: Overview (`overview-content.tsx`)](#tab-1-overview)
   - [Tab 2: Day-by-Day Itinerary (`itinerary-content.tsx`)](#tab-2-day-by-day-itinerary)
   - [Tab 3: Accommodation (`accommodation-content.tsx`)](#tab-3-accommodation)
   - [Tab 4: What's Included (`whatsincluded-content.tsx`)](#tab-4-whats-included)
   - [Tab 5: Add-ons & Experiences (`addon-content.tsx`)](#tab-5-add-ons--experiences)
   - [Similar Journeys (`similar-journeys.tsx`)](#similar-journeys)
3. [Booking & Reservation Layout Specifications](#3-booking--reservation-layout-specifications)
   - [Booking Summary Card (`booking-summary.tsx`)](#booking-summary-card)
   - [Booking Form & Steps (`booking-form.tsx`)](#booking-form--steps)
4. [Destinations, Regions & Places Layouts](#4-destinations-regions--places-layouts)
   - [Place Hero & Basics](#place-hero--basics)
   - [Why Visit Section (`why-visit.tsx`)](#why-visit-section)
   - [Experiences Grid (`experience-card.tsx`)](#experiences-grid)
   - [Region Glance & Character (`region-glance.tsx`, `character.tsx`)](#region-glance--character)
   - [Essence & Before Travel](#essence--before-travel)
5. [CMS Pages Components](#5-cms-pages-components)

---

# 1. Frontend Design System & Tokens

### Color Palette (Tailwind CSS 4 @theme)
```css
/* Background & Surfaces */
--color-background: #F9F9F9;
--color-foreground: #080c1d;
--color-surface: #EDE7D8;
--color-surface-light: #FFF8F2;
--color-surface-muted: #E8E5DD;
--color-surface-accent: #EFE8DE;
--color-megamenu: #F5F1EB;
--color-modal-bg-light: #F5EFE2;
--color-about-light: #F7F4EE;

/* Accents (MIRA Terracotta / Rust) */
--color-accent: #af6348;
--color-accent-light: #b85c38;
--color-accent-muted: #B86B3A;
--color-accent-hover: #ff7747;

/* Primary & Greens (Alpine / Forest) */
--color-secondary: #235347;
--color-secondary-muted: #2B3424;
--color-sidebar-active: #1f3d2b;
--color-primary-hover: #365314;
--color-star-color: #4A7C59;
--color-success: #3F7D58;

/* Typography Colors */
--color-title: #0a0a0a;
--color-title-light: #313131;
--color-card-title: #1a1a1a;
--color-subtitle: #565e69;
--color-sub: #454842;
--color-subtext: #717182;
--color-body: #4a4a4a;
--color-muted: #7E7E7E;
--color-nav-text: #464136;
--color-qoute: #1A1209;

/* Borders & Dividers */
--color-border: #e4e4e7;
--color-border-light: #D8CBB8;
--color-border-neutral: #F3F4F6;
--color-border-muted: rgba(183, 182, 182, 0.5);
--color-border-form: #C5C7C0;
--color-stroke: #d1d5db;

/* Overlays */
--color-overlay: #0a3c4b;
--color-overlay-background: rgba(10, 60, 75, 0.50);
--background-image-gradient-overlay: linear-gradient(0deg, #0D1F1C 0%, rgba(13, 31, 28, 0.30) 50%, rgba(0, 0, 0, 0.00) 100%);
```

### Typography & Fonts
- **Heading Font**: `Karena Serif` (or fallback `Georgia, serif`) — used for elegant destination and journey titles (`font-heading`).
- **Body / Sans Font**: `Sansation` (or fallback `system-ui, -apple-system, sans-serif`) — clean modern sans-serif for UI labels, badges, and body copy (`font-sans`).

---

# 2. Journey & Itinerary Layout Specifications

### Journey Detail Hero (`overview-hero.tsx`)
```tsx
/*
 * Structure:
 * - Full-width hero image or video background with dark gradient overlay
 * - Breadcrumb: "JOURNEYS / ALBANIA / [JOURNEY TITLE]"
 * - Main Title: Large Karena Serif heading (e.g. "Wild Peaks of the Accursed Mountains")
 * - Subtitle / Tagline below title
 * - Floating Quick Stats Bar / Badge:
 *   - Duration: "7 Days / 6 Nights"
 *   - Pace: "Active"
 *   - Comfort: "Boutique"
 *   - Price badge: "From €1,450 per person"
 *   - CTA Button: "Reserve This Journey" (opens booking modal/view)
 */
```

### Journey Sticky Tabs (`journey-tabs.tsx`)
The journey page features a sticky horizontal tab bar below the hero:
```tsx
const journeyTabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'itinerary', label: 'Day-by-Day Itinerary' },
  { id: 'accommodation', label: 'Where You Stay' },
  { id: 'whatsincluded', label: "What's Included" },
  { id: 'addon', label: 'Optional Add-ons' },
];
```
- **Active Tab Style**: `text-accent font-semibold border-b-2 border-accent`
- **Inactive Tab Style**: `text-nav-text hover:text-title transition-colors`

---

### Tab 1: Overview (`overview-content.tsx`)
Sections displayed sequentially:
1. **Why We Designed This Journey**:
   - Editorial headline and 2-3 atmospheric paragraphs describing the curator's perspective.
   - Signature quote badge.
2. **Journey Highlights**:
   - 3-4 column grid with numbered points or icon cards detailing top experiences (e.g. "Hike Valbona Pass", "Swim Grunas Waterfall", "Stay in a traditional stone Kulla").
3. **Route & Map Overview**:
   - Map preview alongside route stops (e.g. "Tirana (1 Day) → Shkodër (1 Day) → Theth (3 Days) → Valbona (2 Days)").
4. **Who It's For**:
   - Badges for `PerfectFor` (e.g. "Couples", "Adventure Seekers", "Nature Lovers").
5. **Photo Gallery**:
   - Curated grid of secondary photography.

---

### Tab 2: Day-by-Day Itinerary (`itinerary-content.tsx`)
- Accordion or card list grouped by **Day Number** (`dayNumber` 1, 2, 3...):
  - **Header**: `DAY 01` pill badge + `Day Title` + `Location` tag.
  - **Left / Top**: High-resolution image of the day's main highlight.
  - **Body**: Detailed narrative description of the day's route, morning/afternoon activities, meals, and estimated travel time.
  - **Stay Info**: Hotel / lodging for the night with accommodation type.

---

### Tab 3: Accommodation (`accommodation-content.tsx`)
- **Philosophy Header**: MIRA's lodging standards ("Hand-picked boutique stays, heritage kullas, and mountain lodges").
- **Stays Timeline**:
  - Cards matching each leg of the journey:
    - `Step`: e.g. "DAY 01 - 02"
    - `Location`: "Tirana"
    - `Stay Title`: Boutique Urban Stay
    - `Confirmed By`: "Confirmed by Mira"
    - `Photo`: Exterior/interior image of the hotel.

---

### Tab 4: What's Included (`whatsincluded-content.tsx`)
Two-column clean comparative card layout:
- **Left Column: Included**:
  - Green checkmark icon for each item:
    - All private transfers and 4x4 mountain vehicles
    - English-speaking mountain guide
    - Accommodations with breakfast
    - Luggage transfers between valleys
- **Right Column: Not Included**:
  - Gray circle / dash icon for each item:
    - International flights
    - Travel insurance
    - Personal expenses and alcoholic beverages
- **Bottom Callout**: Important travel notes (weather advisories, packing essentials).

---

### Tab 5: Add-ons & Experiences (`addon-content.tsx`)
Card grid of optional activities:
- Image thumbnail
- Title (e.g. "Traditional Highland Cooking Class")
- Additional price (e.g. "+€65 per person")
- Duration and day recommendations

---

### Similar Journeys (`similar-journeys.tsx`)
- 3-card carousel/grid recommending related packages in the region.
- Card format:
  - Hero image with duration badge
  - Title and price
  - "Explore Journey" link

---

# 3. Booking & Reservation Layout Specifications

### Booking Summary Card (`booking-summary.tsx`)
- Pinned on the right side of the booking flow:
  - Journey thumbnail image + title
  - Selected departure and arrival dates
  - Group breakdown: Adults count, Children count
  - Itemized pricing:
    - Base Rate
    - Add-ons total
    - Estimated Taxes
    - **Total Confirmed Price** (e.g. "€2,900.00")
  - Deposit notice: "Deposit required upon approval: 30% (€870.00)"
  - *(Recently updated in global CSS refactor to support refined border/shadow styles)*

### Booking Form (`booking-form.tsx`)
- Clean, stepped accordion or progressive form:
  1. **Dates & Group**: Arrival/departure date picker, adults, children (ages input), composition (`COUPLE`, `SOLO`, `FAMILY`, `FRIENDS`, `GROUP`).
  2. **Lead Traveler Details**: First name, last name, email, phone, nationality select, birth date.
  3. **Special Requests / Notes**: Textarea for dietary preferences, flight details, accessibility requirements.
  4. **Consent Checkboxes**: Agree to terms, privacy policy, and understanding that this is a reservation request subject to host confirmation.

### Wishlist & Past Journeys Cards
- **Wishlist Card (`wishlist-card.tsx`)**: Renders saved/favorite journeys in the user's private dashboard. Heart-toggle functionality integrated for quick removal/addition.
- **Past Journeys Card**: Integrated with the dashboard to show historical user travel data. Both cards leverage the updated global layout for polished aesthetics.


---

# 4. Destinations, Regions & Places Layouts

### Place Hero & Basics
- High-impact visual with `UniversalMultimediaPreview` (video background with image fallback).
- Category badge (`PLACE`, `REGION`, `COUNTRY`).
- Subtitle and key geographic stats (Altitude, Region, Access).

### Why Visit Section (`why-visit.tsx`)
- Left: Vertical card with highlight tags (e.g. `Hiking`, `Waterfalls`, `Culture`).
- Right: Atmospheric image with subtitle, headline, and narrative paragraphs.

### Experiences Grid (`experience-card.tsx`)
- 3-column interactive card grid:
  - High-res experience photo
  - Category badge (e.g. `ADVENTURE`, `CULTURE`, `NATURE`)
  - Title and subtitle
  - Expandable detailed description

### Region Glance & Character (`region-glance.tsx`, `character.tsx`)
- Background: `#F7F6F2` warm stone background.
- 3 highlight cards with icons (`mountain`, `home`, `compass`) detailing unique characteristics of the region.

### Essence & Before Travel
- **Essence**: Editorial quote in bold serif with stat badges (e.g. "2,753 km of rivers and lakes").
- **Before You Travel**: Expandable accordion items (Getting There, What to Pack, Visas, Currency, Safety & Health).

---

# 5. Live Preview Implementation Checklist for Dashboard

When building dashboard live preview shells for any new module:
1. **Container Scaling**: Wrap previews in `<ScaledWorkspace>` or iframe to ensure exact responsive fidelity.
2. **Color Fidelity**: Use the Tailwind CSS variables mapped from the frontend (`#F9F9F9`, `#EDE7D8`, `#af6348`, `#235347`).
3. **Fonts**: Use variable serif headers (`Karena Serif` / `Georgia`) and sans body text (`Sansation` / `Inter`).
4. **Interactive States**: Support responsive desktop and tablet view toggles.
