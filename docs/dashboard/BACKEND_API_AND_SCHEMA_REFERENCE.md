# MIRA Backend API & Schema Reference Guide
> **Purpose**: Complete, standalone reference for all MIRA backend databases, endpoints, models, validators, enums, and workflows. Even if the backend repository folder is deleted or moved, this file provides 100% of the specifications needed to build all admin dashboard features.

---

## Table of Contents
1. [Prisma Database Models & Enums](#1-prisma-database-models--enums)
   - [Booking Engine & Payments](#booking-engine--payments)
   - [Journeys Engine](#journeys-engine)
   - [Locations & Multi-tier CMS](#locations--multi-tier-cms)
   - [CMS Pages & Page Sections](#cms-pages--page-sections)
   - [Auth, Users, Roles & Permissions (RBAC)](#auth-users-roles--permissions-rbac)
2. [Complete REST API Specification](#2-complete-rest-api-specification)
   - [Journeys APIs (`/api/v1/journeys`, `/journey-itinerary`, etc.)](#journeys-apis)
   - [Bookings APIs (`/api/v1/bookings`)](#bookings-apis)
   - [Payment Schedules & Records APIs (`/api/v1/payment-schedules`, `/payment-records`, `/payment-config`)](#payments-apis)
   - [Locations APIs (`/api/v1/locations`)](#locations-apis)
   - [CMS Pages APIs (`/api/v1/cms-pages`, `/cms-pages-sections`)](#cms-pages-apis)
   - [Roles & Permissions APIs (`/api/v1/roles`, `/api/v1/permissions`)](#roles--permissions-apis)
   - [File Upload APIs (`/api/v1/file-upload`)](#file-upload-apis)
   - [Auth & User Lifecycle APIs (`/api/v1/auth`)](#auth--user-lifecycle-apis)
3. [Admin Dashboard Implementation Roadmap](#3-admin-dashboard-implementation-roadmap)

---

# 1. Prisma Database Models & Enums

### Booking Engine & Payments

#### Enums
```prisma
enum BookingStatus {
  REQUEST_SUBMITTED
  UNDER_REVIEW
  APPROVED
  AWAITING_DEPOSIT
  DEPOSIT_PAID_TENTATIVE
  AWAITING_FINAL_PAYMENT
  FULLY_PAID
  CONFIRMED
  CANCELLED
  REJECTED
}

enum PaymentStatus {
  UNPAID
  PARTIALLY_PAID
  DEPOSIT_PAID
  BALANCE_DUE
  FULLY_PAID
  FAILED
  REFUNDED
  PARTIALLY_REFUNDED
}

enum DepositType {
  PERCENTAGE
  FIXED
}

enum ScheduleItemCalcType {
  PERCENTAGE
  FIXED
  REMAINDER
}

enum ScheduleItemDueRule {
  IMMEDIATE_AFTER_APPROVAL
  DAYS_BEFORE_DEPARTURE
  FIXED_DATE
  MANUAL
}

enum ScheduleItemStatus {
  SCHEDULED
  DUE
  PENDING
  PAID
  FAILED
  WAIVED
  REFUNDED
}

enum PaymentRecordStatus {
  SUCCEEDED
  FAILED
  PENDING
  REFUNDED
  PARTIALLY_REFUNDED
}

enum TravelerType {
  COUPLE
  SOLO
  FAMILY
  FRIENDS
  GROUP
}

enum PaymentScheduleStatus {
  ACTIVE
  SUPERSEDED
  CANCELLED
}

enum DepositTemplateType {
  STANDARD_30_70
  FULL_PAYMENT
  FIXED_DEPOSIT
  INSTALLMENT_PLAN
}
```

#### Models
```prisma
model Booking {
  id                        String            @id @default(cuid())
  bookingNumber             String            @unique // e.g. MIRA-2026-00042
  journeyId                 String
  journey                   Journey           @relation(fields: [journeyId], references: [id])
  createdBy                 String
  travelerFirstName         String
  travelerLastName          String
  travelerEmail             String
  travelerPhone             String?
  travelerNationality       String?
  travelerBirthDate         DateTime?
  travelArrivalDate         DateTime
  travelDepartureDate       DateTime
  addOnIds                  String[]
  travelerMessage           String?
  travelerType              TravelerType      @default(SOLO)
  adults                    Int               @default(0)
  children                  Int               @default(0)
  childrenAges              Int[]
  confirmedTotal            Decimal?          @db.Decimal(10, 2)
  currency                  String            @default("EUR")
  approvalDate              DateTime?
  paidAmount                Decimal           @default(0) @db.Decimal(10, 2)
  outstandingAmount         Decimal           @default(0) @db.Decimal(10, 2)
  agreedToTerms             Boolean           @default(false)
  agreedToPrivacyPolicy     Boolean           @default(false)
  acknowledgedRequestOnly   Boolean           @default(false)
  consentTimestamp          DateTime?
  bookingStatus             BookingStatus     @default(REQUEST_SUBMITTED)
  paymentStatus             PaymentStatus     @default(UNPAID)
  selectedPaymentScheduleId String?
  auth                      Auth              @relation(fields: [createdBy], references: [id])
  createdAt                 DateTime          @default(now())
  updatedAt                 DateTime          @updatedAt
  selectedPaymentSchedule   PaymentSchedule?  @relation("SelectedSchedule", fields: [selectedPaymentScheduleId], references: [id])
  paymentRecords            PaymentRecord[]
  paymentSchedules          PaymentSchedule[] @relation("BookingSchedules")

  @@index([journeyId])
  @@index([bookingStatus])
  @@index([paymentStatus])
  @@index([travelDepartureDate])
}

model PaymentSchedule {
  id                   String                @id @default(cuid())
  bookingId            String
  templateType         DepositTemplateType   @default(STANDARD_30_70)
  totalScheduledAmount Decimal               @db.Decimal(10, 2)
  status               PaymentScheduleStatus @default(ACTIVE)
  overrideReason       String?
  createdAt            DateTime              @default(now())
  createdBy            String?

  items                PaymentScheduleItem[]
  booking              Booking               @relation("BookingSchedules", fields: [bookingId], references: [id])
  selectedByBooking    Booking[]             @relation("SelectedSchedule")

  @@index([status])
}

model PaymentScheduleItem {
  id               String               @id @default(cuid())
  scheduleId       String
  schedule         PaymentSchedule      @relation(fields: [scheduleId], references: [id], onDelete: Cascade)
  sequence         Int                  // 1, 2, 3...
  label            String               // "Deposit", "Final balance"
  calculationType  ScheduleItemCalcType
  ruleValue        Decimal?             @db.Decimal(10, 2) // e.g. 30.00 (%)
  dueRule          ScheduleItemDueRule
  dueValue         Int?                 // e.g. 60 (days before departure)
  dueDate          DateTime?            // resolved calendar date
  calculatedAmount Decimal              @db.Decimal(10, 2)
  paidAmount       Decimal              @default(0) @db.Decimal(10, 2)
  status           ScheduleItemStatus   @default(SCHEDULED)
  paymentRecords   PaymentRecord[]
  createdAt        DateTime             @default(now())
  updatedAt        DateTime             @updatedAt

  @@unique([scheduleId, sequence])
  @@index([status])
  @@index([dueDate])
}

model PaymentRecord {
  id                String               @id @default(cuid())
  bookingId         String
  scheduleItemId    String?
  paymentDate       DateTime             @default(now())
  amount            Decimal              @db.Decimal(10, 2)
  currency          String
  method            String?              // "CARD", "BANK_TRANSFER", "CASH", "STRIPE"
  pspTransactionRef String?
  status            PaymentRecordStatus  @default(PENDING)
  refundAmount      Decimal              @default(0) @db.Decimal(10, 2)
  adminNotes        String?
  recordedBy        String?
  createdAt         DateTime             @default(now())
  updatedAt         DateTime             @updatedAt
  booking           Booking              @relation(fields: [bookingId], references: [id])
  scheduleItem      PaymentScheduleItem? @relation(fields: [scheduleItemId], references: [id])

  @@index([bookingId])
  @@index([status])
  @@index([scheduleItemId])
}

model PaymentConfig {
  id                                 String      @id @default(cuid())
  scope                              String      @default("global") // "global" or "journey:<id>"
  depositEnabled                     Boolean     @default(true)
  depositType                        DepositType @default(PERCENTAGE)
  depositValue                       Decimal     @default(30) @db.Decimal(10, 2)
  finalPaymentDueDaysBeforeDeparture Int         @default(60)
  fullPaymentRequiredIfWithinDays    Int         @default(60)
  allowAdminOverride                 Boolean     @default(true)
  reservationWithoutPayment          Boolean     @default(false)
  updatedAt                          DateTime    @updatedAt

  @@unique([scope])
}
```

---

### Journeys Engine

#### Enums
```prisma
enum JourneyType {
  PRIVATE_JOURNEY
  SELF_DRIVE_JOURNEY
  SMALL_GROUP
  LUXURY_ESCAPE
  FAMILY_JOURNEY
}

enum TravelStyle {
  CULTURE_HERITAGE
  NATURE
  ADVENTURE
  FOOD_WINE
  COASTAL_ESCAPE
  MOUNTAINS
  SLOW_TRAVEL
  LUXURY
  PHOTOGRAPHY
  WELLNESS
}

enum PerfectFor {
  COUPLES
  FAMILIES
  FRIENDS
  FOOD_WINE
  SOLO_TRAVELLERS
  HONEYMOONERS
  FIRST_TIME_VISITORS
  RETURNING_VISITORS
  NATURE_LOVERS
  ADVENTURE_SEEKERS
}

enum Pace {
  RELAXED
  BALANCED
  ACTIVE
}

enum ComfortLevel {
  COMFORT
  BOUTIQUE
  PREMIUM_LUXURY
}

enum JourneyStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}
```

#### Models
```prisma
model Journey {
  id               String                @id @default(cuid())
  slug             String                @unique
  title            String
  subtitle         String?
  price            Decimal               @db.Decimal(10, 2)
  currency         String                @default("EUR")
  minDays          Int
  maxDays          Int
  journeyHeroImage String[]
  journeyGallery   String[]
  highlights       String[]
  included         String[]
  notIncluded      String[]

  journeyType      JourneyType[]
  travelStyle      TravelStyle[]
  perfectFor       PerfectFor[]
  pace             Pace
  comfortLevel     ComfortLevel

  status           JourneyStatus         @default(DRAFT)
  featured         Boolean               @default(false)

  metadata         Json?
  data             Json?

  itinerary        JourneyItinerary[]
  accommodations   JourneyAccommodation?
  addOns           JourneyAddOn[]
  bookings         Booking[]

  createdAt        DateTime              @default(now())
  updatedAt        DateTime              @updatedAt

  @@index([status])
  @@index([minDays, maxDays])
}

model JourneyItinerary {
  id                    String    @id @default(cuid())
  journeyId             String
  journey               Journey   @relation(fields: [journeyId], references: [id], onDelete: Cascade)
  dayNumber             Int
  title                 String
  slug                  String
  description           String?
  journeyItineraryImage String[]
  locationId            String?
  location              Location? @relation(fields: [locationId], references: [id])
  metadata              Json?
  data                  Json?

  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@unique([journeyId, dayNumber])
  @@index([journeyId])
}

model JourneyAccommodation {
  id         String    @id @default(cuid())
  journeyId  String    @unique
  journey    Journey   @relation(fields: [journeyId], references: [id], onDelete: Cascade)
  locationId String?
  location   Location? @relation(fields: [locationId], references: [id])
  order      Int       @default(0)
  title      String
  slug       String
  description String?
  metadata   Json?
  data       Json?

  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
}

model JourneyAddOn {
  id         String    @id @default(cuid())
  journeyId  String
  journey    Journey   @relation(fields: [journeyId], references: [id], onDelete: Cascade)
  addOnId    String
  locationId String
  location   Location  @relation(fields: [locationId], references: [id])

  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt

  @@unique([journeyId, addOnId])
}
```

---

### Locations & Multi-tier CMS

```prisma
enum LocationType {
  COUNTRY
  REGION
  PLACE
}

model Location {
  id                    String                 @id @default(cuid())
  name                  String
  slug                  String                 @unique
  type                  LocationType           @default(PLACE)
  parentId              String?
  geoData               Json?                  // area, latitude, longitude, timezone, mapZoom
  metadata              Json?                  // seo, title, description, keywords, canonicalUrl
  data                  Json?                  // hero, why, experiences, accommodation, etc.
  parent                Location?              @relation("LocationHierarchy", fields: [parentId], references: [id])
  children              Location[]             @relation("LocationHierarchy")
  createdAt             DateTime               @default(now())
  updatedAt             DateTime               @updatedAt
  countryPage           CountryPage?
  regionPage            RegionPage?
  placePage             PlacePage?
  journeyItineraries    JourneyItinerary[]
  journeyAccommodations JourneyAccommodation[]
  journeyAddOns         JourneyAddOn[]

  @@index([slug])
  @@index([type])
  @@index([parentId])
}
```

---

### CMS Pages & Page Sections

```prisma
model CMSPage {
  id        String           @id @default(cuid())
  name      String
  slug      String           @unique
  order     Int              @default(0)
  metadata  Json?
  data      Json?
  sections  CMSPageSection[]
  createdAt DateTime         @default(now())
  updatedAt DateTime         @updatedAt
}

model CMSPageSection {
  id        String   @id @default(cuid())
  pageId    String
  page      CMSPage  @relation(fields: [pageId], references: [id], onDelete: Cascade)
  name      String
  slug      String
  order     Int      @default(0)
  metadata  Json?
  data      Json?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([pageId, slug])
  @@index([pageId])
}
```

---

### Auth, Users, Roles & Permissions (RBAC)

```prisma
model Auth {
  id               String            @id @unique @default(cuid())
  email            String            @unique
  password         String
  isVerified       Boolean           @default(false)
  isActive         Boolean           @default(true)
  userPersonalInfo UserPersonalInfo?
  roles            Role[]            @relation("RoleToUser")
  sessions         Session[]
  bookings         Booking[]
  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt
}

model UserPersonalInfo {
  id        String   @id @unique @default(cuid())
  userId    String   @unique
  user      Auth     @relation(fields: [userId], references: [id], onDelete: Cascade)
  firstName String?
  lastName  String?
  phone     String?
  photoUrl  String[]
  bio       String?
  address   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Role {
  id          String       @id @unique @default(cuid())
  name        String       @unique
  permissions Permission[] @relation("PermissionToRole")
  users       Auth[]       @relation("RoleToUser")
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

model Permission {
  id          String   @id @unique @default(cuid())
  action      String   // "CREATE", "READ", "UPDATE", "DELETE", "MANAGE"
  resource    String   // "Journey", "Booking", "Location", "CMS", "User", "Role"
  scope       String   // "ANY", "OWN"
  roles       Role[]   @relation("PermissionToRole")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([action, resource, scope])
}
```

---

# 2. Complete REST API Specification

### Journeys APIs

#### 1. `GET /api/v1/journeys`
- **Query Params**:
  - `page`: number (default 1)
  - `limit`: number (default 10)
  - `id`: string (optional)
  - `slug`: string (optional)
  - `status`: `"DRAFT" | "PUBLISHED" | "ARCHIVED"` (optional)
  - `featured`: boolean (optional)
  - `pace`: `"RELAXED" | "BALANCED" | "ACTIVE"` (optional)
  - `comfortLevel`: `"COMFORT" | "BOUTIQUE" | "PREMIUM_LUXURY"` (optional)
  - `journeyType`: array or comma-separated strings
  - `travelStyle`: array or comma-separated strings
  - `perfectFor`: array or comma-separated strings
  - `minDays`: number
  - `maxDays`: number
  - `minPrice`: number
  - `maxPrice`: number
- **Response**:
  ```json
  {
    "success": true,
    "code": 200,
    "meta": { "total": 12, "page": 1, "limit": 10, "totalPages": 2 },
    "data": [
      {
        "id": "cm...",
        "title": "Northern Alps Trek",
        "slug": "northern-alps-trek",
        "subtitle": "Explore the remote Valbona & Theth trails",
        "price": 1450.00,
        "currency": "EUR",
        "minDays": 5,
        "maxDays": 7,
        "journeyType": ["PRIVATE_JOURNEY", "ADVENTURE"],
        "travelStyle": ["MOUNTAINS", "HIKING"],
        "perfectFor": ["ADVENTURE_SEEKERS", "NATURE_LOVERS"],
        "pace": "ACTIVE",
        "comfortLevel": "BOUTIQUE",
        "status": "PUBLISHED",
        "featured": true,
        "journeyHeroImage": ["https://res.cloudinary.com/..."],
        "journeyGallery": ["https://res.cloudinary.com/..."],
        "highlights": ["Grunas Waterfall", "Valbona Pass"],
        "included": ["Private transfers", "Mountain guide", "Breakfast"],
        "notIncluded": ["International flights"],
        "itinerary": [],
        "accommodations": null,
        "addOns": []
      }
    ]
  }
  ```

#### 2. `POST /api/v1/journeys` (Create or Update)
- **Headers**: `Authorization: Bearer <token>`, `Content-Type: multipart/form-data` or `application/json`
- **Body**:
  - `id` (optional, for updating)
  - `title` (string, required for create)
  - `subtitle` (string, optional)
  - `price` (number, positive, required for create)
  - `currency` (string, default "EUR")
  - `minDays` (int, positive, required for create)
  - `maxDays` (int, positive, required for create, >= minDays)
  - `pace` (`"RELAXED" | "BALANCED" | "ACTIVE"`, required for create)
  - `comfortLevel` (`"COMFORT" | "BOUTIQUE" | "PREMIUM_LUXURY"`, required for create)
  - `journeyType` (`JourneyType[]`)
  - `travelStyle` (`TravelStyle[]`)
  - `perfectFor` (`PerfectFor[]`)
  - `status` (`"DRAFT" | "PUBLISHED" | "ARCHIVED"`)
  - `featured` (boolean)
  - `journeyHeroImage` (string[])
  - `journeyGallery` (string[])
  - `highlights` (string[])
  - `included` (string[])
  - `notIncluded` (string[])
  - `metadata` (JSON)
  - `data` (JSON)

#### 3. `DELETE /api/v1/journeys`
- **Body**: `{ "id": "journey_id" }`

---

### Journeys Sub-modules APIs

#### `GET /api/v1/journey-itinerary`
- **Query Params**: `journeyId`, `page`, `limit`
- **POST `/api/v1/journey-itinerary`**:
  - `id` (optional)
  - `journeyId` (string, required)
  - `dayNumber` (int, required)
  - `title` (string, required)
  - `description` (string, required)
  - `journeyItineraryImage` (string[], required)
  - `locationId` (string, optional - links itinerary to a Location)
  - `metadata`, `data` (JSON)
- **DELETE `/api/v1/journey-itinerary`**:
  - `id`: string

#### `POST /api/v1/journey-accommodations`
- `id` (optional), `journeyId` (required), `title` (required), `description`, `locationId`, `order`

#### `POST /api/v1/journey-addons`
- `id` (optional), `journeyId` (required), `addOnId` (required), `locationId` (required)

---

### Bookings APIs

#### 1. `GET /api/v1/bookings`
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**:
  - `page`, `limit`
  - `id`, `bookingNumber`
  - `journeyId`
  - `bookingStatus`: `"REQUEST_SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "AWAITING_DEPOSIT" | "CONFIRMED" | "CANCELLED" | "REJECTED" | etc.`
  - `paymentStatus`: `"UNPAID" | "DEPOSIT_PAID" | "BALANCE_DUE" | "FULLY_PAID" | "FAILED" | "REFUNDED"`
  - `travelerEmail`, `travelerLastName`
  - `departureFrom`, `departureTo` (ISO dates)
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "cl...",
        "bookingNumber": "MIRA-2026-00042",
        "journeyId": "cl...",
        "journey": { "title": "Northern Alps Trek", "price": 1450.00 },
        "travelerFirstName": "Sarah",
        "travelerLastName": "Connor",
        "travelerEmail": "sarah@example.com",
        "travelerPhone": "+123456789",
        "travelerNationality": "American",
        "travelArrivalDate": "2026-09-15T00:00:00.000Z",
        "travelDepartureDate": "2026-09-22T00:00:00.000Z",
        "travelerType": "COUPLE",
        "adults": 2,
        "children": 0,
        "confirmedTotal": 2900.00,
        "currency": "EUR",
        "paidAmount": 870.00,
        "outstandingAmount": 2030.00,
        "bookingStatus": "DEPOSIT_PAID_TENTATIVE",
        "paymentStatus": "DEPOSIT_PAID",
        "selectedPaymentSchedule": { ... },
        "paymentRecords": [ ... ]
      }
    ]
  }
  ```

#### 2. Workflow Endpoints
- **Approve Booking**: `POST /api/v1/bookings/:id/approve`
  - Body: `{ "depositType": "PERCENTAGE" | "FIXED", "depositValue": 30 }`
  - Generates the payment schedule (30/70 or full payment) and sets status to `APPROVED` / `AWAITING_DEPOSIT`.
- **Reject Booking**: `POST /api/v1/bookings/:id/reject`
  - Body: `{ "reason": "No availability for requested dates" }`
- **Cancel Booking**: `POST /api/v1/bookings/:id/cancel`
  - Body: `{ "reason": "Traveler requested cancellation" }`
- **Revise Total**: `POST /api/v1/bookings/:id/revise-total`
  - Body: `{ "confirmedTotal": 2750.00, "reason": "Special discount applied" }`
- **Update Details**: `PATCH /api/v1/bookings/:id`
  - Body: `{ "travelerFirstName", "travelerLastName", "travelArrivalDate", "adults", "children", etc. }`
- **Delete Booking**: `DELETE /api/v1/bookings/:id`

---

### Payments APIs

#### 1. `GET /api/v1/payment-schedules`
- **Query Params**: `bookingId`, `status`
- **`GET /api/v1/payment-schedules/due-overview`**:
  - Returns all upcoming and overdue installment deadlines across all active bookings.
- **`POST /api/v1/payment-schedules/override`**:
  - Allows an admin to replace a standard 30/70 schedule with customized milestone dates and amounts.
- **`POST /api/v1/payment-schedules/:itemId/waive`**:
  - Waives a scheduled penalty or installment item.
- **`POST /api/v1/payment-schedules/:itemId/send-request`**:
  - Triggers an email notification to the traveler with a payment link for that specific installment.

#### 2. `GET /api/v1/payment-records`
- **Query Params**: `bookingId`, `scheduleItemId`, `status`
- **`POST /api/v1/payment-records`**:
  - Body:
    ```json
    {
      "bookingId": "cl...",
      "scheduleItemId": "cl...",
      "amount": 870.00,
      "currency": "EUR",
      "method": "BANK_TRANSFER",
      "pspTransactionRef": "WIRE-20260906-881",
      "adminNotes": "Verified in corporate bank account"
    }
    ```
- **`POST /api/v1/payment-records/:id/refund`**:
  - Body: `{ "refundAmount": 870.00, "adminNotes": "Trip cancelled under refund policy" }`

#### 3. `GET /api/v1/payment-config`
- **Query Params**: `scope` (default: `"global"`)
- **`POST /api/v1/payment-config`**:
  - Body:
    ```json
    {
      "scope": "global",
      "depositEnabled": true,
      "depositType": "PERCENTAGE",
      "depositValue": 30,
      "finalPaymentDueDaysBeforeDeparture": 60,
      "fullPaymentRequiredIfWithinDays": 60,
      "allowAdminOverride": true,
      "reservationWithoutPayment": false
    }
    ```

---

### Locations APIs

#### 1. `GET /api/v1/locations`
- **Query Params**:
  - `page`, `limit`
  - `search`: string (debounced search over name and slug)
  - `type`: `"COUNTRY" | "REGION" | "PLACE"`
  - `parentId`: string (filter by parent location id)
  - `id`, `slug`: exact lookup

#### 2. `POST /api/v1/locations`
- **Body**: Full Location payload (`name`, `slug`, `type`, `parentId`, `geoData`, `metadata`, `data`).

#### 3. `DELETE /api/v1/locations`
- **Body**: `{ "id": "location_id" }`

---

### CMS Pages APIs

#### 1. `GET /api/v1/cms-pages`
- List pages (e.g. `home`, `navbar`, `footer`, `faq`, `contact-us`, `cta`).
- **`POST /api/v1/cms-pages`**: Create/update CMS Page.

#### 2. `GET /api/v1/cms-pages-sections`
- **Query Params**: `pageSlug` or `pageId`
- **`POST /api/v1/cms-pages-sections`**: Create/update CMS Page section.
- **`DELETE /api/v1/cms-pages-sections`**: Delete section.

---

### Roles & Permissions APIs

#### 1. `GET /api/v1/roles`
- **Response**: List of roles with their attached permissions and users count.
- **`POST /api/v1/roles`**:
  - Body: `{ "id"?, "name": "MANAGER", "permissions": ["perm_id_1", "perm_id_2"] }`
- **`DELETE /api/v1/roles`**:
  - Body: `{ "id": "role_id" }`

#### 2. `GET /api/v1/permissions`
- **Response**:
  ```json
  [
    { "id": "p1", "action": "CREATE", "resource": "Journey", "scope": "ANY" },
    { "id": "p2", "action": "UPDATE", "resource": "Booking", "scope": "ANY" },
    { "id": "p3", "action": "READ", "resource": "Location", "scope": "ANY" }
  ]
  ```

---

### File Upload APIs

#### `POST /api/v1/file-upload`
- **Headers**: `Content-Type: multipart/form-data`
- **Form Data**: `file` (image, video, document)
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "url": "https://res.cloudinary.com/.../image.png",
      "public_id": "...",
      "format": "png",
      "resource_type": "image"
    }
  }
  ```

---

### Auth & User Lifecycle APIs

- **`POST /api/v1/auth/login`**: `{ email, password }` -> Returns `{ accessToken, user }` and sets HTTP-only refreshToken.
- **`GET /api/v1/auth/me`**: Returns currently authenticated user with roles and personal profile.
- **`GET /api/v1/auth/users`**: List all users with pagination and search.
- **`PATCH /api/v1/auth/users/:id/role`**: Assign roles to a user.
- **`DELETE /api/v1/auth/users/:id`**: Delete or deactivate user account.

---

# 3. Admin Dashboard Implementation Roadmap

```
┌────────────────────────────────────────────────────────────────────────┐
│                      MIRA ADMIN DASHBOARD ROADMAP                      │
├───────────────────┬───────────────────────────────┬────────────────────┤
│ Status            │ Module                        │ Routes             │
├───────────────────┼───────────────────────────────┼────────────────────┤
│ [DONE]            │ CMS Pages & Multi-section     │ /cms/*             │
│ [DONE]            │ Location Pages Engine         │ /location, /locations/new, /locations/:id/:slug │
│ [DONE]            │ Users List & Role Assignment  │ /user              │
│ [PENDING - 1]     │ Journeys & Tour Catalog       │ /journeys, /journeys/new, /journeys/:id │
│ [PENDING - 2]     │ Day-by-day Itinerary Builder  │ /journeys/:id/itinerary │
│ [PENDING - 3]     │ Bookings & Reservation Mgmt   │ /bookings, /bookings/:id │
│ [PENDING - 4]     │ Payment Schedules & Records   │ /payments/schedules, /payments/records │
│ [PENDING - 5]     │ Roles & Permissions (RBAC)    │ /settings/roles, /settings/permissions │
│ [PENDING - 6]     │ Live Analytics Dashboard      │ / (Dashboard Home metrics) │
└───────────────────┴───────────────────────────────┴────────────────────┘
```

 # #   R e c e n t   A d d i t i o n s :   J o u r n e y s   E n g i n e 
 T h e   J o u r n e y s   m o d u l e   h a s   b e e n   f u l l y   i m p l e m e n t e d   i n   t h e   b a c k e n d ,   i n t r o d u c i n g : 
 -   * * J o u r n e y * * :   M a i n   e n t r y .   S u p p o r t e d   f i e l d s   i n c l u d e   \ p r i c e ,   m i n D a y s ,   m a x D a y s ,   p a c e ,   c o m f o r t L e v e l \ . 
 -   * * J o u r n e y I t i n e r a r y * * :   S u p p o r t s   c o m p l e x   i t i n e r a r y   n o d e s   i n c l u d i n g   \ e y e b r o w ,   t i t l e ,   d e t a i l e d H e a d i n g ,   d e s c r i p t i o n \   ( w i t h   s t y l e   m e t a d a t a )   a n d   \ m u l t i m e d i a \   f o r   b a c k g r o u n d   r e n d e r i n g . 
 -   * * J o u r n e y A c c o m m o d a t i o n * * :   M a p s   l o c a t i o n s   t o   a c c o m m o d a t i o n s . 
 -   * * J o u r n e y A d d O n * * :   O p t i o n a l   u s e r   a d d o n s   w i t h   c u r r e n c y / p r i c i n g   i n f o . 
 A l l   e n d p o i n t s   a r e   l o c a t e d   a t   \ / a p i / v 1 / j o u r n e y s \   a n d   i t s   s u b - r o u t e s . 
  
 