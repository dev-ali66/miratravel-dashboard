import type {
  PaceEnum,
  ComfortLevelEnum,
  JourneyStatusEnum,
  JourneyTypeEnum,
  TravelStyleEnum,
  PerfectForEnum,
} from "../../journeyTypes"

export const emptyBasicInfo = {
  title: "",
  slug: "",
  subtitle: "",
  price: 3195,
  currency: "EUR",
  minDays: 7,
  maxDays: 9,
  pace: "BALANCED" as PaceEnum,
  comfortLevel: "BOUTIQUE" as ComfortLevelEnum,
  status: "DRAFT" as JourneyStatusEnum,
  featured: false,
  journeyType: ["PRIVATE_JOURNEY"] as JourneyTypeEnum[],
  travelStyle: ["CULTURE_HERITAGE"] as TravelStyleEnum[],
  perfectFor: ["COUPLES"] as PerfectForEnum[],
}
