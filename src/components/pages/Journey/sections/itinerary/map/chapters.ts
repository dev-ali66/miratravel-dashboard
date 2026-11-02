export function getStr(val: any, fallback: string = ""): string {
    if (val === null || val === undefined) return fallback;
    if (typeof val === "string") return val.trim() !== "" ? val.trim() : fallback;
    if (typeof val === "number" || typeof val === "boolean") return String(val);
    if (typeof val === "object" && val !== null) {
        if ("value" in val && val.value !== undefined && val.value !== null) {
            const strVal = String(val.value);
            return strVal.trim() !== "" ? strVal.trim() : fallback;
        }
        if ("text" in val && val.text !== undefined && val.text !== null) {
            const strVal = String(val.text);
            return strVal.trim() !== "" ? strVal.trim() : fallback;
        }
        if ("title" in val && val.title !== undefined && val.title !== null) {
            const strVal = typeof val.title === "object" ? getStr(val.title, fallback) : String(val.title);
            return strVal.trim() !== "" ? strVal.trim() : fallback;
        }
    }
    return fallback;
}

export function isCuid(str?: string | null): boolean {
    return Boolean(str && /^c[a-z0-9]{20,}/i.test(str.trim()));
}

export function toRomanNumeral(num: number | string): string {
    if (typeof num === 'string') {
        let trimmed = num.trim();
        const chapMatch = trimmed.match(/^chapter\s*(.*)$/i);
        if (chapMatch) {
            trimmed = chapMatch[1].trim();
        }
        if (/^[IVXLCDM]+$/i.test(trimmed)) {
            return trimmed.toUpperCase();
        }
        const parsed = parseInt(trimmed, 10);
        if (isNaN(parsed)) return trimmed;
        num = parsed;
    }

    const valMap: [number, string][] = [
        [1000, 'M'],
        [900, 'CM'],
        [500, 'D'],
        [400, 'CD'],
        [100, 'C'],
        [90, 'XC'],
        [50, 'L'],
        [40, 'XL'],
        [10, 'X'],
        [9, 'IX'],
        [5, 'V'],
        [4, 'IV'],
        [1, 'I'],
    ];

    let result = '';
    let n = Math.max(1, Math.floor(Number(num) || 1));
    for (const [val, roman] of valMap) {
        while (n >= val) {
            result += roman;
            n -= val;
        }
    }
    return result || 'I';
}

export function formatDayRange(startDay: number, endDay: number): string {
    if (startDay === endDay) {
        return `Day ${startDay}`;
    }
    return `Days ${startDay}–${endDay}`;
}

export function getChapterDayRange(chapter: any): string {
    const dayRangeStr = getStr(chapter.day_range);
    if (dayRangeStr) return dayRangeStr;

    if (!chapter.days || chapter.days.length === 0) {
        return '';
    }
    const startDay = chapter.days[0].dayNumber || 1;
    const endDay = chapter.days[chapter.days.length - 1].dayNumber || chapter.days.length;
    return formatDayRange(startDay, endDay);
}

export function formatLocationName(str: string): string {
    if (!str || isCuid(str)) return "";
    return str
        .split(/[-_]/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}

export function deriveLocationContext(days: any[], locationMap?: Map<string, any>): string {
    const rawLocations = days
        .map((d) => {
            let locStr = getStr(d.locationName) || getStr(d.location);
            const locId = getStr(d.locationId);
            if ((!locStr || isCuid(locStr)) && locationMap && locId) {
                const found = locationMap.get(locId) || locationMap.get(locId.toLowerCase());
                if (found) {
                    locStr = found.name || found.data?.name || '';
                }
            }
            if (isCuid(locStr)) return '';
            return formatLocationName(locStr);
        })
        .filter((loc): loc is string => Boolean(loc));

    const uniqueLocations = Array.from(new Set(rawLocations));

    if (uniqueLocations.length === 0) {
        return '';
    }
    if (uniqueLocations.length === 1) {
        return `${uniqueLocations[0]} & surroundings`;
    }
    if (uniqueLocations.length === 2) {
        return `${uniqueLocations[0]} & ${uniqueLocations[1]}`;
    }
    if (uniqueLocations.length === 3) {
        return `${uniqueLocations[0]}, ${uniqueLocations[1]} & ${uniqueLocations[2]}`;
    }
    return `${uniqueLocations[0]}, ${uniqueLocations[1]} & ${uniqueLocations[uniqueLocations.length - 1]}`;
}

export function narrativeRoleFor(index: number, total: number): string {
    if (total <= 1) return 'beginning';
    if (index === 0) return 'beginning';
    if (index === total - 1) return 'closing';
    if (total >= 4 && index === total - 2) return 'transition';
    if (total >= 3 && index === Math.floor((total - 1) / 2)) return 'immersion';
    return 'exploration';
}

export function deriveChaptersFromDays(days: any[]): any[] {
    if (!days || days.length === 0) return [];
    const ordered = [...days].sort((a, b) => (a.dayNumber ?? 0) - (b.dayNumber ?? 0));
    const groups = [ordered];

    return groups.map((groupDays, idx) => {
        const role = narrativeRoleFor(idx, groups.length);
        return {
            chapter_number: idx + 1,
            title: `Chapter ${toRomanNumeral(idx + 1)}`,
            day_range: formatDayRange(
                groupDays[0].dayNumber || 1,
                groupDays[groupDays.length - 1].dayNumber || groupDays.length
            ),
            location_context: deriveLocationContext(groupDays),
            narrative_role: role,
            days: groupDays,
        };
    });
}

export function normalizeItineraryToChapters(itinerary?: any, locationMap?: Map<string, any>): any[] {
    if (!itinerary) return [];
    const rawChapters = itinerary.chapters || itinerary.items || [];
    let globalDayCounter = 1;
    let globalStopCounter = 1;
    if (rawChapters.length > 0) {
        return rawChapters.map((chapter: any, idx: number) => {
            const role = chapter.narrative_role ?? narrativeRoleFor(idx, rawChapters.length);
            const chapterNum = idx + 1;
            const roman = toRomanNumeral(chapterNum);
            const rawTitle = getStr(chapter.title);
            const chapterTitle = rawTitle && !/^chapter\s+[ivxlcdm0-9]+/i.test(rawTitle)
                ? rawTitle
                : (rawTitle || `Chapter ${roman}`);
            const chapterLocation = getStr(chapter.location_context, deriveLocationContext(chapter.days ?? [], locationMap));
            const chapterDesc = getStr(chapter.description);

            return {
                ...chapter,
                chapter_number: chapterNum,
                chapterNumber: chapterNum,
                title: chapterTitle,
                day_range: getChapterDayRange(chapter),
                location_context: chapterLocation,
                description: chapterDesc,
                narrative_role: role,
                days: (chapter.days ?? []).map((day: any) => {
                    const dayNum = globalDayCounter++;
                    const locId = getStr(day.locationId);
                    let locName = getStr(day.locationName) || getStr(day.location);
                    if (isCuid(locName)) locName = '';
                    if (!locName && locationMap && locId) {
                        const found = locationMap.get(locId) || locationMap.get(locId.toLowerCase());
                        if (found) {
                            locName = found.name || found.data?.name || '';
                        }
                    }
                    const rawTitle = getStr(day.title);
                    const dayTitle = rawTitle && !isCuid(rawTitle) ? rawTitle : (locName || `Day ${dayNum}`);

                    // Normalize stops within this day
                    const rawStops = Array.isArray(day.stops) && day.stops.length > 0
                        ? day.stops
                        : [];

                    const stops = rawStops.map((stop: any) => {
                        const stopNum = globalStopCounter++;
                        const stopLocId = getStr(stop.locationId);
                        let stopLocName = getStr(stop.locationName) || getStr(stop.location);
                        if (isCuid(stopLocName)) stopLocName = '';
                        if (!stopLocName && locationMap && stopLocId) {
                            const found = locationMap.get(stopLocId) || locationMap.get(stopLocId.toLowerCase());
                            if (found) {
                                stopLocName = found.name || found.data?.name || '';
                            }
                        }
                        const rawStopTitle = getStr(stop.title);
                        const stopTitle = rawStopTitle && !isCuid(rawStopTitle) ? rawStopTitle : (stopLocName || `Stop ${stopNum}`);
                        return {
                            ...stop,
                            stopNumber: stopNum,
                            stopLabel: `Stop ${stopNum}`,
                            title: stopTitle,
                            locationId: stopLocId,
                            locationName: stopLocName,
                            location: stopLocName,
                            description: getStr(stop.description),
                            thumbnail: typeof stop.thumbnail === 'string' ? stop.thumbnail : (stop.multimedia?.image?.url || stop.image?.url || ''),
                            images: Array.isArray(stop.images) ? stop.images : [],
                        };
                    });

                    return {
                        ...day,
                        dayNumber: dayNum,
                        dayLabel: `Day ${dayNum}`,
                        title: dayTitle,
                        subtitle: getStr(day.subtitle),
                        locationId: locId,
                        locationName: locName,
                        location: locName,
                        description: getStr(day.description),
                        stayName: getStr(day.stayName),
                        thumbnail: typeof day.thumbnail === 'string' ? day.thumbnail : (day.multimedia?.image?.url || day.image?.url || ''),
                        images: Array.isArray(day.images) ? day.images : [],
                        stops,
                    };
                }),
            };
        });
    }

    return deriveChaptersFromDays(itinerary.days ?? []);
}

export function validateChapters(_chapters: any[]): { valid: boolean; errors: string[] } {
    return { valid: true, errors: [] };
}
