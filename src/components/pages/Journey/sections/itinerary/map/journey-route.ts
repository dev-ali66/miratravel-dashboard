import { getStr } from "./chapters";

export interface DerivedRouteStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  country: string;
  dayNumbers: number[];
  dayLabel: string;
  chapterNumber?: number | string;
}

export interface JourneyDay {
  dayNumber?: number;
  title?: any;
  subtitle?: any;
  dayLabel?: string;
  location?: any;
  locationId?: string;
  country?: string;
  description?: any;
  thumbnail?: string;
  images?: string[];
  multimedia?: any;
  detailedHeading?: string;
  coordinates?: { lat: number; lng: number };
  meals?: string[];
  activities?: string[];
  [key: string]: any;
}

export interface JourneyChapter {
  chapter_number?: number | string;
  chapterNumber?: number | string;
  badge?: any;
  title?: any;
  subtitle?: any;
  day_range?: string;
  location_context?: string;
  narrative_role?: string;
  thumbnail?: string;
  multimedia?: any;
  description?: any;
  days: JourneyDay[];
  [key: string]: any;
}

export interface JourneyItinerary {
  structure?: 'chapters' | 'days';
  title?: string;
  subtitle?: string;
  badge?: string;
  chapters?: JourneyChapter[];
  days?: JourneyDay[];
  items?: JourneyChapter[];
}

const CITY_COORDINATES_MAP: Record<string, { lat: number; lng: number }> = {
  tirana: { lat: 41.3275, lng: 19.8187 },
  kruje: { lat: 41.5092, lng: 19.7925 },
  krujë: { lat: 41.5092, lng: 19.7925 },
  shkoder: { lat: 42.0683, lng: 19.5126 },
  shkodër: { lat: 42.0683, lng: 19.5126 },
  theth: { lat: 42.3965, lng: 19.7745 },
  valbona: { lat: 42.4506, lng: 19.8964 },
  valbonë: { lat: 42.4506, lng: 19.8964 },
  durres: { lat: 41.3230, lng: 19.4414 },
  durrës: { lat: 41.3230, lng: 19.4414 },
  berat: { lat: 40.7058, lng: 19.9522 },
  apollonia: { lat: 40.7208, lng: 19.4722 },
  gjirokaster: { lat: 40.0758, lng: 20.1389 },
  gjirokastër: { lat: 40.0758, lng: 20.1389 },
  sarande: { lat: 39.8756, lng: 20.0053 },
  sarandë: { lat: 39.8756, lng: 20.0053 },
  butrint: { lat: 39.7447, lng: 20.0208 },
  ksamil: { lat: 39.7694, lng: 20.0019 },
  vlore: { lat: 40.4667, lng: 19.4897 },
  vlorë: { lat: 40.4667, lng: 19.4897 },
  himare: { lat: 40.1017, lng: 19.7447 },
  himarë: { lat: 40.1017, lng: 19.7447 },
  "porto palermo": { lat: 40.0617, lng: 19.7919 },
  dhermi: { lat: 40.1544, lng: 19.6428 },
  dhërmi: { lat: 40.1544, lng: 19.6428 },
  llogara: { lat: 40.1942, lng: 19.5986 },
  korce: { lat: 40.6186, lng: 20.7808 },
  korçë: { lat: 40.6186, lng: 20.7808 },
  pogradec: { lat: 40.9025, lng: 20.6558 },
  ohrid: { lat: 41.1172, lng: 20.8019 },
  skopje: { lat: 41.9981, lng: 21.4254 },
  kotor: { lat: 42.4247, lng: 18.7712 },
  budva: { lat: 42.2864, lng: 18.8400 },
  podgorica: { lat: 42.4304, lng: 19.2594 },
};

export function lookupCityCoordinates(cityName?: any): { lat: number; lng: number } | undefined {
  const str = getStr(cityName);
  if (!str) return undefined;
  const key = str.toLowerCase();
  if (CITY_COORDINATES_MAP[key]) return CITY_COORDINATES_MAP[key];

  for (const [k, coords] of Object.entries(CITY_COORDINATES_MAP)) {
    if (key.includes(k) || k.includes(key)) {
      return coords;
    }
  }
  return undefined;
}

export function flattenDays(itinerary?: any): JourneyDay[] {
  if (!itinerary) return [];
  const chapters = itinerary.chapters || itinerary.items || [];
  if (chapters.length > 0) {
    return chapters.flatMap((ch: any) => ch.days ?? []);
  }
  if (Array.isArray(itinerary.days)) {
    return itinerary.days;
  }
  return [];
}

export function deriveRouteStops(itinerary?: any, locationMap?: Map<string, any>): DerivedRouteStop[] {
  if (!itinerary) return [];

  const stops: DerivedRouteStop[] = [];
  const dayChapterMap = new Map<number, number | string>();
  const chapters = itinerary.chapters || itinerary.items || [];

  for (const ch of chapters) {
    if (ch.days) {
      for (const d of ch.days) {
        dayChapterMap.set(d.dayNumber, getStr(ch.chapter_number, getStr(ch.chapterNumber)));
      }
    }
  }

  const days = flattenDays(itinerary);

  for (const day of days) {
    let lat: number | undefined = day.coordinates?.lat;
    let lng: number | undefined = day.coordinates?.lng;
    let stopName = '';

    const locId = day.locationId || (typeof day.location === 'string' ? day.location : undefined);
    let resolvedLoc: any = null;
    if (locationMap && locId) {
      resolvedLoc = locationMap.get(locId) || locationMap.get(locId.trim().toLowerCase());
    }

    if (resolvedLoc) {
      stopName = resolvedLoc.name || resolvedLoc.data?.name || '';
      const geo = resolvedLoc.geoData || resolvedLoc.geodata || resolvedLoc.data?.geoData;
      if (geo) {
        if (typeof geo.latitude === 'number' && Number.isFinite(geo.latitude)) lat = geo.latitude;
        if (typeof geo.longitude === 'number' && Number.isFinite(geo.longitude)) lng = geo.longitude;
      }
    }

    if (!stopName) {
      const rawTitle = getStr(day.location, getStr(day.title));
      if (rawTitle && !/^cmu[a-z0-9]+/i.test(rawTitle)) {
        stopName = rawTitle;
      } else {
        stopName = `Day ${day.dayNumber}`;
      }
    }

    if (lat === undefined || lng === undefined) {
      const fallback = lookupCityCoordinates(stopName) || lookupCityCoordinates(getStr(day.location)) || lookupCityCoordinates(getStr(day.title));
      if (fallback) {
        lat = fallback.lat;
        lng = fallback.lng;
      }
    }

    if (
      lat === undefined ||
      lng === undefined ||
      typeof lat !== 'number' ||
      typeof lng !== 'number' ||
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      Number.isNaN(lat) ||
      Number.isNaN(lng)
    ) {
      continue;
    }

    const dayNum = day.dayNumber ?? 0;
    const prevStop = stops[stops.length - 1];
    if (prevStop && prevStop.lat === lat && prevStop.lng === lng) {
      prevStop.dayNumbers.push(dayNum);
      const firstDay = prevStop.dayNumbers[0];
      const lastDay = prevStop.dayNumbers[prevStop.dayNumbers.length - 1];
      prevStop.dayLabel = firstDay === lastDay ? `Day ${firstDay}` : `Day ${firstDay}–${lastDay}`;
      if (stopName && (!prevStop.name || prevStop.name.startsWith('Stop ') || prevStop.name.startsWith('Day '))) {
        prevStop.name = stopName;
      }
    } else {
      const chapterNum = dayChapterMap.get(dayNum);
      const countryStr = getStr(day.country, resolvedLoc?.parent?.name || 'Albania');

      stops.push({
        id: `stop-${stops.length + 1}`,
        name: stopName || `Stop ${stops.length + 1}`,
        lat,
        lng,
        country: countryStr,
        dayNumbers: [dayNum],
        dayLabel: `Day ${dayNum}`,
        ...(chapterNum !== undefined ? { chapterNumber: chapterNum } : {}),
      });
    }
  }

  return stops;
}

export function getStopForDay(stops: DerivedRouteStop[], dayNumber: number): DerivedRouteStop | undefined {
  return stops.find((s) => s.dayNumbers.includes(dayNumber));
}

export function getChapterForDay(itinerary?: any, dayNumber?: number | null): any | undefined {
  if (!itinerary || dayNumber == null) return undefined;
  const chapters = itinerary.chapters || itinerary.items || [];
  return chapters.find((ch: any) => ch.days?.some((d: any) => d.dayNumber === dayNumber));
}

export function getItineraryCountries(itinerary?: any): string[] {
  if (!itinerary) return [];
  const stops = deriveRouteStops(itinerary);
  const countries: string[] = [];
  for (const stop of stops) {
    if (stop.country && !countries.includes(stop.country)) {
      countries.push(stop.country);
    }
  }
  return countries.length > 0 ? countries : ['Albania'];
}

export function getFirstDay(stop: DerivedRouteStop): number {
  return stop.dayNumbers[0];
}

export function getStopBadgeLabel(stop: DerivedRouteStop): string {
  return String(stop.dayNumbers[0]);
}
