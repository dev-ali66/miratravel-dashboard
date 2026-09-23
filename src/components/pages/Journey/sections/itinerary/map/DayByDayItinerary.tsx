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
    locationId: string | undefined | null,
    locationMap: Map<string, any>
) {
    if (!locationId || typeof locationId !== 'string' || !locationId.trim()) return null;
    const locKey = locationId.trim().toLowerCase();
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
                    <div className="shrink-0 text-xs lg:text-[13px] lgx:text-[13px] xlg:text-[13px] mid:text-[13.5px] xl:text-sm font-semibold leading-normal" style={getStyleObj(item.dayLabel, '#182D09')}>
                        {getStr(dayLabel)}
                    </div>

                    <div className="relative w-14 h-10 md:w-[57px] md:h-[40.5px] lg:w-[59px] lg:h-[41.5px] lgx:w-15 lgx:h-[42px] xlg:w-[61px] xlg:h-[42.5px] mid:w-[62px] mid:h-[43px] xl:w-16 xl:h-11 rounded-lg overflow-hidden shrink-0 bg-neutral-200">
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
                                src={resolvedMedia?.imageUrl || item.thumbnail}
                                alt={getStr(displayTitle)}
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <div className="w-full h-full bg-[#E5E0D8] flex items-center justify-center text-[10px] text-[#707070]">No Img</div>
                        )}
                    </div>

                    <span className="flex-1 text-xs lg:text-[13px] lgx:text-[13px] xlg:text-[13px] mid:text-[13.5px] xl:text-sm font-normal leading-normal group-hover:text-[#182D09]/80 transition-colors" style={getStyleObj(item.title, '#182D09')}>
                        {getStr(displayTitle)}
                    </span>
                </div>

                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
                    className="size-5 sm:size-6 text-[#707070] group-hover:text-[#182D09] transition-colors flex items-center justify-center shrink-0"
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
                        <div className="w-full relative bg-white/50 rounded-l-2xl flex flex-col lg:flex-row items-stretch overflow-hidden">
                            <div className="flex-1 xl:py-2.5 xl:px-6 flex flex-col justify-center gap-2">
                                {getStr(item.description).includes('<') ? (
                                    <div
                                        className="prose prose-sm max-w-none text-xs xl:text-sm font-normal xl:leading-7 xl:tracking-[1.5px] [&_p]:m-0"
                                        style={getStyleObj(item.description, '#52575C')}
                                        dangerouslySetInnerHTML={{ __html: getStr(item.description) }}
                                    />
                                ) : (
                                    <p className="text-xs xl:text-sm font-normal xl:leading-7 xl:tracking-[1.5px]" style={getStyleObj(item.description, '#52575C')}>
                                        {getStr(item.description)}
                                    </p>
                                )}
                            </div>

                            <div className="relative w-full lg:w-[380px] lgx:w-[384px] xlg:w-[392px] mid:w-[399px] xl:w-[410px] h-[220px] md:h-[225px] lg:h-auto lgx:h-[238px] xlg:h-[245px] mid:h-[251px] xl:h-[260px] min-h-[220px] shrink-0 overflow-hidden select-none bg-neutral-200">
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
                                            src={resolvedMedia?.imageUrl || currentImage}
                                            alt={getStr(item.detailedHeading || item.title)}
                                            className="w-full h-full object-cover object-center"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-[#E5E0D8] flex items-center justify-center text-xs text-[#707070]">No Image</div>
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

    const chapters = useMemo(() => normalizeItineraryToChapters(itinerary), [itinerary]);

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
                                style={getStyleObj(badgeObj || itinerary?.badge, '#af6348')}
                            >
                                {badge}
                            </span>
                        ) : null}
                        <h2 className="font-heading text-[18px] md:text-[20px] lg:text-[21px] lgx:text-[22px] xlg:text-[23px] xl:text-[24px] 2xl:text-[26px] font-semibold leading-5 md:leading-6 lg:leading-[26px] lgx:leading-7 xlg:leading-[30px] mid:leading-[31px] xl:leading-8 2xl:leading-9" style={getStyleObj(titleObj || itinerary?.title, '#182D09')}>
                            {title}
                        </h2>
                        <p className="text-sm md:text-[15px] lgx:text-[15.5px] mid:text-base xl:text-base 2xl:text-[17px] font-normal leading-4 md:leading-5 lg:leading-[21px] lgx:leading-[22px] xlg:leading-[23px] xl:leading-6 2xl:leading-[26px] md:tracking-[0.2px] lg:tracking-[0.4px] lgx:tracking-[0.6px] xlg:tracking-[0.8px] mid:tracking-[0.9px] xl:tracking-[1px] 2xl:tracking-[1.2px]" style={getStyleObj(subtitleObj || itinerary?.subtitle, '#707070')}>
                            {subtitle}
                        </p>
                    </div>

                    {!hasData ? (
                        <div className="w-full rounded-2xl border border-dashed border-[#D8CBB8] p-8 md:p-12 flex flex-col items-center justify-center text-center bg-[#FFF8F2]">
                            <h3 className="text-base md:text-lg font-heading font-semibold text-[#182D09] mb-1.5">
                                Itinerary coming soon
                            </h3>
                            <p className="text-[#707070] text-xs md:text-sm max-w-md leading-relaxed">
                                Detailed day-by-day experiences and route highlights for this journey are currently being curated by our specialists.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-8 md:gap-10 w-full">
                            {chapters.map((chapter: JourneyChapter, chapterIndex: number) => {
                                const chapterNum = chapter.chapter_number || chapterIndex + 1;
                                const roman = toRomanNumeral(chapterNum);
                                const chapterKey = String(chapterNum);
                                const isChapterExpanded = expandedChapters[chapterKey] ?? (chapterIndex === 0);

                                const dayRange = getChapterDayRange(chapter);
                                const location = chapter.location_context?.trim() || deriveLocationContext(chapter.days);
                                const subLineParts = [dayRange, location].filter(Boolean);
                                const subLine = subLineParts.join('  •  ');

                                const chapterThumbnail =
                                    getStr(chapter.multimedia?.image?.url) ||
                                    chapter.thumbnail ||
                                    (() => {
                                        if (!chapter.days || chapter.days.length === 0) return '';
                                        const firstDay = chapter.days[0];
                                        const resMedia = resolveLocationMedia(firstDay.locationId || firstDay.location, locationMap);
                                        return resMedia?.imageUrl || getStr(firstDay.multimedia?.image?.url) || firstDay.thumbnail || '';
                                    })();

                                const chapterDescription =
                                    chapter.description ||
                                    (chapter.days.length > 0 ? chapter.days[0].description : undefined);

                                return (
                                    <div
                                        key={chapterKey}
                                        className="w-full relative bg-[#F9F6ED] rounded-2xl border border-[#b7b6b6]/40 flex flex-col overflow-hidden"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => toggleChapter(chapterKey)}
                                            aria-expanded={isChapterExpanded}
                                            className={`w-full flex flex-col md:flex-row items-stretch text-left cursor-pointer group select-none transition-colors ${isChapterExpanded ? 'border-b border-[#b7b6b6]/40' : ''
                                                }`}
                                        >
                                            <div className="relative w-full md:w-56 lg:w-[228px] lgx:w-[230px] xlg:w-[233px] mid:w-[236px] xl:w-60 md:min-w-[220px] lg:min-w-[226px] lgx:min-w-[228px] xlg:min-w-[231px] mid:min-w-[235px] xl:min-w-[240px] h-44 md:h-auto min-h-[160px] overflow-hidden shrink-0 bg-neutral-200">
                                                {chapterThumbnail ? (
                                                    <img
                                                        src={chapterThumbnail}
                                                        alt={getStr(chapter.title) || `Chapter ${roman}`}
                                                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-[#E5E0D8] flex items-center justify-center text-xs text-[#707070]">No Image</div>
                                                )}
                                            </div>

                                            <div className="flex-1 p-5 md:p-[20.5px] lg:p-[21.5px] lgx:p-[22px] xlg:p-[22.5px] mid:p-[23px] xl:p-6 flex flex-col justify-center items-start gap-1.5 md:gap-[6.25px] lg:gap-[6.75px] lgx:gap-[7px] xlg:gap-[7.25px] mid:gap-[7.5px] xl:gap-2 relative">
                                                <div className="w-full flex items-center justify-between">
                                                    <span className="text-sm md:text-[15px] lgx:text-[15.5px] mid:text-[15.75px] xl:text-base font-bold xl:tracking-[1px] uppercase" style={getStyleObj(chapter.badge || chapter.chapterNumber, '#af6348')}>
                                                        {(() => {
                                                            const badgeText = getStr(chapter.badge || chapter.chapterNumber)
                                                            if (badgeText) {
                                                                return badgeText.toUpperCase().startsWith('CHAPTER') ? badgeText.toUpperCase() : `CHAPTER ${badgeText.toUpperCase()}`
                                                            }
                                                            return `CHAPTER ${roman}`
                                                        })()}
                                                    </span>
                                                    <motion.div
                                                        animate={{ rotate: isChapterExpanded ? 180 : 0 }}
                                                        transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
                                                        className="size-6 text-[#707070] group-hover:text-[#182D09] transition-colors flex items-center justify-center shrink-0"
                                                    >
                                                        <ChevronIcon className="xl:size-6 mid:size-5 lgx:size-[18px] md:size-4 size-3.5" />
                                                    </motion.div>
                                                </div>

                                                <h3 className="text-xl md:text-[20.5px] lg:text-[21.5px] lgx:text-[22px] xlg:text-[22.5px] mid:text-[23px] xl:text-2xl font-[200] font-heading group-hover:text-[#182D09]/80 transition-colors" style={getStyleObj(chapter.title, '#182D09')}>
                                                    {getStr(chapter.title) || `Chapter ${roman}`}
                                                </h3>

                                                {subLine && (
                                                    <div className="text-xs lg:text-[13px] lgx:text-[13px] xlg:text-[13px] mid:text-[13.5px] xl:text-sm font-normal" style={getStyleObj(chapter.subtitle, '#235347')}>
                                                        {subLine}
                                                    </div>
                                                )}

                                                {chapterDescription && (
                                                    getStr(chapterDescription).includes('<') ? (
                                                        <div
                                                            className="prose prose-sm max-w-none text-xs lg:text-[13px] lgx:text-[13px] xlg:text-[13px] mid:text-[13.5px] xl:text-sm font-normal xl:leading-5 [&_p]:m-0"
                                                            style={getStyleObj(chapter.description, '#707070')}
                                                            dangerouslySetInnerHTML={{ __html: getStr(chapterDescription) }}
                                                        />
                                                    ) : (
                                                        <p className="text-xs lg:text-[13px] lgx:text-[13px] xlg:text-[13px] mid:text-[13.5px] xl:text-sm font-normal xl:leading-5" style={getStyleObj(chapter.description, '#707070')}>
                                                            {getStr(chapterDescription)}
                                                        </p>
                                                    )
                                                )}
                                            </div>
                                        </button>

                                        <AnimatePresence initial={false}>
                                            {isChapterExpanded && (
                                                <motion.div
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
                                                    className="overflow-hidden w-full flex flex-col divide-y divide-[#B7B6B6]/40"
                                                >
                                                    {chapter.days.map((item, indexWithinChapter) => {
                                                        const dayKey = item.dayNumber ?? indexWithinChapter + 1;
                                                        return (
                                                            <div key={dayKey} id={`day-${item.dayNumber}`}>
                                                                <DayCard
                                                                    item={item}
                                                                    index={indexWithinChapter}
                                                                    isExpanded={currentExpandedDay === item.dayNumber}
                                                                    onToggle={() => toggleExpand(dayKey)}
                                                                    currentImageIndex={activeImageIndexes[dayKey] ?? 0}
                                                                    onImageChange={(nextIndex, total) =>
                                                                        handleImageChange(dayKey, nextIndex, total)
                                                                    }
                                                                    locationMap={locationMap}
                                                                />
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

