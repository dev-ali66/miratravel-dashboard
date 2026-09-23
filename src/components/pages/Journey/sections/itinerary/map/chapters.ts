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

export function toRomanNumeral(num: number | string): string {
    if (typeof num === 'string') {
        const trimmed = num.trim();
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

    const subtitleStr = getStr(chapter.subtitle);
    if (subtitleStr) return subtitleStr;

    if (!chapter.days || chapter.days.length === 0) {
        return '';
    }
    const startDay = chapter.days[0].dayNumber || 1;
    const endDay = chapter.days[chapter.days.length - 1].dayNumber || chapter.days.length;
    return formatDayRange(startDay, endDay);
}

export function formatLocationName(str: string): string {
    if (!str) return "";
    return str
        .split(/[-_]/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}

export function deriveLocationContext(days: any[]): string {
    const rawLocations = days
        .map((d) => formatLocationName(getStr(d.location) || getStr(d.locationId)))
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

export function normalizeItineraryToChapters(itinerary?: any): any[] {
    if (!itinerary) return [];
    const rawChapters = itinerary.chapters || itinerary.items || [];
    if (rawChapters.length > 0) {
        return rawChapters.map((chapter: any, idx: number) => {
            const role = chapter.narrative_role ?? narrativeRoleFor(idx, rawChapters.length);
            const rawChapterNum = getStr(chapter.chapter_number, getStr(chapter.chapterNumber, toRomanNumeral(idx + 1)));
            const chapterTitle = getStr(chapter.title, `Chapter ${toRomanNumeral(idx + 1)}`);
            const chapterLocation = getStr(chapter.location_context, deriveLocationContext(chapter.days ?? []));
            const chapterDesc = getStr(chapter.description);

            return {
                ...chapter,
                chapter_number: rawChapterNum,
                title: chapterTitle,
                day_range: getChapterDayRange(chapter),
                location_context: chapterLocation,
                description: chapterDesc,
                narrative_role: role,
                days: (chapter.days ?? []).map((day: any, dIdx: number) => {
                    const dayNum = Number(day.dayNumber || dIdx + 1);
                    const locIdStr = formatLocationName(getStr(day.locationId));
                    const locStr = getStr(day.location) || locIdStr;
                    const defaultTitle = locStr ? `${locStr}` : `Day ${dayNum}`;
                    return {
                        ...day,
                        dayNumber: dayNum,
                        title: getStr(day.title, defaultTitle),
                        subtitle: getStr(day.subtitle),
                        location: locStr,
                        description: getStr(day.description),
                        stayName: getStr(day.stayName),
                        thumbnail: typeof day.thumbnail === 'string' ? day.thumbnail : (day.multimedia?.image?.url || day.image?.url || ''),
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
