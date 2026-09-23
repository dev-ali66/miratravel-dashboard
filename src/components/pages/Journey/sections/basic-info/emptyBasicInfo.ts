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
  price: 0,
  currency: "EUR",
  minDays: 0,
  maxDays: 0,
  pace: "BALANCED" as PaceEnum,
  comfortLevel: "BOUTIQUE" as ComfortLevelEnum,
  status: "DRAFT" as JourneyStatusEnum,
  featured: false,
  journeyType: [] as JourneyTypeEnum[],
  travelStyle: [] as TravelStyleEnum[],
  perfectFor: [] as PerfectForEnum[],
}
