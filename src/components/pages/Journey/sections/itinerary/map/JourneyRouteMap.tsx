import React, { useState, useMemo, useRef, useEffect, useCallback, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { getStr, getStyleObj } from '@/components/pages/Journey/shared/previewHelpers';
import { useGetLocationPages } from '@/hooks/location/useGetLocation';
import {
    deriveRouteStops,
    flattenDays,
    getItineraryCountries,
    getStopBadgeLabel,
    type DerivedRouteStop,
    type JourneyItinerary,
} from './journey-route';
import { toRomanNumeral, getChapterDayRange, normalizeItineraryToChapters } from './chapters';

import {
    MapPinIcon,
    PlusIcon,
    MinusIcon,
    ResetIcon,
    PlayIcon,
    PauseIcon,
    NavigationIcon,
    FlagIcon,
    ChevronRightIcon,
    ChevronDownIcon,
    MIRA_COLORS,
    SEA_LABELS,
} from './route-map-constants';

import {
    computeBounds,
    projectGeo,
    ensureDiagrammaticStopSpacing,
    createSmoothRoutePath,
    getRouteLegMidpoints,
    resolveAllStopLabels,
    sampleRouteSplinePoints,
    generateAdaptiveGridLines,
    round2,
    type ScreenPoint,
    type GeoBounds,
} from './simplified-geography';
import {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    calculateRouteBounds,
    calculateBaseCamera,
    clampCamera as clampCameraUtil,
    calculateVisibleGeoRect,
    CAMERA_MIN_ZOOM,
    CAMERA_MAX_ZOOM,
} from './map-camera';
import { COUNTRIES_LAND, isEnvelopeCovered as isEnvelopeCoveredUtil } from './land';
import { shouldSyncActiveDay } from './active-day-sync';

function SectionSlideTop({ children, id, className }: { children: React.ReactNode; id?: string; className?: string }) {
    return <div id={id} className={className}>{children}</div>;
}

const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

/** Maximum zoom allowed on a stop click for dense routes (>10 stops) on mobile screens (<640px) */
const DENSE_ROUTE_MOBILE_MAX_ZOOM = 1.6;

export interface CameraPoint {
    x: number;
    y: number;
}

export interface FocusOptions {
    zoom?: number;
    duration?: number;
}

export interface JourneyRouteMapRef {
    focusOn: (point: CameraPoint, options?: FocusOptions) => void;
    fitAll: () => void;
    focusStop: (index: number, options?: FocusOptions) => void;
}

export interface JourneyRouteMapProps {
    itinerary?: JourneyItinerary | null;
    activeDay?: number | null;
    onStopSelect?: (stop: DerivedRouteStop, index: number) => void;
    title?: string;
    description?: string;
    titleObj?: any;
    descriptionObj?: any;
    badgeObj?: any;
    className?: string;
}

export const JourneyRouteMap = React.forwardRef<JourneyRouteMapRef, JourneyRouteMapProps>(
    function JourneyRouteMap({
        itinerary,
        activeDay,
        onStopSelect,
        title,
        description,
        titleObj,
        descriptionObj,
        badgeObj,
        className = '',
    }: JourneyRouteMapProps, ref) {
        const routeTitleObj = titleObj ?? title ?? (itinerary as any)?.mapTitle ?? itinerary?.title;
        const routeDescObj = descriptionObj ?? description ?? (itinerary as any)?.mapSubtitle ?? itinerary?.subtitle;
        const routeBadgeObj = badgeObj ?? (itinerary as any)?.badge;

        const routeTitle = getStr(routeTitleObj, 'Journey Route');
        const routeDescription = getStr(routeDescObj, 'Follow the highlights of this route on a carefully designed journey.');

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

        const chapteredItinerary = useMemo<JourneyItinerary | null>(() => {
            if (!itinerary) return null;
            return {
                structure: 'chapters',
                title: itinerary.title,
                subtitle: itinerary.subtitle,
                chapters,
            };
        }, [itinerary, chapters]);

        const stops: DerivedRouteStop[] = useMemo(() => {
            return deriveRouteStops(chapteredItinerary, locationMap);
        }, [chapteredItinerary, locationMap]);

        const totalDays = useMemo(() => {
            return flattenDays(itinerary).length;
        }, [itinerary]);

        // Active & hovered stop
        const [activeStopIndex, setActiveStopIndex] = useState<number | null>(0);
        const [hoveredStopIndex, setHoveredStopIndex] = useState<number | null>(null);

        // Tour playback state
        const [isPlaying, setIsPlaying] = useState(false);
        const playTimerRef = useRef<any>(null);
        const tourIndexRef = useRef<number>(activeStopIndex ?? 0);

        // Container ref & measured dimensions
        const containerRef = useRef<HTMLDivElement>(null);
        const [containerDimensions, setContainerDimensions] = useState<{ width: number; height: number }>({
            width: 1200,
            height: 640,
        });

        // Sidebar ref & measured dimensions
        const sidebarRef = useRef<HTMLDivElement>(null);
        const [measuredSidebarWidth, setMeasuredSidebarWidth] = useState<number>(230);
        const [measuredPillHeight, setMeasuredPillHeight] = useState<number>(40);
        const [mobileListOpen, setMobileListOpen] = useState<boolean>(false);

        useEffect(() => {
            const el = containerRef.current;
            if (!el) return;

            const updateDimensions = () => {
                const w = el.clientWidth || 1200;
                const h = el.clientHeight || 640;
                setContainerDimensions((prev) => {
                    if (Math.abs(prev.width - w) < 2 && Math.abs(prev.height - h) < 2) return prev;
                    return { width: w, height: h };
                });
            };

            updateDimensions();

            if (typeof ResizeObserver !== 'undefined') {
                const ro = new ResizeObserver(updateDimensions);
                ro.observe(el);
                return () => ro.disconnect();
            }
        }, []);

        useEffect(() => {
            const el = sidebarRef.current;
            if (!el) return;

            const updateMeasurements = () => {
                const isMob = (containerRef.current?.clientWidth || window.innerWidth) < 640;
                if (isMob) {
                    if (!mobileListOpen) {
                        const h = el.offsetHeight || el.getBoundingClientRect().height || 40;
                        setMeasuredPillHeight((prev) => (Math.abs(prev - h) < 2 ? prev : h));
                    }
                } else {
                    const w = el.offsetWidth || el.getBoundingClientRect().width || 230;
                    setMeasuredSidebarWidth((prev) => (Math.abs(prev - w) < 2 ? prev : w));
                }
            };

            updateMeasurements();

            if (typeof ResizeObserver !== 'undefined') {
                const ro = new ResizeObserver(updateMeasurements);
                ro.observe(el);
                return () => ro.disconnect();
            }
        }, [mobileListOpen]);

        const bounds: GeoBounds = useMemo(() => {
            return computeBounds(stops, CANVAS_WIDTH, CANVAS_HEIGHT, 0.76, 0.62);
        }, [stops]);

        const projectedStops: ScreenPoint[] = useMemo(() => {
            const raw = stops.map((s) => projectGeo(s.lng, s.lat, bounds, CANVAS_WIDTH, CANVAS_HEIGHT));
            return ensureDiagrammaticStopSpacing(raw, 42, 22);
        }, [stops, bounds]);

        const smoothRoutePath = useMemo(() => {
            return createSmoothRoutePath(projectedStops);
        }, [projectedStops]);

        const legMidpoints = useMemo(() => {
            return getRouteLegMidpoints(projectedStops);
        }, [projectedStops]);

        const labelLayouts = useMemo(() => {
            const splinePoints = sampleRouteSplinePoints(projectedStops, 100);
            return resolveAllStopLabels(stops, projectedStops, splinePoints);
        }, [stops, projectedStops]);

        const routeBounds = useMemo(() => {
            return calculateRouteBounds(projectedStops, labelLayouts);
        }, [projectedStops, labelLayouts]);

        const baseCamera = useMemo(() => {
            return calculateBaseCamera(routeBounds, containerDimensions, measuredSidebarWidth, measuredPillHeight);
        }, [containerDimensions, routeBounds, measuredSidebarWidth, measuredPillHeight]);

        const visibleRectAtZoom1 = useMemo(() => {
            return calculateVisibleGeoRect(baseCamera, bounds);
        }, [baseCamera, bounds]);

        const isCovered = useMemo(() => {
            return isEnvelopeCoveredUtil(
                visibleRectAtZoom1.minLng,
                visibleRectAtZoom1.maxLng,
                visibleRectAtZoom1.minLat,
                visibleRectAtZoom1.maxLat
            );
        }, [visibleRectAtZoom1]);

        useEffect(() => {
            if (!isCovered && (globalThis as any).process?.env?.NODE_ENV !== 'production') {
                console.warn(
                    `[JourneyRouteMap] Journey "${routeTitle}" at ${containerDimensions.width}x${containerDimensions.height} visible viewport is outside pre-loaded land coverage.`
                );
            }
        }, [isCovered, routeTitle, visibleRectAtZoom1, containerDimensions]);

        const landPaths = useMemo(() => {
            const paths: string[] = [];
            for (const country of COUNTRIES_LAND) {
                const [cMinLng, cMinLat, cMaxLng, cMaxLat] = country.bbox;
                if (
                    cMaxLng < bounds.minLng - 1.5 ||
                    cMinLng > bounds.maxLng + 1.5 ||
                    cMaxLat < bounds.minLat - 1.5 ||
                    cMinLat > bounds.maxLat + 1.5
                ) {
                    continue;
                }

                for (const poly of country.polygons) {
                    const [pMinLng, pMinLat, pMaxLng, pMaxLat] = poly.bbox;
                    if (
                        pMaxLng < bounds.minLng - 0.5 ||
                        pMinLng > bounds.maxLng + 0.5 ||
                        pMaxLat < bounds.minLat - 0.5 ||
                        pMinLat > bounds.maxLat + 0.5
                    ) {
                        continue;
                    }

                    let polyPath = '';
                    for (const ring of poly.rings) {
                        if (ring.length === 0) continue;
                        const screenPoints = ring.map(([lng, lat]) =>
                            projectGeo(lng, lat, bounds, CANVAS_WIDTH, CANVAS_HEIGHT)
                        );
                        const subPath = screenPoints
                            .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`)
                            .join(' ');
                        polyPath += (polyPath ? ' ' : '') + `${subPath} Z`;
                    }
                    if (polyPath) paths.push(polyPath);
                }
            }
            return paths;
        }, [bounds]);

        const visibleLabels = useMemo(() => {
            const labels: Array<{
                name: string;
                x: number;
                y: number;
                type: 'sea' | 'country';
                angle?: number;
            }> = [];

            const collidesWithPill = (x: number, y: number, w: number, h: number) => {
                const lLeft = x - w / 2;
                const lRight = x + w / 2;
                const lTop = y - h / 2;
                const lBottom = y + h / 2;
                for (const layout of labelLayouts) {
                    if (!layout || !isFinite(layout.pillX) || !isFinite(layout.pillY)) continue;
                    const pLeft = layout.pillX - 6;
                    const pRight = layout.pillX + layout.pillWidth + 6;
                    const pTop = layout.pillY - 6;
                    const pBottom = layout.pillY + layout.pillHeight + 6;
                    if (lLeft < pRight && lRight > pLeft && lTop < pBottom && lBottom > pTop) {
                        return true;
                    }
                }
                return false;
            };

            for (const sea of SEA_LABELS) {
                const pt = projectGeo(sea.lng, sea.lat, bounds, CANVAS_WIDTH, CANVAS_HEIGHT);
                if (pt.x >= 20 && pt.x <= CANVAS_WIDTH - 20 && pt.y >= 20 && pt.y <= CANVAS_HEIGHT - 20) {
                    const estWidth = sea.name.length * 7 + 10;
                    if (!collidesWithPill(pt.x, pt.y, estWidth, 18)) {
                        labels.push({
                            name: sea.name,
                            x: pt.x,
                            y: pt.y,
                            type: 'sea',
                            angle: sea.angle,
                        });
                    }
                }
            }

            for (const country of COUNTRIES_LAND) {
                const [lng, lat] = country.labelPoint;
                const pt = projectGeo(lng, lat, bounds, CANVAS_WIDTH, CANVAS_HEIGHT);
                if (pt.x >= 25 && pt.x <= CANVAS_WIDTH - 25 && pt.y >= 25 && pt.y <= CANVAS_HEIGHT - 25) {
                    const estWidth = country.name.length * 8 + 12;
                    if (!collidesWithPill(pt.x, pt.y, estWidth, 18)) {
                        labels.push({
                            name: country.name.toUpperCase(),
                            x: pt.x,
                            y: pt.y,
                            type: 'country',
                        });
                    }
                }
            }

            return labels;
        }, [bounds, labelLayouts]);

        const gridLines = useMemo(() => {
            return generateAdaptiveGridLines(bounds, CANVAS_WIDTH, CANVAS_HEIGHT);
        }, [bounds]);

        const countryBadges = useMemo(() => {
            return getItineraryCountries(itinerary);
        }, [itinerary]);

        const clampCamera = useCallback(
            (x: number, y: number, z: number) => {
                return clampCameraUtil(x, y, z, baseCamera);
            },
            [baseCamera]
        );

        const [camera, setCamera] = useState<{ x: number; y: number; zoom: number }>({
            x: baseCamera.baseX,
            y: baseCamera.baseY,
            zoom: 1.0,
        });
        const cameraRef = useRef(camera);
        useEffect(() => {
            cameraRef.current = camera;
        }, [camera]);

        useEffect(() => {
            if (cameraRef.current.zoom <= 1.02) {
                setCamera({
                    x: baseCamera.baseX,
                    y: baseCamera.baseY,
                    zoom: 1.0,
                });
            } else {
                const clamped = clampCamera(cameraRef.current.x, cameraRef.current.y, cameraRef.current.zoom);
                setCamera({ x: clamped.x, y: clamped.y, zoom: clamped.zoom });
            }
        }, [baseCamera, clampCamera]);

        const animFrameRef = useRef<number | null>(null);

        const animateCameraTo = useCallback(
            (targetX: number, targetY: number, targetZoom: number, duration = 380) => {
                if (animFrameRef.current) {
                    cancelAnimationFrame(animFrameRef.current);
                    animFrameRef.current = null;
                }

                const startX = cameraRef.current.x;
                const startY = cameraRef.current.y;
                const startZoom = cameraRef.current.zoom;

                const clamped = clampCamera(targetX, targetY, targetZoom);
                const endX = clamped.x;
                const endY = clamped.y;
                const endZoom = clamped.zoom;

                const startTime = performance.now();

                const tick = (now: number) => {
                    const elapsed = now - startTime;
                    const progress = Math.min(1, elapsed / duration);
                    const ease = 1 - Math.pow(1 - progress, 3);

                    const curX = startX + (endX - startX) * ease;
                    const curY = startY + (endY - startY) * ease;
                    const curZoom = startZoom + (endZoom - startZoom) * ease;

                    setCamera({ x: curX, y: curY, zoom: curZoom });

                    if (progress < 1) {
                        animFrameRef.current = requestAnimationFrame(tick);
                    } else {
                        animFrameRef.current = null;
                    }
                };

                animFrameRef.current = requestAnimationFrame(tick);
            },
            [clampCamera]
        );

        const focusOn = useCallback(
            (point: CameraPoint, options?: FocusOptions) => {
                const targetZoom = options?.zoom ?? cameraRef.current.zoom;
                const clampedZ = Math.max(1.0, Math.min(3.8, targetZoom));
                const targetW = baseCamera.baseW / clampedZ;
                const targetH = baseCamera.baseH / clampedZ;

                const sidebarOffsetSvg = (baseCamera.sidebarFraction * targetW) / 2;
                const topInsetOffsetSvg = (baseCamera.topInsetFraction * targetH) / 2;
                const targetX = point.x - targetW / 2 - sidebarOffsetSvg;
                const targetY = point.y - targetH / 2 - topInsetOffsetSvg;

                animateCameraTo(targetX, targetY, clampedZ, options?.duration ?? 380);
            },
            [baseCamera, animateCameraTo]
        );

        const fitAll = useCallback(() => {
            animateCameraTo(baseCamera.baseX, baseCamera.baseY, 1.0, 360);
        }, [baseCamera, animateCameraTo]);

        const isStopInsideVisibleRect = useCallback(
            (index: number) => {
                const pt = projectedStops[index];
                const layout = labelLayouts[index];
                if (!pt || !layout) return false;

                const curZoom = cameraRef.current.zoom;
                const curW = baseCamera.baseW / curZoom;
                const curH = baseCamera.baseH / curZoom;

                const visMinX = cameraRef.current.x + baseCamera.sidebarFraction * curW;
                const visMaxX = cameraRef.current.x + curW;
                const visMinY = cameraRef.current.y + baseCamera.topInsetFraction * curH;
                const visMaxY = cameraRef.current.y + curH;

                const stopRadius = 14;
                const elemMinX = Math.min(pt.x - stopRadius, layout.pillX);
                const elemMaxX = Math.max(pt.x + stopRadius, layout.pillX + layout.pillWidth);
                const elemMinY = Math.min(pt.y - stopRadius, layout.pillY);
                const elemMaxY = Math.max(pt.y + stopRadius, layout.pillY + layout.pillHeight);

                return (
                    elemMinX >= visMinX + 4 &&
                    elemMaxX <= visMaxX - 4 &&
                    elemMinY >= visMinY + 4 &&
                    elemMaxY <= visMaxY - 4
                );
            },
            [projectedStops, labelLayouts, baseCamera]
        );

        const focusStop = useCallback(
            (index: number, options?: FocusOptions) => {
                setActiveStopIndex(index);
                const pt = projectedStops[index];
                if (!pt) return;

                const curZoom = cameraRef.current.zoom;
                const isDenseMobile = stops.length > 10 && containerDimensions.width < 640;

                if (options?.zoom !== undefined) {
                    focusOn(pt, options);
                    return;
                }

                if (isDenseMobile && curZoom < DENSE_ROUTE_MOBILE_MAX_ZOOM) {
                    focusOn(pt, { zoom: DENSE_ROUTE_MOBILE_MAX_ZOOM, duration: options?.duration });
                    return;
                }

                if (isStopInsideVisibleRect(index)) {
                    return;
                }

                focusOn(pt, { zoom: curZoom, duration: options?.duration });
            },
            [projectedStops, stops.length, containerDimensions.width, isStopInsideVisibleRect, focusOn]
        );

        const zoomAbout = useCallback(
            (
                anchor: { x: number; y: number },
                nextZoom: number,
                isScreenCoord = false,
                duration?: number
            ) => {
                const targetZoom = Math.max(CAMERA_MIN_ZOOM, Math.min(CAMERA_MAX_ZOOM, nextZoom));
                if (Math.abs(targetZoom - cameraRef.current.zoom) < 0.001) return;

                const curZoom = cameraRef.current.zoom;
                const curW = baseCamera.baseW / curZoom;
                const curH = baseCamera.baseH / curZoom;

                let svgAnchorX: number;
                let svgAnchorY: number;
                let fracX: number;
                let fracY: number;

                if (isScreenCoord) {
                    const contW = containerDimensions.width || 1200;
                    const contH = containerDimensions.height || 640;
                    fracX = anchor.x / Math.max(1, contW);
                    fracY = anchor.y / Math.max(1, contH);
                    svgAnchorX = cameraRef.current.x + fracX * curW;
                    svgAnchorY = cameraRef.current.y + fracY * curH;
                } else {
                    svgAnchorX = anchor.x;
                    svgAnchorY = anchor.y;
                    fracX = (svgAnchorX - cameraRef.current.x) / curW;
                    fracY = (svgAnchorY - cameraRef.current.y) / curH;
                }

                const newW = baseCamera.baseW / targetZoom;
                const newH = baseCamera.baseH / targetZoom;

                const targetX = svgAnchorX - fracX * newW;
                const targetY = svgAnchorY - fracY * newH;

                if (duration !== undefined && duration > 0) {
                    animateCameraTo(targetX, targetY, targetZoom, duration);
                } else {
                    const clamped = clampCamera(targetX, targetY, targetZoom);
                    setCamera({ x: clamped.x, y: clamped.y, zoom: clamped.zoom });
                }
            },
            [baseCamera, containerDimensions, clampCamera, animateCameraTo]
        );

        useImperativeHandle(
            ref,
            () => ({
                focusOn,
                fitAll,
                focusStop,
            }),
            [focusOn, fitAll, focusStop]
        );

        const handleSelectStop = (index: number) => {
            if (containerDimensions.width < 640) {
                setMobileListOpen(false);
            }
            focusStop(index);
            if (stops[index]) {
                onStopSelect?.(stops[index], index);
            }
        };

        const prevActiveDayRef = useRef<number | null>(activeDay ?? null);

        useEffect(() => {
            const currentDay = activeDay ?? null;
            const decision = shouldSyncActiveDay(prevActiveDayRef.current, currentDay);
            prevActiveDayRef.current = currentDay;

            if (decision === 'skip') return;

            if (stops.length > 0) {
                const targetIdx = stops.findIndex((s) => s.dayNumbers.includes(currentDay!));
                if (targetIdx !== -1) {
                    const id = requestAnimationFrame(() => {
                        focusStop(targetIdx);
                    });
                    return () => cancelAnimationFrame(id);
                }
            }
        }, [activeDay, stops, focusStop]);

        const handleResetView = () => {
            fitAll();
        };

        const handleZoomIn = () => {
            const curW = baseCamera.baseW / cameraRef.current.zoom;
            const curH = baseCamera.baseH / cameraRef.current.zoom;
            const visibleCenterX = cameraRef.current.x + ((1 + baseCamera.sidebarFraction) / 2) * curW;
            const visibleCenterY = cameraRef.current.y + ((1 + baseCamera.topInsetFraction) / 2) * curH;
            zoomAbout({ x: visibleCenterX, y: visibleCenterY }, cameraRef.current.zoom * 1.3, false, 280);
        };

        const handleZoomOut = () => {
            const curZoom = cameraRef.current.zoom;
            const nextZoom = Math.max(CAMERA_MIN_ZOOM, curZoom / 1.3);
            if (Math.abs(nextZoom - curZoom) < 0.01) return;
            const curW = baseCamera.baseW / curZoom;
            const curH = baseCamera.baseH / curZoom;
            const visibleCenterX = cameraRef.current.x + ((1 + baseCamera.sidebarFraction) / 2) * curW;
            const visibleCenterY = cameraRef.current.y + ((1 + baseCamera.topInsetFraction) / 2) * curH;
            zoomAbout({ x: visibleCenterX, y: visibleCenterY }, nextZoom, false, 280);
        };

        useEffect(() => {
            tourIndexRef.current = activeStopIndex ?? 0;
        }, [activeStopIndex]);

        useEffect(() => {
            if (!isPlaying) {
                if (playTimerRef.current) clearInterval(playTimerRef.current);
                return;
            }

            playTimerRef.current = setInterval(() => {
                const next = tourIndexRef.current >= stops.length - 1 ? 0 : tourIndexRef.current + 1;
                tourIndexRef.current = next;
                setActiveStopIndex(next);

                const curZoom = cameraRef.current.zoom;
                if (curZoom > 1.02) {
                    const pt = projectedStops[next];
                    if (pt) {
                        focusOn(pt, { zoom: curZoom });
                    }
                }
            }, 2200);

            return () => {
                if (playTimerRef.current) clearInterval(playTimerRef.current);
            };
        }, [isPlaying, stops.length, projectedStops, focusOn]);

        const [isDragging, setIsDragging] = useState(false);
        const dragStartRef = useRef({ x: 0, y: 0 });
        const camStartRef = useRef({ x: 0, y: 0 });

        const handleMouseDown = useCallback((e: React.MouseEvent) => {
            if (e.button !== 0) return;
            if (Math.abs(cameraRef.current.zoom - 1.0) <= 0.02) return;

            if (animFrameRef.current) {
                cancelAnimationFrame(animFrameRef.current);
                animFrameRef.current = null;
            }

            setIsDragging(true);
            dragStartRef.current = { x: e.clientX, y: e.clientY };
            camStartRef.current = { x: cameraRef.current.x, y: cameraRef.current.y };
        }, []);

        const handleMouseMove = useCallback(
            (e: React.MouseEvent) => {
                if (!isDragging) return;
                const dx = e.clientX - dragStartRef.current.x;
                const dy = e.clientY - dragStartRef.current.y;

                const curZoom = cameraRef.current.zoom;
                const curViewW = baseCamera.baseW / curZoom;
                const svgPerScreenPx = curViewW / (containerDimensions.width || 1200);

                const targetX = camStartRef.current.x - dx * svgPerScreenPx;
                const targetY = camStartRef.current.y - dy * svgPerScreenPx;

                const clamped = clampCamera(targetX, targetY, curZoom);
                setCamera({ x: clamped.x, y: clamped.y, zoom: clamped.zoom });
            },
            [isDragging, baseCamera.baseW, containerDimensions.width, clampCamera]
        );

        const handleMouseUp = useCallback(() => {
            setIsDragging(false);
        }, []);

        const touchStateRef = useRef<{
            isDragging: boolean;
            startClientX: number;
            startClientY: number;
            startCamX: number;
            startCamY: number;
            initialPinchDist: number | null;
            initialPinchZoom: number;
        }>({
            isDragging: false,
            startClientX: 0,
            startClientY: 0,
            startCamX: 0,
            startCamY: 0,
            initialPinchDist: null,
            initialPinchZoom: 1,
        });

        const handleTouchStart = useCallback((e: React.TouchEvent) => {
            if (e.touches.length === 1) {
                if (Math.abs(cameraRef.current.zoom - 1.0) <= 0.02) return;
                if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

                const t = e.touches[0];
                touchStateRef.current = {
                    isDragging: true,
                    startClientX: t.clientX,
                    startClientY: t.clientY,
                    startCamX: cameraRef.current.x,
                    startCamY: cameraRef.current.y,
                    initialPinchDist: null,
                    initialPinchZoom: cameraRef.current.zoom,
                };
            } else if (e.touches.length === 2) {
                if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
                const t1 = e.touches[0];
                const t2 = e.touches[1];
                const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
                touchStateRef.current = {
                    isDragging: false,
                    startClientX: (t1.clientX + t2.clientX) / 2,
                    startClientY: (t1.clientY + t2.clientY) / 2,
                    startCamX: cameraRef.current.x,
                    startCamY: cameraRef.current.y,
                    initialPinchDist: dist,
                    initialPinchZoom: cameraRef.current.zoom,
                };
            }
        }, []);

        const handleTouchMove = useCallback(
            (e: React.TouchEvent) => {
                if (e.touches.length === 1 && touchStateRef.current.isDragging) {
                    const t = e.touches[0];
                    const dx = t.clientX - touchStateRef.current.startClientX;
                    const dy = t.clientY - touchStateRef.current.startClientY;

                    const curZoom = cameraRef.current.zoom;
                    const curViewW = baseCamera.baseW / curZoom;
                    const svgPerScreenPx = curViewW / (containerDimensions.width || 1200);

                    const targetX = touchStateRef.current.startCamX - dx * svgPerScreenPx;
                    const targetY = touchStateRef.current.startCamY - dy * svgPerScreenPx;

                    const clamped = clampCamera(targetX, targetY, curZoom);
                    setCamera({ x: clamped.x, y: clamped.y, zoom: clamped.zoom });
                } else if (e.touches.length === 2 && touchStateRef.current.initialPinchDist !== null) {
                    const t1 = e.touches[0];
                    const t2 = e.touches[1];
                    const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
                    if (dist > 5) {
                        const ratio = dist / touchStateRef.current.initialPinchDist;
                        const nextZoom = touchStateRef.current.initialPinchZoom * ratio;

                        const rect = containerRef.current?.getBoundingClientRect();
                        if (rect) {
                            const pinchScreenX = ((t1.clientX + t2.clientX) / 2) - rect.left;
                            const pinchScreenY = ((t1.clientY + t2.clientY) / 2) - rect.top;
                            zoomAbout({ x: pinchScreenX, y: pinchScreenY }, nextZoom, true);
                        }
                    }
                }
            },
            [baseCamera.baseW, containerDimensions.width, clampCamera, zoomAbout]
        );

        const handleTouchEnd = useCallback(() => {
            touchStateRef.current.isDragging = false;
            touchStateRef.current.initialPinchDist = null;
        }, []);

        const [showWheelHint, setShowWheelHint] = useState(false);
        const wheelHintTimerRef = useRef<any>(null);

        useEffect(() => {
            const el = containerRef.current;
            if (!el) return;

            const onWheel = (e: WheelEvent) => {
                if (!e.ctrlKey && !e.metaKey) {
                    setShowWheelHint(true);
                    if (wheelHintTimerRef.current) clearTimeout(wheelHintTimerRef.current);
                    wheelHintTimerRef.current = setTimeout(() => setShowWheelHint(false), 1400);
                    return;
                }

                e.preventDefault();

                const rect = el.getBoundingClientRect();
                const mouseScreenX = e.clientX - rect.left;
                const mouseScreenY = e.clientY - rect.top;

                const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
                const targetZoom = cameraRef.current.zoom * zoomFactor;

                zoomAbout({ x: mouseScreenX, y: mouseScreenY }, targetZoom, true);
            };

            el.addEventListener('wheel', onWheel, { passive: false });
            return () => {
                el.removeEventListener('wheel', onWheel);
            };
        }, [zoomAbout]);

        const handleKeyDown = useCallback(
            (e: React.KeyboardEvent) => {
                const curZoom = cameraRef.current.zoom;
                const curW = baseCamera.baseW / curZoom;
                const curH = baseCamera.baseH / curZoom;
                const visibleCenterX = cameraRef.current.x + ((1 + baseCamera.sidebarFraction) / 2) * curW;
                const visibleCenterY = cameraRef.current.y + ((1 + baseCamera.topInsetFraction) / 2) * curH;

                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const clamped = clampCamera(cameraRef.current.x - 0.1 * curW, cameraRef.current.y, curZoom);
                    setCamera({ x: clamped.x, y: clamped.y, zoom: clamped.zoom });
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    const clamped = clampCamera(cameraRef.current.x + 0.1 * curW, cameraRef.current.y, curZoom);
                    setCamera({ x: clamped.x, y: clamped.y, zoom: clamped.zoom });
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const clamped = clampCamera(cameraRef.current.x, cameraRef.current.y - 0.1 * curH, curZoom);
                    setCamera({ x: clamped.x, y: clamped.y, zoom: clamped.zoom });
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const clamped = clampCamera(cameraRef.current.x, cameraRef.current.y + 0.1 * curH, curZoom);
                    setCamera({ x: clamped.x, y: clamped.y, zoom: clamped.zoom });
                } else if (e.key === '+' || e.key === '=') {
                    e.preventDefault();
                    zoomAbout({ x: visibleCenterX, y: visibleCenterY }, curZoom * 1.3, false, 280);
                } else if (e.key === '-' || e.key === '_') {
                    e.preventDefault();
                    const nextZoom = Math.max(CAMERA_MIN_ZOOM, curZoom / 1.3);
                    if (Math.abs(nextZoom - curZoom) >= 0.01) {
                        zoomAbout({ x: visibleCenterX, y: visibleCenterY }, nextZoom, false, 280);
                    }
                } else if (e.key === '0' || e.key === 'Home') {
                    e.preventDefault();
                    fitAll();
                }
            },
            [baseCamera, clampCamera, zoomAbout, fitAll]
        );

        useEffect(() => {
            return () => {
                if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
                if (wheelHintTimerRef.current) clearTimeout(wheelHintTimerRef.current);
            };
        }, []);

        const activeStop = activeStopIndex !== null ? stops[activeStopIndex] : null;

        const renderStopItem = (stop: DerivedRouteStop, idx: number) => {
            const isSelected = activeStopIndex === idx;
            const isStart = idx === 0;
            const isEnd = idx === stops.length - 1;

            return (
                <button
                    key={stop.id || idx}
                    type="button"
                    onClick={() => handleSelectStop(idx)}
                    className={`w-full flex items-center gap-2.5 text-left p-2 rounded-[8px] transition-all cursor-pointer ${isSelected
                        ? 'bg-[#FAF6F0] border border-[#D8CBB8]/70 shadow-xs'
                        : 'hover:bg-[#FFF8F2] border border-transparent'
                        }`}
                >
                    <div
                        className={`size-5 rounded-full flex items-center justify-center font-heading text-[10px] font-bold shrink-0 transition-colors ${isStart
                            ? 'bg-[#182D09] text-white'
                            : isEnd
                                ? 'bg-[#af6348] text-white'
                                : isSelected
                                    ? 'bg-[#182D09] text-white'
                                    : 'bg-white text-[#182D09]'
                            }`}
                    >
                        {getStopBadgeLabel(stop)}
                    </div>

                    <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                            <span
                                className={`text-xs md:text-[13px] truncate ${isSelected ? 'font-semibold text-[#182D09]' : 'font-medium text-[#313131]'
                                    }`}
                            >
                                {stop.name}
                            </span>
                            <span className="text-[10px] font-medium text-[#707070] shrink-0">
                                {stop.dayLabel}
                            </span>
                        </div>
                    </div>

                    {isSelected && (
                        <ChevronRightIcon className="size-3 text-[#af6348] shrink-0" />
                    )}
                </button>
            );
        };

        const renderStopListContent = () => {
            if (chapters.length > 0) {
                return (
                    <div className="flex flex-col divide-y divide-[#D8CBB8]/50">
                        {chapters.map((chapter, chIdx) => {
                            const chNum = chapter.chapter_number || chIdx + 1;
                            const roman = toRomanNumeral(chNum);
                            const chapterHeading = getStr(chapter.title)?.trim()
                                ? `Chapter ${roman} — ${getStr(chapter.title).trim()}`
                                : `Chapter ${roman}`;
                            const dayRange = chapter.day_range?.trim() || getChapterDayRange(chapter);
                            const chapterStops = stops.filter((s) => s.chapterNumber === chNum);
                            if (chapterStops.length === 0) return null;

                            return (
                                <div key={chNum} className="py-1">
                                    <div className="px-2 pt-1 pb-1 flex items-start justify-between gap-2 select-none">
                                        <span className="text-[9.5px] font-bold uppercase tracking-[1px] text-[#707070] line-clamp-2 leading-tight break-words">
                                            {chapterHeading}
                                        </span>
                                        {dayRange && (
                                            <span className="text-[9px] font-medium text-[#707070] shrink-0 whitespace-nowrap pt-0.5">
                                                {dayRange}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        {chapterStops.map((stop) => {
                                            const globalIdx = stops.indexOf(stop);
                                            return renderStopItem(stop, globalIdx);
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                );
            }

            return (
                <div className="divide-y divide-[#D8CBB8]/50">
                    {stops.map((stop, idx) => renderStopItem(stop, idx))}
                </div>
            );
        };

        if (!itinerary) {
            return null;
        }

        if (stops.length === 0) {
            return (
                <section className={`w-full ${className}`}>
                    <SectionSlideTop id="journey-route" className="w-full">
                        <div className="w-full flex flex-col gap-6 md:gap-8 lg:gap-9 xl:gap-10">
                            <div className="flex max-w-full flex-col gap-2 md:max-w-[640px]">
                                <h2 className="font-heading text-[22px] md:text-[26px] lg:text-[28px] xl:text-[32px] font-semibold leading-tight" style={getStyleObj(routeTitleObj, "#182D09")}>
                                    {routeTitle}
                                </h2>
                                <p className="text-sm md:text-[15px] xl:text-base font-normal leading-relaxed" style={getStyleObj(routeDescObj, "#707070")}>
                                    {routeDescription}
                                </p>
                            </div>
                            <div
                                className="relative w-full h-[480px] md:h-[580px] lg:h-[640px] xl:h-[680px] rounded-[16px] overflow-hidden ring-1 ring-inset ring-[#D8CBB8] bg-clip-padding flex flex-col items-center justify-center text-center p-8 select-none"
                                style={{ backgroundColor: MIRA_COLORS.seaCanvas }}
                            >
                                <h3 className="text-base md:text-lg font-heading font-semibold text-[#182D09] mb-1.5">
                                    Route map coming soon
                                </h3>
                                <p className="text-[#707070] text-xs md:text-sm max-w-md leading-relaxed">
                                    Geographic coordinates and route cartography for this journey are currently being curated by our specialists.
                                </p>
                            </div>
                        </div>
                    </SectionSlideTop>
                </section>
            );
        }

        return (
            <section className={`w-full ${className}`}>
                <SectionSlideTop id="journey-route" className="w-full">
                    <div className="w-full flex flex-col gap-6 md:gap-8 lg:gap-9 xl:gap-10">
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div className="flex max-w-full flex-col gap-2 md:max-w-[640px]">
                                <h2 className="font-heading text-[22px] md:text-[26px] lg:text-[28px] xl:text-[32px] font-semibold leading-tight" style={getStyleObj(routeTitleObj, "#182D09")}>
                                    {routeTitle}
                                </h2>
                                <p className="text-sm md:text-[15px] xl:text-base font-normal leading-relaxed" style={getStyleObj(routeDescObj, "#707070")}>
                                    {routeDescription}
                                </p>
                            </div>

                            {/* Top Meta Badges */}
                            <div className="flex flex-wrap items-center gap-2 shrink-0 self-start md:self-end">
                                {routeBadgeObj ? (
                                    <span
                                        className="px-2.5 py-1 rounded-full bg-[#FAF6F0] border border-[#D8CBB8] text-[11px] font-semibold"
                                        style={getStyleObj(routeBadgeObj, "#182D09")}
                                    >
                                        {getStr(routeBadgeObj, countryBadges.join(" · "))}
                                    </span>
                                ) : (
                                    countryBadges.map((c, i) => (
                                        <span
                                            key={i}
                                            className="px-2.5 py-1 rounded-full bg-[#FAF6F0] border border-[#D8CBB8] text-[11px] font-semibold text-[#182D09]"
                                        >
                                            {c}
                                        </span>
                                    ))
                                )}
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF8F2] border border-[#D8CBB8] text-xs text-[#182D09] font-medium">
                                    <span className="size-1.5 rounded-full bg-[#af6348] animate-pulse" />
                                    <span>{stops.length} Signature Destinations</span>
                                </div>
                            </div>
                        </div>

                        {/* Editorial Map Canvas Container */}
                        <motion.div
                            variants={fadeInUpVariants}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.15 }}
                            tabIndex={0}
                            role="group"
                            aria-label="Route map"
                            onKeyDown={handleKeyDown}
                            className="relative w-full h-[480px] md:h-[580px] lg:h-[640px] xl:h-[680px] rounded-[16px] overflow-hidden ring-1 ring-inset ring-[#D8CBB8] bg-clip-padding select-none [transform:translateZ(0)] focus-visible:ring-2 focus-visible:ring-[#af6348] focus-visible:outline-none"
                            style={{
                                backgroundColor: MIRA_COLORS.seaCanvas,
                                touchAction: camera.zoom > 1.02 ? 'none' : 'pan-y',
                            }}
                            ref={containerRef}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            {/* Soft Vignette Overlay */}
                            <div
                                className="pointer-events-none absolute inset-0 z-0 opacity-35 mix-blend-multiply"
                                style={{
                                    backgroundImage: `radial-gradient(circle at 50% 50%, transparent 45%, rgba(216, 203, 184, 0.35) 100%)`,
                                }}
                            />

                            {/* Wheel Zoom Hint Overlay */}
                            <AnimatePresence>
                                {showWheelHint && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -6 }}
                                        transition={{ duration: 0.2 }}
                                        className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
                                    >
                                        <div className="px-3.5 py-1.5 rounded-full bg-[#182D09]/90 text-white text-xs font-medium backdrop-blur-md shadow-md border border-white/10">
                                            Use <kbd className="px-1 py-0.5 rounded bg-white/20 text-[11px] font-semibold">Ctrl</kbd> + scroll to zoom map
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* SVG Map Canvas */}
                            <svg
                                viewBox={`${camera.x.toFixed(1)} ${camera.y.toFixed(1)} ${(baseCamera.baseW / camera.zoom).toFixed(1)} ${(baseCamera.baseH / camera.zoom).toFixed(1)}`}
                                className={`w-full h-full absolute inset-0 select-none ${camera.zoom > 1.05 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
                                    }`}
                            >
                                <defs>
                                    <filter id="mira-route-glow" x="-20%" y="-20%" width="140%" height="140%">
                                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={MIRA_COLORS.primary} floodOpacity="0.16" />
                                    </filter>
                                </defs>

                                {/* 1. Base Sea Canvas */}
                                <rect
                                    x={camera.x - 4000}
                                    y={camera.y - 4000}
                                    width={(baseCamera.baseW / camera.zoom) + 8000}
                                    height={(baseCamera.baseH / camera.zoom) + 8000}
                                    fill={MIRA_COLORS.seaCanvas}
                                />

                                {/* 2. Real Geographic Landmass Polygons */}
                                {landPaths.length > 0 && (
                                    <g className="landmass-layer" opacity="0.95">
                                        {landPaths.map((d, idx) => (
                                            <path
                                                key={`land-${idx}`}
                                                d={d}
                                                fill={MIRA_COLORS.landFill}
                                                stroke={MIRA_COLORS.coastStroke}
                                                strokeWidth="0.85"
                                                strokeLinejoin="round"
                                                fillRule="evenodd"
                                            />
                                        ))}
                                    </g>
                                )}

                                {/* 3. Coordinate Grid Lines */}
                                <g className="grid-layer" opacity="0.6">
                                    {gridLines.map((line, idx) => (
                                        <g key={`grid-${idx}`}>
                                            <path
                                                d={line.path}
                                                stroke={MIRA_COLORS.gridLine}
                                                strokeWidth="0.65"
                                                strokeDasharray="3 5"
                                            />
                                            <text
                                                x={line.x}
                                                y={line.y}
                                                fill={MIRA_COLORS.gridText}
                                                fontSize="9.5"
                                                fontFamily="sans-serif"
                                                letterSpacing="0.8px"
                                                textAnchor={line.type === 'meridian' ? 'middle' : 'start'}
                                            >
                                                {line.label}
                                            </text>
                                        </g>
                                    ))}
                                </g>

                                {/* 4. Editorial Regional & Country Typography */}
                                <g className="regional-labels-layer" opacity="0.65">
                                    {visibleLabels.map((lbl, idx) => (
                                        <text
                                            key={`lbl-${idx}`}
                                            x={lbl.x}
                                            y={lbl.y}
                                            fill={lbl.type === 'sea' ? MIRA_COLORS.labelSea : MIRA_COLORS.labelLand}
                                            fontSize={lbl.type === 'sea' ? '12' : '11'}
                                            fontWeight={lbl.type === 'sea' ? '400' : '700'}
                                            fontFamily="serif"
                                            fontStyle={lbl.type === 'sea' ? 'italic' : 'normal'}
                                            letterSpacing={lbl.type === 'sea' ? '5px' : '4px'}
                                            textAnchor="middle"
                                            transform={lbl.angle ? `rotate(${lbl.angle}, ${lbl.x}, ${lbl.y})` : undefined}
                                        >
                                            {lbl.name}
                                        </text>
                                    ))}
                                </g>

                                {/* 5. THE ROUTE PATH */}
                                {smoothRoutePath && (
                                    <g className="route-layer">
                                        <path
                                            d={smoothRoutePath}
                                            fill="none"
                                            stroke={MIRA_COLORS.white}
                                            strokeWidth="8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            opacity="0.95"
                                        />
                                        <path
                                            d={smoothRoutePath}
                                            fill="none"
                                            stroke={MIRA_COLORS.accent}
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            opacity="0.32"
                                        />
                                        <path
                                            d={smoothRoutePath}
                                            fill="none"
                                            stroke={MIRA_COLORS.primary}
                                            strokeWidth="3.2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            filter="url(#mira-route-glow)"
                                        />
                                        {legMidpoints.map((mid, idx) => (
                                            <g
                                                key={`arrow-${idx}`}
                                                transform={`translate(${mid.x}, ${mid.y}) rotate(${mid.angle})`}
                                                className="pointer-events-none"
                                            >
                                                <polygon
                                                    points="-5,-3 4,0 -5,3 -2,0"
                                                    fill={MIRA_COLORS.accent}
                                                    opacity="0.95"
                                                />
                                            </g>
                                        ))}
                                    </g>
                                )}

                                {/* 6. LEADER LINES FOR CLOSE STOPS */}
                                <g className="leader-lines-layer" opacity="0.85">
                                    {labelLayouts.map((layout, idx) => {
                                        if (!layout.hasLeaderLine || !layout.leaderTargetX || !layout.leaderTargetY) {
                                            return null;
                                        }
                                        const pillAnchorX = round2(
                                            layout.textAnchor === 'start'
                                                ? layout.pillX
                                                : layout.pillX + layout.pillWidth
                                        );
                                        const pillAnchorY = round2(layout.pillY + layout.pillHeight / 2);

                                        return (
                                            <line
                                                key={`leader-${idx}`}
                                                x1={layout.leaderTargetX}
                                                y1={layout.leaderTargetY}
                                                x2={pillAnchorX}
                                                y2={pillAnchorY}
                                                stroke={MIRA_COLORS.leaderLine}
                                                strokeWidth="1"
                                                strokeDasharray="2 2"
                                            />
                                        );
                                    })}
                                </g>

                                {/* 7. HIERARCHICAL STOP MARKERS & LABELS */}
                                <g className="markers-layer">
                                    {stops.map((stop, idx) => {
                                        const pt = projectedStops[idx];
                                        const layout = labelLayouts[idx];
                                        if (!pt || !layout) return null;

                                        const isStart = idx === 0;
                                        const isEnd = idx === stops.length - 1;
                                        const isActive = activeStopIndex === idx;
                                        const isHovered = hoveredStopIndex === idx;
                                        const isSelected = isActive || isHovered;

                                        return (
                                            <g
                                                key={`marker-group-${idx}`}
                                                className="cursor-pointer"
                                                aria-hidden="true"
                                                onClick={() => handleSelectStop(idx)}
                                                onMouseEnter={() => setHoveredStopIndex(idx)}
                                                onMouseLeave={() => setHoveredStopIndex(null)}
                                            >
                                                {isStart && (
                                                    <g transform={`translate(${pt.x}, ${pt.y})`}>
                                                        <circle
                                                            r={isSelected ? 22 : 17}
                                                            fill="none"
                                                            stroke={MIRA_COLORS.primary}
                                                            strokeWidth="1.2"
                                                            opacity="0.3"
                                                            className="animate-ping"
                                                            style={{ animationDuration: '3.5s' }}
                                                        />
                                                        <circle
                                                            r="16"
                                                            fill="none"
                                                            stroke={MIRA_COLORS.accent}
                                                            strokeWidth="1"
                                                            opacity="0.4"
                                                        />
                                                    </g>
                                                )}

                                                {isEnd && (
                                                    <g transform={`translate(${pt.x}, ${pt.y})`}>
                                                        <circle
                                                            r={isSelected ? 20 : 16}
                                                            fill="none"
                                                            stroke={MIRA_COLORS.accent}
                                                            strokeWidth="1.5"
                                                            strokeDasharray="3 2"
                                                        />
                                                    </g>
                                                )}

                                                {isSelected && (
                                                    <circle
                                                        cx={pt.x}
                                                        cy={pt.y}
                                                        r="18"
                                                        fill="none"
                                                        stroke={MIRA_COLORS.accent}
                                                        strokeWidth="2"
                                                        opacity="0.95"
                                                    />
                                                )}

                                                <circle
                                                    cx={pt.x}
                                                    cy={pt.y}
                                                    r={isHovered ? (isStart || isEnd ? 13.5 : 11.5) : (isStart || isEnd ? 12 : 10)}
                                                    fill={
                                                        isStart
                                                            ? MIRA_COLORS.primary
                                                            : isEnd
                                                                ? MIRA_COLORS.accent
                                                                : isSelected
                                                                    ? MIRA_COLORS.primary
                                                                    : MIRA_COLORS.white
                                                    }
                                                    stroke={isStart || isEnd ? MIRA_COLORS.white : MIRA_COLORS.primary}
                                                    strokeWidth="2"
                                                    filter="url(#mira-route-glow)"
                                                    className="transition-all duration-200"
                                                />

                                                {isStart ? (
                                                    <g transform={`translate(${round2(pt.x - 4)}, ${round2(pt.y - 4)})`}>
                                                        <NavigationIcon className="size-2 text-white" />
                                                    </g>
                                                ) : isEnd ? (
                                                    <g transform={`translate(${round2(pt.x - 4)}, ${round2(pt.y - 4)})`}>
                                                        <FlagIcon className="size-2 text-white" />
                                                    </g>
                                                ) : (
                                                    <text
                                                        x={pt.x}
                                                        y={round2(pt.y + 3.5)}
                                                        fill={isSelected ? MIRA_COLORS.white : MIRA_COLORS.primary}
                                                        fontSize="10"
                                                        fontWeight="700"
                                                        fontFamily="serif"
                                                        textAnchor="middle"
                                                    >
                                                        {getStopBadgeLabel(stop)}
                                                    </text>
                                                )}

                                                {(() => {
                                                    const tag = isStart ? 'DEPART' : isEnd ? 'END' : stop.dayLabel || '';
                                                    const tagWidth = Math.ceil(tag.length * 6.2);
                                                    const maxNameWidth = Math.max(20, layout.pillWidth - 24 - tagWidth);
                                                    const estNameWidth = stop.name.length * 6.8;

                                                    return (
                                                        <g
                                                            transform={`translate(${layout.pillX}, ${layout.pillY})`}
                                                            className="pointer-events-none"
                                                        >
                                                            <rect
                                                                x="0"
                                                                y="0"
                                                                width={layout.pillWidth}
                                                                height={layout.pillHeight}
                                                                rx="6"
                                                                fill={MIRA_COLORS.pillBg}
                                                                stroke={isSelected ? MIRA_COLORS.pillBorderActive : MIRA_COLORS.pillBorder}
                                                                strokeWidth={isSelected ? '1.2' : '0.8'}
                                                                opacity="0.98"
                                                                filter="url(#mira-route-glow)"
                                                            />
                                                            <text
                                                                x="8"
                                                                y="17"
                                                                fill={MIRA_COLORS.primary}
                                                                fontSize="11.5"
                                                                fontWeight="600"
                                                                fontFamily="serif"
                                                                textLength={estNameWidth > maxNameWidth ? maxNameWidth : undefined}
                                                                lengthAdjust={estNameWidth > maxNameWidth ? 'spacingAndGlyphs' : undefined}
                                                            >
                                                                {stop.name}
                                                            </text>
                                                            <text
                                                                x={layout.pillWidth - 8}
                                                                y="17"
                                                                fill={isStart || isEnd ? MIRA_COLORS.accent : MIRA_COLORS.gridText}
                                                                fontSize="9"
                                                                fontWeight="700"
                                                                fontFamily="sans-serif"
                                                                textAnchor="end"
                                                            >
                                                                {tag}
                                                            </text>
                                                        </g>
                                                    );
                                                })()}
                                            </g>
                                        );
                                    })}
                                </g>
                            </svg>

                            {/* Floating Navigation Controls */}
                            <div className="absolute right-3.5 bottom-3.5 md:right-5 md:bottom-5 z-20 flex flex-col items-center gap-1.5 p-1 rounded-full bg-white/95 backdrop-blur-md border border-[#D8CBB8] shadow-[0_4px_16px_rgba(24,45,9,0.06)]">
                                <button
                                    type="button"
                                    onClick={handleZoomIn}
                                    disabled={camera.zoom >= CAMERA_MAX_ZOOM - 0.01}
                                    aria-label="Zoom In"
                                    className={`size-8 rounded-full flex items-center justify-center transition-all ${camera.zoom >= CAMERA_MAX_ZOOM - 0.01
                                            ? 'opacity-40 cursor-not-allowed text-[#707070]'
                                            : 'text-[#182D09] hover:bg-[#FAF6F0] hover:text-[#af6348] active:scale-95 cursor-pointer'
                                        }`}
                                >
                                    <PlusIcon className="size-4" />
                                </button>
                                <div className="w-4 h-px bg-[#D8CBB8]" />
                                <button
                                    type="button"
                                    onClick={handleZoomOut}
                                    disabled={camera.zoom <= CAMERA_MIN_ZOOM + 0.01}
                                    aria-label="Zoom Out"
                                    className={`size-8 rounded-full flex items-center justify-center transition-all ${camera.zoom <= CAMERA_MIN_ZOOM + 0.01
                                            ? 'opacity-40 cursor-not-allowed text-[#707070]'
                                            : 'text-[#182D09] hover:bg-[#FAF6F0] hover:text-[#af6348] active:scale-95 cursor-pointer'
                                        }`}
                                >
                                    <MinusIcon className="size-4" />
                                </button>
                                <div className="w-4 h-px bg-[#D8CBB8]" />
                                <button
                                    type="button"
                                    onClick={handleResetView}
                                    aria-label="Reset Route View"
                                    className="size-8 rounded-full flex items-center justify-center text-[#182D09] hover:bg-[#FAF6F0] hover:text-[#af6348] active:scale-95 transition-all cursor-pointer"
                                >
                                    <ResetIcon className="size-3.5" />
                                </button>
                            </div>

                            {/* Sidebar / Mobile Overlay */}
                            {containerDimensions.width < 640 ? (
                                mobileListOpen ? (
                                    <div className="absolute left-3 top-3 z-20 w-[min(260px,calc(100%-24px))] max-h-[60%] rounded-[12px] bg-white/95 backdrop-blur-md border border-[#D8CBB8] shadow-lg flex flex-col overflow-hidden pointer-events-auto">
                                        <div className="p-2.5 border-b border-[#D8CBB8] flex items-center justify-between">
                                            <button
                                                type="button"
                                                onClick={() => setMobileListOpen(false)}
                                                className="flex items-center gap-1.5 text-left cursor-pointer group"
                                            >
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold uppercase tracking-[1.2px] text-[#707070]">
                                                        Itinerary Route
                                                    </span>
                                                    <span className="text-xs font-semibold text-[#182D09] group-hover:text-[#af6348] flex items-center gap-1">
                                                        {stops.length} Stops · {totalDays} Days
                                                        <ChevronDownIcon className="size-3 rotate-180 transition-transform text-[#707070]" />
                                                    </span>
                                                </div>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsPlaying((p) => !p)}
                                                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer shadow-xs ${isPlaying
                                                    ? 'bg-[#182D09] text-white'
                                                    : 'bg-[#FAF6F0] text-[#182D09] hover:bg-[#FFF8F2] border border-[#D8CBB8]/60'
                                                    }`}
                                            >
                                                {isPlaying ? (
                                                    <>
                                                        <PauseIcon className="size-2.5" />
                                                        <span>Pause</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <PlayIcon className="size-2.5" />
                                                        <span>Tour</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        <div className="flex-1 overflow-y-auto p-1">
                                            {renderStopListContent()}
                                        </div>

                                        {activeStop && (
                                            <div className="p-2 bg-[#FFF8F2] border-t border-[#D8CBB8] flex items-center gap-2 shrink-0">
                                                <MapPinIcon className="size-3.5 text-[#af6348] shrink-0" />
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-[10.5px] font-bold text-[#182D09] truncate">
                                                        {activeStop.name}
                                                    </span>
                                                    <span className="text-[9.5px] text-[#707070]">
                                                        {activeStopIndex === 0
                                                            ? `${activeStop.dayLabel} · Starting departure`
                                                            : activeStopIndex === stops.length - 1
                                                                ? `${activeStop.dayLabel} · Final destination`
                                                                : `${activeStop.dayLabel} · Stop ${(activeStopIndex ?? 0) + 1} of ${stops.length}`}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div
                                        ref={sidebarRef}
                                        className="absolute left-3 top-3 z-20 flex items-center gap-1.5 p-1 rounded-full bg-white/95 backdrop-blur-md border border-[#D8CBB8] shadow-xs pointer-events-auto"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setMobileListOpen(true)}
                                            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#182D09] hover:text-[#af6348] transition-colors cursor-pointer"
                                        >
                                            <span>Route · {stops.length} stops</span>
                                            <ChevronDownIcon className="size-3 text-[#707070]" />
                                        </button>
                                        <div className="w-px h-3.5 bg-[#D8CBB8]" />
                                        <button
                                            type="button"
                                            onClick={() => setIsPlaying((p) => !p)}
                                            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer shadow-xs ${isPlaying
                                                ? 'bg-[#182D09] text-white'
                                                : 'bg-[#FAF6F0] text-[#182D09] hover:bg-[#FFF8F2] border border-[#D8CBB8]/60'
                                                }`}
                                        >
                                            {isPlaying ? (
                                                <>
                                                    <PauseIcon className="size-2.5" />
                                                    <span>Pause</span>
                                                </>
                                            ) : (
                                                <>
                                                    <PlayIcon className="size-2.5" />
                                                    <span>Tour</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )
                            ) : (
                                <div
                                    ref={sidebarRef}
                                    className="absolute left-3 top-3 md:left-5 md:top-5 bottom-3 md:bottom-5 z-20 w-[190px] md:w-[230px] rounded-[12px] bg-white/95 backdrop-blur-md border border-[#D8CBB8] shadow-md flex flex-col overflow-hidden pointer-events-auto"
                                >
                                    <div className="p-3 border-b border-[#D8CBB8] flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[10.5px] font-bold uppercase tracking-[1.5px] text-[#707070]">
                                                Itinerary Route
                                            </span>
                                            <span className="text-xs text-[#182D09] font-semibold">
                                                {stops.length} Stops · {totalDays} Days
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setIsPlaying((p) => !p)}
                                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer shadow-xs ${isPlaying
                                                ? 'bg-[#182D09] text-white'
                                                : 'bg-[#FAF6F0] text-[#182D09] hover:bg-[#FFF8F2] border border-[#D8CBB8]/60'
                                                }`}
                                        >
                                            {isPlaying ? (
                                                <>
                                                    <PauseIcon className="size-3" />
                                                    <span>Pause</span>
                                                </>
                                            ) : (
                                                <>
                                                    <PlayIcon className="size-3" />
                                                    <span>Tour</span>
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-1">
                                        {renderStopListContent()}
                                    </div>

                                    {activeStop && (
                                        <div className="p-2.5 bg-[#FFF8F2] border-t border-[#D8CBB8] flex items-center gap-2">
                                            <MapPinIcon className="size-4 text-[#af6348] shrink-0" />
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[11px] font-bold text-[#182D09] truncate">
                                                    {activeStop.name}
                                                </span>
                                                <span className="text-[10px] text-[#707070]">
                                                    {activeStopIndex === 0
                                                        ? `${activeStop.dayLabel} · Starting departure`
                                                        : activeStopIndex === stops.length - 1
                                                            ? `${activeStop.dayLabel} · Final destination`
                                                            : `${activeStop.dayLabel} · Stop ${(activeStopIndex ?? 0) + 1} of ${stops.length}`}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </SectionSlideTop>
            </section>
        );
    });

export default JourneyRouteMap;
