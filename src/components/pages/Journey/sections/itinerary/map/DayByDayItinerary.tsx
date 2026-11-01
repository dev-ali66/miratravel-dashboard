import { THEME_COLORS } from "@/config/theme"
import { useEffect, useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getStr, getStyleObj } from '@/components/pages/Journey/shared/previewHelpers';
import { useGetLocationPages } from '@/hooks/location/useGetLocation';
import {
    toRomanNumeral,
    getChapterDayRange,
    deriveLocationContext,
    validateChapters,
    normalizeItineraryToChapters,
} from './chapters';
import type { JourneyItinerary, JourneyDay, JourneyChapter } from './journey-route';
import { getOptimizedImageUrl } from "@/lib/optimizedImage";

export interface DaySelectionRequest {
    day: number;
    nonce: number;
}

export interface DayByDayItineraryProps {
    itinerary?: JourneyItinerary | null;
    className?: string;
    expandedDay?: number | null;
    onExpandedDayChange?: (dayNumber: number | null) => void;
    selectionRequest?: DaySelectionRequest | null;
    titleObj?: any;
    subtitleObj?: any;
    badgeObj?: any;
    /** @deprecated Backwards-compatibility alias for itinerary */
    data?: JourneyItinerary | null;
}

export function resolveLocationMedia(
    rawLocationId: any,
    locationMap: Map<string, any>
) {
    if (!rawLocationId) return null;
    const unwrapped = Array.isArray(rawLocationId) ? rawLocationId[0] : rawLocationId;
    const locationId = typeof unwrapped === 'string' ? unwrapped.trim() : (unwrapped?.id || unwrapped?.value || unwrapped?._id || '');
    if (!locationId || typeof locationId !== 'string') return null;
    const locKey = locationId.toLowerCase();
    const loc = locationMap.get(locationId) || locationMap.get(locKey);
    if (!loc) return null;

    const hero = loc.hero || loc.data?.hero;
    const card = loc.card || loc.data?.card;
    const bgMm = hero?.backgroundMultimedia || hero?.bgMultimedia || card?.backgroundMultimedia;

    const imageUrl =
        bgMm?.image?.url ||
        (typeof bgMm?.image === 'string' ? bgMm.image : null) ||
        (typeof bgMm?.url === 'string' ? bgMm.url : null) ||
        hero?.background_image ||
        hero?.image ||
        card?.background_image ||
        card?.image ||
        loc.image ||
        loc.thumbnail ||
        '';

    const videoUrl =
        bgMm?.video?.url ||
        (typeof bgMm?.video === 'string' ? bgMm.video : null) ||
        hero?.video ||
        '';

    const isVideo = Boolean(videoUrl) && (bgMm?.type === 'video' || hero?.showVideo || String(videoUrl).match(/\.(mp4|webm|mov|ogg)($|\?)/i));

    return {
        id: loc.id,
        name: loc.name || loc.data?.name || '',
        slug: loc.slug || loc.data?.slug || '',
        type: loc.type || loc.data?.type || '',
        geodata: loc.geodata || loc.geoData || loc.data?.geoData || null,
        imageUrl,
        videoUrl,
        isVideo,
        heroBgMultimedia: bgMm || null,
    };
}

interface DayCardProps {
    item: JourneyDay;
    index: number;
    isExpanded: boolean;
    onToggle: () => void;
    currentImageIndex: number;
    onImageChange: (nextIndex: number, total: number) => void;
    locationMap: Map<string, any>;
}

function SectionSlideTop({ children, id, className }: { children: React.ReactNode; id?: string; className?: string }) {
    return <div id={id} className={className}>{children}</div>;
}

const imageHoverScaleVariants = {
    hover: { scale: 1.05, transition: { duration: 0.3 } }
};

function ChevronIcon({ className = 'size-4' }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            className={className}
        >
            <path
                d="M12.0002 16.0002C11.8686 16.0009 11.7381 15.9757 11.6163 15.926C11.4944 15.8762 11.3836 15.8029 11.2902 15.7102L5.29019 9.71019C5.10188 9.52188 4.99609 9.26649 4.99609 9.00019C4.99609 8.73388 5.10188 8.47849 5.29019 8.29019C5.47849 8.10188 5.73388 7.99609 6.00019 7.99609C6.26649 7.99609 6.52188 8.10188 6.71019 8.29019L12.0002 13.5902L17.2902 8.30019C17.4815 8.13636 17.7276 8.05075 17.9792 8.06047C18.2309 8.0702 18.4697 8.17453 18.6477 8.35262C18.8258 8.53072 18.9302 8.76946 18.9399 9.02113C18.9496 9.27281 18.864 9.51888 18.7002 9.71019L12.7002 15.7102C12.5139 15.8949 12.2625 15.9991 12.0002 16.0002Z"
                fill="currentColor"
            />
        </svg>
    );
}

function DayCard({
    item,
    index,
    isExpanded,
    onToggle,
    currentImageIndex,
    locationMap,
}: DayCardProps) {
    const dayLabel = item.dayLabel ?? (item.dayNumber ? `Day ${item.dayNumber}` : `Day ${index + 1}`);

    const resolvedMedia = useMemo(() => {
        const locId = item.locationId || (typeof item.location === 'string' ? item.location : undefined);
        return resolveLocationMedia(locId, locationMap);
    }, [item.locationId, item.location, locationMap]);

    const displayTitle = useMemo(() => {
        if (resolvedMedia?.name) return resolvedMedia.name;
        const rawTitle = getStr(item.title);
        if (!rawTitle || rawTitle === item.locationId || /^cmu[a-z0-9]+/i.test(rawTitle)) {
            return item.dayNumber ? `Day ${item.dayNumber}` : `Day ${index + 1}`;
        }
        return rawTitle;
    }, [resolvedMedia?.name, item.title, item.locationId, item.dayNumber, index]);

    const itemImages = item.images && item.images.length > 0
        ? item.images
        : [resolvedMedia?.imageUrl || item.thumbnail];
    const currentImage = itemImages[currentImageIndex % itemImages.length] || resolvedMedia?.imageUrl || item.thumbnail || '';

    return (
        <div className="w-full flex flex-col">
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={isExpanded}
                className="w-full pl-5 md:pl-[21px] lg:pl-6 lgx:pl-[26px] xlg:pl-[27px] mid:pl-[29px] xl:pl-8 pr-4 md:pr-[17px] lg:pr-[19px] lgx:pr-5 xlg:pr-[21px] mid:pr-[22px] xl:pr-6 py-4 md:py-[16.5px] lg:py-[17.5px] lgx:py-[18px] xlg:py-[18.5px] mid:py-[19px] xl:py-5 flex items-center justify-between gap-4 md:gap-[17px] lg:gap-[19px] lgx:gap-5 xlg:gap-[21px] mid:gap-[22px] xl:gap-6 text-left cursor-pointer hover:bg-black/[0.02] transition-colors group select-none"
            >
                <div className="flex items-center gap-4 md:gap-[17px] lg:gap-[19px] lgx:gap-5 xlg:gap-[21px] mid:gap-[22px] xl:gap-6 min-w-0 flex-1">
                    <div className="shrink-0 text-xs lg:text-[13px] lgx:text-[13px] xlg:text-[13px] mid:text-[13.5px] xl:text-sm font-semibold leading-normal" style={getStyleObj(item.dayLabel, THEME_COLORS.primary)}>
                        {getStr(dayLabel)}
                    </div>

                    <div className="relative w-14 h-10 md:w-[57px] md:h-[40.5px] lg:w-[59px] lg:h-[41.5px] lgx:w-15 lgx:h-[42px] xlg:w-[61px] xlg:h-[42.5px] mid:w-[62px] mid:h-[43px] xl:w-16 xl:h-11 rounded-lg overflow-hidden shrink-0 bg-muted">
                        {resolvedMedia?.isVideo && resolvedMedia?.videoUrl ? (
                            <video
                                src={resolvedMedia.videoUrl}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                            />
                        ) : (resolvedMedia?.imageUrl || item.thumbnail) ? (
                            <img
                                src={getOptimizedImageUrl(resolvedMedia?.imageUrl || item.thumbnail, { width: 256, quality: 100 })}
                                alt={getStr(displayTitle)}
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <div className="w-full h-full bg-surface-muted flex items-center justify-center text-[10px] text-subtitle">No Img</div>
                        )}
                    </div>

                    <span className="flex-1 text-xs lg:text-[13px] lgx:text-[13px] xlg:text-[13px] mid:text-[13.5px] xl:text-sm font-normal leading-normal group-hover:text-brand-primary/80 transition-colors" style={getStyleObj(item.title, THEME_COLORS.primary)}>
                        {getStr(displayTitle)}
                    </span>
                </div>

                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
                    className="size-5 sm:size-6 text-subtitle group-hover:text-brand-primary transition-colors flex items-center justify-center shrink-0"
                >
                    <ChevronIcon className="xl:size-6 mid:size-5 lgx:size-[18px] md:size-4 size-3.5" />
                </motion.div>
            </button>

            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                            height: 'auto',
                            opacity: 1,
                            transition: {
                                height: { duration: 0.35, ease: [0.32, 0.72, 0, 1] },
                                opacity: { duration: 0.22, delay: 0.05 },
                            },
                        }}
                        exit={{
                            height: 0,
                            opacity: 0,
                            transition: {
                                height: { duration: 0.28, ease: [0.32, 0.72, 0, 1] },
                                opacity: { duration: 0.15 },
                            },
                        }}
                        className="overflow-hidden w-full px-4 sm:px-6 md:px-8 pb-6 pt-1"
                    >
                        <div className="w-full relative bg-card/60 border border-border/40 rounded-l-2xl flex flex-col lg:flex-row items-stretch overflow-hidden">
                            <div className="flex-1 xl:py-2.5 xl:px-6 flex flex-col justify-center gap-2">
                                {getStr(item.description).includes('<') ? (
                                    <div
                                        className="prose prose-sm max-w-none text-xs xl:text-sm font-normal xl:leading-7 xl:tracking-[1.5px] [&_p]:m-0"
                                        style={getStyleObj(item.description, THEME_COLORS.muted)}
                                        dangerouslySetInnerHTML={{ __html: getStr(item.description) }}
                                    />
                                ) : (
                                    <p className="text-xs xl:text-sm font-normal xl:leading-7 xl:tracking-[1.5px]" style={getStyleObj(item.description, THEME_COLORS.muted)}>
                                        {getStr(item.description)}
                                    </p>
                                )}
                            </div>

                            <div className="relative w-full lg:w-[380px] lgx:w-[384px] xlg:w-[392px] mid:w-[399px] xl:w-[410px] h-[220px] md:h-[225px] lg:h-auto lgx:h-[238px] xlg:h-[245px] mid:h-[251px] xl:h-[260px] min-h-[220px] shrink-0 overflow-hidden select-none bg-muted">
                                <motion.div
                                    variants={imageHoverScaleVariants}
                                    whileHover="hover"
                                    className="absolute inset-0 size-full"
                                >
                                    {resolvedMedia?.isVideo && resolvedMedia?.videoUrl ? (
                                        <video
                                            src={resolvedMedia.videoUrl}
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            className="w-full h-full object-cover object-center"
                                        />
                                    ) : (resolvedMedia?.imageUrl || currentImage) ? (
                                        <img
                                            src={getOptimizedImageUrl(resolvedMedia?.imageUrl || currentImage, { width: 480, quality: 100 })}
                                            alt={getStr(item.detailedHeading || item.title)}
                                            className="w-full h-full object-cover object-center"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-surface-muted flex items-center justify-center text-xs text-subtitle">No Image</div>
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function DayByDayItinerary({
    itinerary: itineraryProp,
    data: dataProp,
    titleObj,
    subtitleObj,
    badgeObj,
    className = '',
    expandedDay,
    onExpandedDayChange,
    selectionRequest,
}: DayByDayItineraryProps = {}) {
    const itinerary = itineraryProp ?? dataProp ?? null;
    const title = getStr(titleObj || itinerary?.title) || 'Day by Day Itinerary';
    const subtitle = getStr(subtitleObj || itinerary?.subtitle) || 'Click on each day to reveal more details and experiences.';
    const badge = getStr(badgeObj || itinerary?.badge);

    const { data: locationPagesRes } = useGetLocationPages({ limit: 100 });
    const locationList = locationPagesRes?.data || [];

    const locationMap = useMemo(() => {
        const map = new Map<string, any>();
        if (Array.isArray(locationList)) {
            for (const loc of locationList) {
                if (!loc) continue;
                if (loc.id) map.set(loc.id, loc);
                if (loc.slug) map.set(loc.slug.toLowerCase(), loc);
                if (loc.name) map.set(loc.name.toLowerCase(), loc);
            }
        }
        return map;
    }, [locationList]);

    const chapters = useMemo(() => normalizeItineraryToChapters(itinerary, locationMap), [itinerary, locationMap]);

    const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>(() => {
        if (chapters.length > 0) {
            const firstKey = String(chapters[0].chapter_number ?? '1');
            return { [firstKey]: true };
        }
        return {};
    });

    const [localExpandedDay, setLocalExpandedDay] = useState<number | null>(1);
    const isControlled = expandedDay !== undefined;
    const currentExpandedDay = isControlled ? expandedDay : localExpandedDay;

    const [activeImageIndexes, setActiveImageIndexes] = useState<Record<string | number, number>>({});

    const prevExpandedDayRef = useRef<number | null | undefined>(undefined);

    useEffect(() => {
        if (selectionRequest == null) return;
        const { day } = selectionRequest;

        const id = requestAnimationFrame(() => {
            if (!isControlled) {
                setLocalExpandedDay(day);
            }
            {
                const targetChapter = chapters.find((ch) =>
                    ch.days?.some((d: any) => d.dayNumber === day)
                );
                if (targetChapter) {
                    const key = String(targetChapter.chapter_number);
                    setExpandedChapters((prev) => {
                        if (prev[key]) return prev;
                        return { ...prev, [key]: true };
                    });
                }
            }
        });
        return () => cancelAnimationFrame(id);
    }, [selectionRequest?.nonce, chapters, isControlled]);

    useEffect(() => {
        if (currentExpandedDay != null && chapters.length > 0 && prevExpandedDayRef.current !== currentExpandedDay) {
            prevExpandedDayRef.current = currentExpandedDay;
            const targetChapter = chapters.find((ch) =>
                ch.days?.some((d: any) => d.dayNumber === currentExpandedDay)
            );
            if (targetChapter) {
                const key = String(targetChapter.chapter_number);
                const id = requestAnimationFrame(() => {
                    setExpandedChapters((prev) => {
                        if (prev[key]) return prev;
                        return { ...prev, [key]: true };
                    });
                });
                return () => cancelAnimationFrame(id);
            }
        }
        if (currentExpandedDay == null) {
            prevExpandedDayRef.current = null;
        }
    }, [currentExpandedDay, chapters]);

    const toggleChapter = (chapterKey: string) => {
        setExpandedChapters((prev) => {
            const isCurrentlyOpen = Boolean(prev[chapterKey]);
            const nextState = !isCurrentlyOpen;

            if (!nextState && currentExpandedDay != null) {
                const targetChapter = chapters.find(
                    (ch) => String(ch.chapter_number) === chapterKey
                );
                const isDayInChapter = targetChapter?.days?.some(
                    (d: any) => d.dayNumber === currentExpandedDay
                );
                if (isDayInChapter) {
                    if (!isControlled) {
                        setLocalExpandedDay(null);
                    }
                    onExpandedDayChange?.(null);
                }
            }

            return {
                ...prev,
                [chapterKey]: nextState,
            };
        });
    };

    const toggleExpand = (dayNum: number) => {
        const nextDay = currentExpandedDay === dayNum ? null : dayNum;
        if (!isControlled) {
            setLocalExpandedDay(nextDay);
        }
        onExpandedDayChange?.(nextDay);
    };

    const handleImageChange = (itemId: string | number, nextIndex: number, total: number) => {
        const clampedIndex = (nextIndex + total) % total;
        setActiveImageIndexes((prev) => ({ ...prev, [itemId]: clampedIndex }));
    };

    useEffect(() => {
        if ((globalThis as any).process?.env?.NODE_ENV !== 'production' && chapters.length > 0) {
            const result = validateChapters(chapters);
            if (!result.valid) {
                console.warn('[DayByDayItinerary] Validation warnings:', result.errors);
            }
        }
    }, [chapters]);

    const hasData = chapters.length > 0;

    return (
        <section className={`w-full xl:pt-[50px] md:pt-[46px] pt-10 ${className}`}>
            <SectionSlideTop id="day-by-day-itinerary" className="w-full">
                <div className="w-full flex flex-col gap-6 md:gap-8 lgx:gap-10">
                    <div className="flex max-w-full flex-col gap-2 md:max-w-[580px] md:gap-2.5 lg:max-w-[680px] lgx:max-w-[730px] lgx:gap-3 xlg:max-w-[780px] mid:max-w-[820px] xl:max-w-[860px] 2xl:max-w-[920px] 2xl:gap-3.5">
                        {badge ? (
                            <span
                                className="text-xs md:text-[13px] font-semibold uppercase tracking-[2px]"
                                style={getStyleObj(badgeObj || itinerary?.badge, THEME_COLORS.accent)}
                            >
                                {badge}
                            </span>
                        ) : null}
                        <h2 className="font-heading text-[18px] md:text-[20px] lg:text-[21px] lgx:text-[22px] xlg:text-[23px] xl:text-[24px] 2xl:text-[26px] font-semibold leading-5 md:leading-6 lg:leading-[26px] lgx:leading-7 xlg:leading-[30px] mid:leading-[31px] xl:leading-8 2xl:leading-9" style={getStyleObj(titleObj || itinerary?.title, THEME_COLORS.primary)}>
                            {title}
                        </h2>
                        <p className="text-sm md:text-[15px] lgx:text-[15.5px] mid:text-base xl:text-base 2xl:text-[17px] font-normal leading-4 md:leading-5 lg:leading-[21px] lgx:leading-[22px] xlg:leading-[23px] xl:leading-6 2xl:leading-[26px] md:tracking-[0.2px] lg:tracking-[0.4px] lgx:tracking-[0.6px] xlg:tracking-[0.8px] mid:tracking-[0.9px] xl:tracking-[1px] 2xl:tracking-[1.2px]" style={getStyleObj(subtitleObj || itinerary?.subtitle, THEME_COLORS.muted)}>
                            {subtitle}
                        </p>
                    </div>

                    {!hasData ? (
                        <div className="w-full rounded-xl border border-dashed border-border p-8 md:p-12 flex flex-col items-center justify-center text-center bg-card/60 text-card-foreground">
                            <h3 className="text-base md:text-lg font-heading font-semibold text-brand-primary mb-1.5">
                                Itinerary coming soon
                            </h3>
                            <p className="text-muted-foreground text-xs md:text-sm max-w-md leading-relaxed">
                                Detailed day-by-day experiences and route highlights for this journey are currently being curated by our specialists.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-5 md:gap-6 lgx:gap-7 xl:gap-8 w-full">
                            {chapters.map((chapter: JourneyChapter, chapterIndex: number) => {
                                const chapterNum = chapter.chapter_number || chapterIndex + 1;
                                const roman = toRomanNumeral(chapterNum);
                                const chapterKey = String(chapterNum);
                                const isChapterExpanded = expandedChapters[chapterKey] ?? (chapterIndex === 0);

                                const dayRange = getChapterDayRange(chapter);
                                const location = chapter.location_context?.trim() || deriveLocationContext(chapter.days, locationMap);
                                const subLineParts = [dayRange, location].filter(Boolean);
                                const subLine = subLineParts.join('  •  ');

                                const firstDay = chapter.days?.[0];
                                const otherDays = chapter.days?.slice(1) || [];
                                const isFirstDayActive = currentExpandedDay === firstDay?.dayNumber;

                                const firstDayMedia = firstDay ? resolveLocationMedia(firstDay.locationId || firstDay.location, locationMap) : null;
                                const firstDayImage = firstDayMedia?.imageUrl || firstDay?.thumbnail || (firstDay?.images && firstDay.images.length > 0 ? firstDay.images[0] : "");
                                const rawFirstDayTitle = getStr(firstDay?.title);
                                const cleanFirstDayTitle = rawFirstDayTitle && !/^c[a-z0-9]{20,}/i.test(rawFirstDayTitle) ? rawFirstDayTitle : '';
                                const firstDayTitle = firstDayMedia?.name || firstDay?.locationName || cleanFirstDayTitle || (firstDay?.dayNumber ? `Day ${firstDay.dayNumber}` : 'Day 1');

                                return (
                                    <div key={chapterKey} className="flex flex-col gap-4 w-full">
                                        {/* Main Chapter Card */}
                                        <div
                                            id={`chapter-${chapterKey}`}
                                            className="self-stretch px-5 md:px-6 lg:px-7 xl:px-8 py-2 md:py-2.5 xl:py-[10px] bg-[#F9F6ED] rounded-[8px] outline outline-1 outline-offset-[-0.91px] outline-[#B7B6B6]/40 flex flex-col justify-center items-stretch overflow-hidden transition-colors duration-300"
                                        >
                                            {/* Chapter Header Button */}
                                            <button
                                                type="button"
                                                onClick={() => toggleChapter(chapterKey)}
                                                aria-expanded={isChapterExpanded}
                                                className={`w-full relative text-left inline-flex justify-between items-start cursor-pointer group select-none transition-colors p-4 md:p-[18px] lg:p-5 xl:p-[21.75px] ${
                                                    isChapterExpanded ? "border-b border-[#B7B6B6]/40" : ""
                                                }`}
                                            >
                                                <div className="flex-1 flex flex-col justify-center items-start gap-2">
                                                    <div className="w-full flex flex-col justify-start items-start gap-3 md:gap-3.5 xl:gap-4">
                                                        <div className="w-full flex flex-col justify-start items-start gap-2 md:gap-2.5 lg:gap-3 xl:gap-4">
                                                            <div className="w-full inline-flex justify-between items-center">
                                                                <div className="justify-start text-accent text-[13px] md:text-sm lg:text-[15px] xl:text-base font-bold tracking-wider xl:tracking-wide">
                                                                    {roman.toUpperCase().startsWith("CHAPTER") ? roman : `CHAPTER ${roman}`}
                                                                </div>
                                                            </div>
                                                            <div className="w-full justify-start text-[#191B1E] text-[18px] md:text-[19px] lg:text-[20px] lgx:text-[21px] xl:text-[22px] 2xl:text-[24px] font-extralight font-heading leading-snug md:leading-normal xl:leading-[28px] group-hover:text-primary transition-colors">
                                                                {chapter.title || `Chapter ${roman}`}
                                                            </div>
                                                        </div>
                                                        {subLine && (
                                                            <div className="w-full flex flex-col justify-start items-start gap-1.5 md:gap-2">
                                                                <div className="w-full justify-start text-[#4A483E] text-xs md:text-sm lg:text-[15px] xl:text-base font-normal leading-normal">
                                                                    {subLine}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="size-5 md:size-6 shrink-0 flex items-center justify-center mt-2.5 md:mt-3 xl:mt-3.5 transition-colors">
                                                    <ChevronIcon className={`size-5 md:size-6 text-[#4A483E] group-hover:text-[#191B1E] transition-transform duration-300 ease-out ${
                                                        isChapterExpanded ? "rotate-0" : "rotate-180"
                                                    }`} />
                                                </div>
                                            </button>

                                            {/* First Day of this chapter (inside Chapter card) */}
                                            <AnimatePresence initial={false}>
                                                {isChapterExpanded && firstDay && (
                                                    <motion.div
                                                        key={`chapter-first-day-${chapterKey}`}
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{
                                                            height: "auto",
                                                            opacity: 1,
                                                            transition: { height: { duration: 0.4 }, opacity: { duration: 0.3 } },
                                                        }}
                                                        exit={{
                                                            height: 0,
                                                            opacity: 0,
                                                            transition: { height: { duration: 0.3 }, opacity: { duration: 0.2 } },
                                                        }}
                                                        className="overflow-hidden w-full"
                                                    >
                                                        <div className="w-full pt-4 md:pt-5 xl:pt-6">
                                                            <div
                                                                id={`day-${firstDay.dayNumber}`}
                                                                className="w-full flex flex-col justify-start items-start px-4 md:px-[18px] lg:px-5 xl:px-[21.75px] pb-4 md:pb-[18px] lg:pb-5 xl:pb-[21.75px]"
                                                            >
                                                                <button
                                                                    type="button"
                                                                    onClick={() => toggleExpand(firstDay.dayNumber ?? 1)}
                                                                    aria-expanded={isFirstDayActive}
                                                                    className="w-full text-left inline-flex justify-between items-center cursor-pointer group select-none transition-all duration-200 rounded-[6px] p-2.5 -m-2.5 hover:bg-black/[0.025]"
                                                                >
                                                                    <div className="flex flex-col justify-start items-start gap-1.5 md:gap-2">
                                                                        <div className="justify-start text-accent text-xs md:text-sm font-semibold whitespace-nowrap">
                                                                            {firstDay.dayLabel ?? (firstDay.dayNumber ? `Day ${firstDay.dayNumber}` : 'Day 1')}
                                                                        </div>
                                                                        <div className="self-stretch justify-start text-[#191B1E] text-xs md:text-sm font-normal group-hover:text-primary transition-colors">
                                                                            {firstDayTitle}
                                                                        </div>
                                                                    </div>

                                                                    <div className="size-5 md:size-6 shrink-0 flex items-center justify-center transition-all duration-200 ml-4 group-hover:scale-105">
                                                                        <ChevronIcon className={`size-5 md:size-6 text-[#4A483E] group-hover:text-[#191B1E] transition-transform duration-300 ease-out ${
                                                                            isFirstDayActive ? "rotate-0" : "rotate-180"
                                                                        }`} />
                                                                    </div>
                                                                </button>

                                                                <AnimatePresence initial={false}>
                                                                    {isFirstDayActive && (
                                                                        <motion.div
                                                                            key={`first-day-content-${firstDay.dayNumber}`}
                                                                            initial={{ height: 0, opacity: 0 }}
                                                                            animate={{
                                                                                height: "auto",
                                                                                opacity: 1,
                                                                                transition: { height: { duration: 0.4 }, opacity: { duration: 0.3, delay: 0.05 } },
                                                                            }}
                                                                            exit={{
                                                                                height: 0,
                                                                                opacity: 0,
                                                                                transition: { height: { duration: 0.3 }, opacity: { duration: 0.2 } },
                                                                            }}
                                                                            className="overflow-hidden w-full"
                                                                        >
                                                                            <div className="w-full flex flex-col gap-4 md:gap-5 xl:gap-6 pt-4 md:pt-5 xl:pt-6">
                                                                                {firstDay.description && (
                                                                                    <div
                                                                                        className="self-stretch justify-center text-[#57534E] text-sm md:text-[15px] xl:text-base font-normal leading-6 md:leading-[26px] tracking-normal md:tracking-wide xl:tracking-widest [&_p]:mb-2 [&_p:last-child]:mb-0"
                                                                                        dangerouslySetInnerHTML={{ __html: getStr(firstDay.description) }}
                                                                                    />
                                                                                )}
                                                                                <div className="self-stretch h-64 md:h-80 xl:h-[400px] min-h-px flex flex-col justify-start items-start relative overflow-hidden shrink-0 bg-[#EDE8D8]/40 rounded-[6px]">
                                                                                    {firstDayImage ? (
                                                                                        firstDayMedia?.isVideo && firstDayMedia?.videoUrl ? (
                                                                                            <video
                                                                                                src={firstDayMedia.videoUrl}
                                                                                                autoPlay
                                                                                                loop
                                                                                                muted
                                                                                                playsInline
                                                                                                className="w-full h-full object-cover object-center"
                                                                                            />
                                                                                        ) : (
                                                                                            <img
                                                                                                src={getOptimizedImageUrl(firstDayImage, { width: 1000, quality: 100 })}
                                                                                                alt={firstDayTitle}
                                                                                                className="w-full h-full object-cover object-center"
                                                                                            />
                                                                                        )
                                                                                    ) : (
                                                                                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#FAF8F3] via-[#F4F0E6] to-[#ECE7DC] text-[#8D6534] select-none p-6 text-center border border-[#E2DDD3]">
                                                                                            <span className="text-xs md:text-sm font-serif tracking-[2px] uppercase opacity-75">
                                                                                                MIRA ARCHIVE
                                                                                            </span>
                                                                                            <span className="text-[11px] md:text-xs text-[#5C574F]/70 mt-1">
                                                                                                Curated imagery for {firstDayTitle}
                                                                                            </span>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Other Days in Chapter (Day 2, Day 3, etc.) as clean outline cards */}
                                        <AnimatePresence initial={false}>
                                            {isChapterExpanded && otherDays.length > 0 && (
                                                <motion.div
                                                    key={`chapter-other-days-${chapterKey}`}
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{
                                                        height: "auto",
                                                        opacity: 1,
                                                        transition: { height: { duration: 0.4 }, opacity: { duration: 0.3 } },
                                                    }}
                                                    exit={{
                                                        height: 0,
                                                        opacity: 0,
                                                        transition: { height: { duration: 0.3 }, opacity: { duration: 0.2 } },
                                                    }}
                                                    className="overflow-hidden flex flex-col gap-4 w-full"
                                                >
                                                    {otherDays.map((item, otherIdx) => {
                                                        const isDayActive = currentExpandedDay === item.dayNumber;
                                                        const dayLabel = item.dayLabel ?? (item.dayNumber ? `Day ${item.dayNumber}` : `Day ${otherIdx + 2}`);
                                                        const itemMedia = resolveLocationMedia(item.locationId || item.location, locationMap);
                                                        const dayImage = itemMedia?.imageUrl || item.thumbnail || (item.images && item.images.length > 0 ? item.images[0] : null);
                                                        const rawDayTitle = getStr(item.title);
                                                        const cleanDayTitle = rawDayTitle && !/^c[a-z0-9]{20,}/i.test(rawDayTitle) ? rawDayTitle : '';
                                                        const dayTitle = itemMedia?.name || item.locationName || cleanDayTitle || dayLabel;

                                                        return (
                                                            <div
                                                                key={item.dayNumber ?? otherIdx}
                                                                id={`day-${item.dayNumber}`}
                                                                className={`self-stretch px-5 md:px-6 lg:px-7 xl:px-8 py-2 md:py-2.5 xl:py-[10px] rounded-[8px] outline outline-1 outline-offset-[-0.91px] outline-[#B7B6B6]/40 flex flex-col justify-center items-stretch transition-all duration-200 group hover:bg-[#F9F6ED]/70 hover:outline-[#8E8B85]/60 ${
                                                                    !isDayActive ? "cursor-pointer" : ""
                                                                }`}
                                                            >
                                                                <div className="w-full flex flex-col justify-start items-start p-4 md:p-[18px] lg:p-5 xl:p-[21.75px]">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => toggleExpand(item.dayNumber ?? 1)}
                                                                        aria-expanded={isDayActive}
                                                                        className="w-full text-left inline-flex justify-between items-center cursor-pointer select-none transition-colors"
                                                                    >
                                                                        <div className="flex flex-col justify-start items-start gap-1.5 md:gap-2">
                                                                            <div className="justify-start text-accent text-xs md:text-sm font-semibold whitespace-nowrap">
                                                                                {dayLabel}
                                                                            </div>
                                                                            <div className="self-stretch justify-start text-[#191B1E] text-xs md:text-sm font-normal group-hover:text-primary transition-colors">
                                                                                {dayTitle}
                                                                            </div>
                                                                        </div>

                                                                        <div className="size-5 md:size-6 shrink-0 flex items-center justify-center transition-all duration-200 ml-4 group-hover:scale-105">
                                                                            <ChevronIcon className={`size-5 md:size-6 text-[#4A483E] group-hover:text-[#191B1E] transition-transform duration-300 ease-out ${
                                                                                isDayActive ? "rotate-0" : "rotate-180"
                                                                            }`} />
                                                                        </div>
                                                                    </button>

                                                                    <AnimatePresence initial={false}>
                                                                        {isDayActive && (
                                                                            <motion.div
                                                                                key={`other-day-content-${item.dayNumber}`}
                                                                                initial={{ height: 0, opacity: 0 }}
                                                                                animate={{
                                                                                    height: "auto",
                                                                                    opacity: 1,
                                                                                    transition: { height: { duration: 0.4 }, opacity: { duration: 0.3, delay: 0.05 } },
                                                                                }}
                                                                                exit={{
                                                                                    height: 0,
                                                                                    opacity: 0,
                                                                                    transition: { height: { duration: 0.3 }, opacity: { duration: 0.2 } },
                                                                                }}
                                                                                className="overflow-hidden w-full"
                                                                            >
                                                                                <div className="w-full flex flex-col gap-4 md:gap-5 xl:gap-6 pt-4 md:pt-5 xl:pt-6">
                                                                                    {item.description && (
                                                                                        <div
                                                                                            className="self-stretch justify-center text-[#57534E] text-sm md:text-[15px] xl:text-base font-normal leading-6 md:leading-[26px] tracking-normal md:tracking-wide xl:tracking-widest [&_p]:mb-2 [&_p:last-child]:mb-0"
                                                                                            dangerouslySetInnerHTML={{ __html: getStr(item.description) }}
                                                                                        />
                                                                                    )}
                                                                                    <div className="self-stretch h-64 md:h-80 xl:h-[400px] min-h-px flex flex-col justify-start items-start relative overflow-hidden shrink-0 bg-[#EDE8D8]/40 rounded-[6px]">
                                                                                        {dayImage ? (
                                                                                            itemMedia?.isVideo && itemMedia?.videoUrl ? (
                                                                                                <video
                                                                                                    src={itemMedia.videoUrl}
                                                                                                    autoPlay
                                                                                                    loop
                                                                                                    muted
                                                                                                    playsInline
                                                                                                    className="w-full h-full object-cover object-center"
                                                                                                />
                                                                                            ) : (
                                                                                                <img
                                                                                                    src={getOptimizedImageUrl(dayImage, { width: 1000, quality: 100 })}
                                                                                                    alt={dayTitle}
                                                                                                    className="w-full h-full object-cover object-center"
                                                                                                />
                                                                                            )
                                                                                        ) : (
                                                                                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#FAF8F3] via-[#F4F0E6] to-[#ECE7DC] text-[#8D6534] select-none p-6 text-center border border-[#E2DDD3]">
                                                                                                <span className="text-xs md:text-sm font-serif tracking-[2px] uppercase opacity-75">
                                                                                                    MIRA ARCHIVE
                                                                                                </span>
                                                                                                <span className="text-[11px] md:text-xs text-[#5C574F]/70 mt-1">
                                                                                                    Curated imagery for {dayTitle}
                                                                                                </span>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </motion.div>
                                                                        )}
                                                                    </AnimatePresence>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </SectionSlideTop>
        </section>
    );
}

export default DayByDayItinerary;

