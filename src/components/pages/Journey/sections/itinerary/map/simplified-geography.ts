/**
 * Simplified, organic geographic dataset and projection math for MIRA editorial route maps.
 * Replaces literal GIS cartography with naturalistic, hand-crafted coastal silhouettes.
 */

export interface GeoPoint {
    lng: number;
    lat: number;
}

export interface ScreenPoint {
    x: number;
    y: number;
}

export interface GeoBounds {
    minLng: number;
    maxLng: number;
    minLat: number;
    maxLat: number;
}

/**
 * Calculates an aspect-ratio-preserving Mercator bounding box centered on points,
 * ensuring the route line and stop cluster fill ~65-70% of the canvas height.
 */
/**
 * Calculates an aspect-ratio-preserving Mercator bounding box centered on points,
 * with dual-axis constraint to guarantee that neither tall north-south nor wide east-west
 * routes ever overflow or get cropped, while maintaining room for the left sidebar overlay.
 */
export function computeBounds(
    points: { lng: number; lat: number }[],
    canvasWidth = 1200,
    canvasHeight = 760,
    targetHeightRatio = 0.76,
    targetWidthRatio = 0.62
): GeoBounds {
    if (points.length === 0) {
        return { minLng: 17.25, maxLng: 22.07, minLat: 39.38, maxLat: 41.70 };
    }

    let minLng = Infinity;
    let maxLng = -Infinity;
    let minLat = Infinity;
    let maxLat = -Infinity;

    for (const p of points) {
        if (p.lng < minLng) minLng = p.lng;
        if (p.lng > maxLng) maxLng = p.lng;
        if (p.lat < minLat) minLat = p.lat;
        if (p.lat > maxLat) maxLat = p.lat;
    }

    const centerLng = (minLng + maxLng) / 2;
    const centerLat = (minLat + maxLat) / 2;
    const spanLat = Math.max(maxLat - minLat, 0.4);
    const spanLng = Math.max(maxLng - minLng, 0.4);

    const cosLat = Math.cos((centerLat * Math.PI) / 180);

    // Calculate maximum allowable scale per axis
    const scaleFromLat = (canvasHeight * targetHeightRatio) / spanLat;
    const scaleFromLng = ((canvasWidth * targetWidthRatio) / spanLng) / cosLat;

    // Use the more restrictive scale to strictly guarantee no overflow in either axis
    const pixelsPerLatDeg = Math.min(scaleFromLat, scaleFromLng);
    const pixelsPerLngDeg = pixelsPerLatDeg * cosLat;

    const viewportLatSpan = canvasHeight / pixelsPerLatDeg;
    const viewportLngSpan = canvasWidth / pixelsPerLngDeg;

    return {
        minLng: centerLng - viewportLngSpan / 2,
        maxLng: centerLng + viewportLngSpan / 2,
        minLat: centerLat - viewportLatSpan / 2,
        maxLat: centerLat + viewportLatSpan / 2,
    };
}

export function round2(n: number): number {
    return Math.round(n * 100) / 100;
}

/**
 * Projects longitude and latitude onto SVG viewport coordinate space using
 * Mercator projection tuned for regional scales.
 */
export function projectGeo(
    lng: number,
    lat: number,
    bounds: GeoBounds,
    width: number,
    height: number
): ScreenPoint {
    const minLng = bounds.minLng;
    const maxLng = bounds.maxLng;
    const minLat = bounds.minLat;
    const maxLat = bounds.maxLat;

    const latRad = (lat * Math.PI) / 180;
    const minLatRad = (minLat * Math.PI) / 180;
    const maxLatRad = (maxLat * Math.PI) / 180;

    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const minMercN = Math.log(Math.tan(Math.PI / 4 + minLatRad / 2));
    const maxMercN = Math.log(Math.tan(Math.PI / 4 + maxLatRad / 2));

    const u = (lng - minLng) / (maxLng - minLng);
    const v = (mercN - minMercN) / (maxMercN - minMercN);

    const x = round2(u * width);
    const y = round2((1 - v) * height);

    return { x, y };
}

/**
 * Ensures minimum diagrammatic spacing between projected stop markers.
 * Designed to preserve geographic fidelity:
 * 1. Adaptive spacing target (42px) matching visual marker circle footprint.
 * 2. Capped maximum displacement per stop (max 22px) so 3+ clustered stops never drift away geographically.
 * 3. Centroid anchoring: preserves the cluster's geographic center of mass.
 */
export function ensureDiagrammaticStopSpacing<T extends ScreenPoint>(
    points: T[],
    minDistance = 42,
    maxDisplacement = 22
): T[] {
    const result = points.map((p) => ({ ...p }));
    const n = result.length;
    if (n <= 1) return result;

    const origX = points.map((p) => p.x);
    const origY = points.map((p) => p.y);
    const origCenterX = origX.reduce((a, b) => a + b, 0) / n;
    const origCenterY = origY.reduce((a, b) => a + b, 0) / n;

    for (let iter = 0; iter < 5; iter++) {
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                let dx = result[j].x - result[i].x;
                let dy = result[j].y - result[i].y;
                let dist = Math.hypot(dx, dy);

                if (dist < minDistance) {
                    if (dist < 1) {
                        dx = 1;
                        dy = 1;
                        dist = Math.SQRT2;
                    }
                    const needed = ((minDistance - dist) / 2) * 0.55;
                    const nx = dx / dist;
                    const ny = dy / dist;

                    result[i].x -= nx * needed;
                    result[i].y -= ny * needed;
                    result[j].x += nx * needed;
                    result[j].y += ny * needed;
                }
            }
        }

        // Clamp displacement from true geographic position
        for (let i = 0; i < n; i++) {
            const shiftX = result[i].x - origX[i];
            const shiftY = result[i].y - origY[i];
            const shiftDist = Math.hypot(shiftX, shiftY);
            if (shiftDist > maxDisplacement) {
                result[i].x = origX[i] + (shiftX / shiftDist) * maxDisplacement;
                result[i].y = origY[i] + (shiftY / shiftDist) * maxDisplacement;
            }
        }
    }

    // Preserve geographic centroid
    const finalCenterX = result.reduce((a, b) => a + b.x, 0) / n;
    const finalCenterY = result.reduce((a, b) => a + b.y, 0) / n;
    const driftX = finalCenterX - origCenterX;
    const driftY = finalCenterY - origCenterY;

    return result.map((p) => ({
        ...p,
        x: round2(p.x - driftX * 0.5),
        y: round2(p.y - driftY * 0.5),
    }));
}

/**
 * Bezier segment control points for route curves.
 */
export interface SplineSegment {
    p1: ScreenPoint;
    cp1: ScreenPoint;
    cp2: ScreenPoint;
    p2: ScreenPoint;
}

/**
 * Single source of truth for computing smooth Catmull-Rom spline cubic Bezier segments
 * with turn-angle tangent blending and overshoot clamping.
 */
export function getRouteSplineSegments(points: ScreenPoint[]): SplineSegment[] {
    if (points.length < 2) return [];

    const segments: SplineSegment[] = [];

    for (let i = 0; i < points.length - 1; i++) {
        const p0 = i > 0 ? points[i - 1] : points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = i < points.length - 2 ? points[i + 2] : p2;

        const vInX = p1.x - p0.x;
        const vInY = p1.y - p0.y;
        const vOutX = p2.x - p1.x;
        const vOutY = p2.y - p1.y;
        const lenIn = Math.hypot(vInX, vInY) || 1;
        const lenOut = Math.hypot(vOutX, vOutY) || 1;
        const dot = (vInX * vOutX + vInY * vOutY) / (lenIn * lenOut);

        const dist12 = lenOut;

        // Continuous smooth tangent blending:
        // dot = 1.0 (straight segment, 0° turn) -> full standard Catmull-Rom tangent
        // dot = -0.45 (hairpin turn, 115°+ turn) -> chord-directed tangent (eliminates bulbous loops)
        // Transitions continuously without hard threshold discontinuities
        const blend1 = Math.max(0, Math.min(1, (dot - (-0.45)) / (0.35 - (-0.45))));
        const stdT1x = (p2.x - p0.x) * 0.22;
        const stdT1y = (p2.y - p0.y) * 0.22;
        const chordT1x = vOutX * 0.28;
        const chordT1y = vOutY * 0.28;

        let t1x = blend1 * stdT1x + (1 - blend1) * chordT1x;
        let t1y = blend1 * stdT1y + (1 - blend1) * chordT1y;

        const vNextX = p3.x - p2.x;
        const vNextY = p3.y - p2.y;
        const lenNext = Math.hypot(vNextX, vNextY) || 1;
        const dotNext = (vOutX * vNextX + vOutY * vNextY) / (lenOut * lenNext);

        const blend2 = Math.max(0, Math.min(1, (dotNext - (-0.45)) / (0.35 - (-0.45))));
        const stdT2x = (p3.x - p1.x) * 0.22;
        const stdT2y = (p3.y - p1.y) * 0.22;
        const chordT2x = vOutX * 0.28;
        const chordT2y = vOutY * 0.28;

        let t2x = blend2 * stdT2x + (1 - blend2) * chordT2x;
        let t2y = blend2 * stdT2y + (1 - blend2) * chordT2y;

        // Clamp tangents to prevent overshoot
        const maxT = dist12 * 0.35;
        const lenT1 = Math.hypot(t1x, t1y);
        const lenT2 = Math.hypot(t2x, t2y);

        if (lenT1 > maxT && lenT1 > 0) {
            t1x = (t1x / lenT1) * maxT;
            t1y = (t1y / lenT1) * maxT;
        }
        if (lenT2 > maxT && lenT2 > 0) {
            t2x = (t2x / lenT2) * maxT;
            t2y = (t2y / lenT2) * maxT;
        }

        const cp1x = p1.x + t1x;
        const cp1y = p1.y + t1y;
        const cp2x = p2.x - t2x;
        const cp2y = p2.y - t2y;

        segments.push({
            p1,
            cp1: { x: cp1x, y: cp1y },
            cp2: { x: cp2x, y: cp2y },
            p2,
        });
    }

    return segments;
}

/**
 * Generates an organic, loop-free spline that smoothly sweeps through all stops
 * without self-intersecting or looping back on itself.
 * Uses continuous, smooth tangent blending based on turn angle to eliminate hardcoded
 * threshold discontinuities.
 */
export function createSmoothRoutePath(
    points: ScreenPoint[]
): string {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
    if (points.length === 2) {
        const p0 = points[0];
        const p1 = points[1];
        const dx = p1.x - p0.x;
        const dy = p1.y - p0.y;
        const dist = Math.hypot(dx, dy);
        const nx = -dy / (dist || 1);
        const ny = dx / (dist || 1);
        const arc = dist * 0.12;
        const cx = (p0.x + p1.x) / 2 + nx * arc;
        const cy = (p0.y + p1.y) / 2 + ny * arc;
        return `M ${p0.x.toFixed(1)} ${p0.y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
    }

    const segments = getRouteSplineSegments(points);
    let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

    for (const seg of segments) {
        d += ` C ${seg.cp1.x.toFixed(1)} ${seg.cp1.y.toFixed(1)}, ${seg.cp2.x.toFixed(1)} ${seg.cp2.y.toFixed(1)}, ${seg.p2.x.toFixed(1)} ${seg.p2.y.toFixed(1)}`;
    }

    return d;
}

/**
 * Samples discrete points along the continuous route spline for collision detection.
 */
export function sampleRouteSplinePoints(
    points: ScreenPoint[],
    samplesPerSegment = 100
): ScreenPoint[] {
    if (points.length < 2) return [...points];
    const sampled: ScreenPoint[] = [];

    if (points.length === 2) {
        const p0 = points[0];
        const p1 = points[1];
        const dx = p1.x - p0.x;
        const dy = p1.y - p0.y;
        const dist = Math.hypot(dx, dy);
        const nx = -dy / (dist || 1);
        const ny = dx / (dist || 1);
        const arc = dist * 0.12;
        const cx = (p0.x + p1.x) / 2 + nx * arc;
        const cy = (p0.y + p1.y) / 2 + ny * arc;

        for (let s = 0; s <= samplesPerSegment; s++) {
            const t = s / samplesPerSegment;
            const t1 = 1 - t;
            const x = t1 * t1 * p0.x + 2 * t1 * t * cx + t * t * p1.x;
            const y = t1 * t1 * p0.y + 2 * t1 * t * cy + t * t * p1.y;
            sampled.push({ x: round2(x), y: round2(y) });
        }
        return sampled;
    }

    const segments = getRouteSplineSegments(points);

    for (const seg of segments) {
        for (let s = 0; s <= samplesPerSegment; s++) {
            const t = s / samplesPerSegment;
            const t1 = 1 - t;
            const x = t1 * t1 * t1 * seg.p1.x + 3 * t1 * t1 * t * seg.cp1.x + 3 * t1 * t * t * seg.cp2.x + t * t * t * seg.p2.x;
            const y = t1 * t1 * t1 * seg.p1.y + 3 * t1 * t1 * t * seg.cp1.y + 3 * t1 * t * t * seg.cp2.y + t * t * t * seg.p2.y;
            sampled.push({ x: round2(x), y: round2(y) });
        }
    }

    return sampled;
}

/**
 * Computes midpoints and tangent angles along each leg of the journey for
 * directional flow arrows / chevrons.
 */
export function getRouteLegMidpoints(
    points: ScreenPoint[]
): { x: number; y: number; angle: number; legIndex: number }[] {
    const midpoints: { x: number; y: number; angle: number; legIndex: number }[] = [];
    if (points.length < 2) return midpoints;

    for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

        midpoints.push({
            x: round2((p1.x + p2.x) / 2),
            y: round2((p1.y + p2.y) / 2),
            angle: round2(angle),
            legIndex: i + 1,
        });
    }

    return midpoints;
}

/**
 * Smart label layout with automatic proximity collision resolution.
 * When stops are close together (e.g. Butrint & Ksamil), anchors labels to opposite
 * quadrants and generates an elegant leader tick line so labels never stack.
 */
export interface ResolvedLabelLayout {
    stopIndex: number;
    pillX: number;
    pillY: number;
    pillWidth: number;
    pillHeight: number;
    hasLeaderLine: boolean;
    leaderTargetX?: number;
    leaderTargetY?: number;
    textAnchor: 'start' | 'end' | 'middle';
    alignClass: string;
}

interface CandidatePosition {
    offsetX: number;
    offsetY: number;
    hasLeaderLine: boolean;
    textAnchor: 'start' | 'end' | 'middle';
    alignClass: string;
    biasScore: number;
}

export function computeStopPillWidth(
    stop: { name: string; days?: string; dayLabel?: string },
    index: number,
    totalStops: number
): number {
    const isStart = index === 0;
    const isEnd = index === totalStops - 1;
    const tag = isStart ? 'DEPART' : isEnd ? 'END' : stop.dayLabel || '';
    const nameWidth = stop.name.length * 6.8;
    const tagWidth = tag.length * 6.2;
    const required = Math.ceil(8 + nameWidth + 10 + tagWidth + 8);
    return Math.max(116, required);
}

export function getCandidatePositions(
    i: number,
    n: number,
    pt: ScreenPoint,
    _stops: { name: string; days?: string; dayLabel?: string }[],
    projectedPoints: ScreenPoint[],
    pillWidth = 116
): CandidatePosition[] {
    const isStart = i === 0;
    const isEnd = i === n - 1;

    // Compute route direction
    let vx = 0;
    let vy = 0;
    if (i > 0) {
        vx += pt.x - projectedPoints[i - 1].x;
        vy += pt.y - projectedPoints[i - 1].y;
    }
    if (i < n - 1) {
        vx += projectedPoints[i + 1].x - pt.x;
        vy += projectedPoints[i + 1].y - pt.y;
    }
    const len = Math.hypot(vx, vy) || 1;
    const nx = -vy / len; // Perpendicular normal

    const candidates: CandidatePosition[] = [
        // 1. Right (standard)
        { offsetX: 24, offsetY: -13, hasLeaderLine: false, textAnchor: 'start', alignClass: 'items-start text-left', biasScore: nx > 0 ? 0 : 20 },
        // 2. Left (standard)
        { offsetX: -140, offsetY: -13, hasLeaderLine: false, textAnchor: 'end', alignClass: 'items-end text-right', biasScore: nx < 0 ? 0 : 20 },
        // 3. Below (Down-Right)
        { offsetX: 20, offsetY: 20, hasLeaderLine: true, textAnchor: 'start', alignClass: 'items-start text-left', biasScore: 35 },
        // 4. Below (Down-Left)
        { offsetX: -136, offsetY: 20, hasLeaderLine: true, textAnchor: 'end', alignClass: 'items-end text-right', biasScore: 35 },
        // 5. Above (Up-Right)
        { offsetX: 20, offsetY: -38, hasLeaderLine: true, textAnchor: 'start', alignClass: 'items-start text-left', biasScore: 35 },
        // 6. Above (Up-Left)
        { offsetX: -136, offsetY: -38, hasLeaderLine: true, textAnchor: 'end', alignClass: 'items-end text-right', biasScore: 35 },
        // 7. Directly Above
        { offsetX: -58, offsetY: -44, hasLeaderLine: true, textAnchor: 'start', alignClass: 'items-start text-left', biasScore: 50 },
        // 8. Directly Below
        { offsetX: -58, offsetY: 18, hasLeaderLine: true, textAnchor: 'start', alignClass: 'items-start text-left', biasScore: 50 },
        // 9. Far Right
        { offsetX: 44, offsetY: -13, hasLeaderLine: true, textAnchor: 'start', alignClass: 'items-start text-left', biasScore: 60 },
        // 10. Far Left
        { offsetX: -152, offsetY: -13, hasLeaderLine: true, textAnchor: 'end', alignClass: 'items-end text-right', biasScore: 60 },
        // 11. Below-Right (further down to avoid adjacent markers)
        { offsetX: 20, offsetY: 28, hasLeaderLine: true, textAnchor: 'start', alignClass: 'items-start text-left', biasScore: 40 },
        // 12. Directly Below (lower)
        { offsetX: -58, offsetY: 26, hasLeaderLine: true, textAnchor: 'start', alignClass: 'items-start text-left', biasScore: 50 },
        // 13. Below-Right shifted
        { offsetX: -30, offsetY: 24, hasLeaderLine: true, textAnchor: 'start', alignClass: 'items-start text-left', biasScore: 45 },
        // 14. Mid-Down Left (vertical stack for coastal cluster)
        { offsetX: -136, offsetY: 32, hasLeaderLine: true, textAnchor: 'end', alignClass: 'items-end text-right', biasScore: 35 },
        // 15. Deep Down Left (lower vertical stack)
        { offsetX: -136, offsetY: 42, hasLeaderLine: true, textAnchor: 'end', alignClass: 'items-end text-right', biasScore: 35 },
        // 16. Far Down Left (extended clearance for hairpin turns)
        { offsetX: -152, offsetY: 42, hasLeaderLine: true, textAnchor: 'end', alignClass: 'items-end text-right', biasScore: 35 },
        // 17. Deep Coastal Stack
        { offsetX: -136, offsetY: 56, hasLeaderLine: true, textAnchor: 'end', alignClass: 'items-end text-right', biasScore: 35 },
        // 18. Below-Right clearance (avoids eastern marker without hitting southern pill)
        { offsetX: 20, offsetY: 24, hasLeaderLine: true, textAnchor: 'start', alignClass: 'items-start text-left', biasScore: 35 },
        // 19. High Above-Left (clearance for tight mountain clusters)
        { offsetX: -136, offsetY: -52, hasLeaderLine: true, textAnchor: 'end', alignClass: 'items-end text-right', biasScore: 40 },
        // 20. High Above-Right (clearance for arriving coastal/spline turns)
        { offsetX: 20, offsetY: -52, hasLeaderLine: true, textAnchor: 'start', alignClass: 'items-start text-left', biasScore: 40 },
        // 21. Far Below-Right (clearance for southern clusters)
        { offsetX: 24, offsetY: 38, hasLeaderLine: true, textAnchor: 'start', alignClass: 'items-start text-left', biasScore: 40 },
        // 22. Directly Above High
        { offsetX: -58, offsetY: -56, hasLeaderLine: true, textAnchor: 'start', alignClass: 'items-start text-left', biasScore: 45 },
    ];

    // Adjust candidate offsets when pillWidth is wider than 116
    if (pillWidth !== 116) {
        const extra = pillWidth - 116;
        for (const c of candidates) {
            if (c.textAnchor === 'end') {
                c.offsetX -= extra;
            } else if (c.offsetX === -58) {
                c.offsetX = -Math.round(pillWidth / 2);
            } else if (c.offsetX === -30) {
                c.offsetX -= Math.round(extra / 2);
            }
        }
    }

    if (isStart) {
        for (const c of candidates) {
            if (c.offsetX > 0) c.biasScore -= 30;
        }
    } else if (isEnd) {
        for (const c of candidates) {
            if (c.offsetX < 0) c.biasScore -= 30;
        }
    }

    return candidates;
}

export function scoreCandidate(
    cand: CandidatePosition,
    i: number,
    n: number,
    pt: ScreenPoint,
    projectedPoints: ScreenPoint[],
    currentLayouts: (ResolvedLabelLayout | null)[],
    splinePoints: ScreenPoint[],
    pillW = 116
): number {
    const pillH = 26;
    const pillX = pt.x + cand.offsetX;
    const pillY = pt.y + cand.offsetY;

    let penalty = cand.biasScore;

    // 1. Penalize overlapping any OTHER stop's marker circle (radius ~14)
    for (let j = 0; j < n; j++) {
        if (j === i) continue;
        const otherPt = projectedPoints[j];
        if (!otherPt) continue;
        const closestX = Math.max(pillX, Math.min(otherPt.x, pillX + pillW));
        const closestY = Math.max(pillY, Math.min(otherPt.y, pillY + pillH));
        const dist = Math.hypot(otherPt.x - closestX, otherPt.y - closestY);
        if (dist < 14) {
            penalty += 500000 + (14 - dist) * 10000;
        } else if (dist < 20) {
            penalty += (20 - dist) * 100;
        }
    }

    // 2. Penalize overlapping own marker circle (radius ~12)
    const ownClosestX = Math.max(pillX, Math.min(pt.x, pillX + pillW));
    const ownClosestY = Math.max(pillY, Math.min(pt.y, pillY + pillH));
    const ownDist = Math.hypot(pt.x - ownClosestX, pt.y - ownClosestY);
    if (ownDist < 12) {
        penalty += 200000 + (12 - ownDist) * 5000;
    }

    // 3. Penalize overlapping any other placed pill
    for (let j = 0; j < n; j++) {
        if (j === i) continue;
        const other = currentLayouts[j];
        if (!other) continue;
        const overlapX = Math.max(0, Math.min(pillX + pillW, other.pillX + other.pillWidth) - Math.max(pillX, other.pillX));
        const overlapY = Math.max(0, Math.min(pillY + pillH, other.pillY + other.pillHeight) - Math.max(pillY, other.pillY));
        if (overlapX > 0 && overlapY > 0) {
            penalty += 1000000 + (overlapX * overlapY) * 500;
        } else {
            const gapX = Math.max(0, Math.max(pillX, other.pillX) - Math.min(pillX + pillW, other.pillX + other.pillWidth));
            const gapY = Math.max(0, Math.max(pillY, other.pillY) - Math.min(pillY + pillH, other.pillY + other.pillHeight));
            if (gapX < 6 && gapY < 6) {
                penalty += (6 - Math.max(gapX, gapY)) * 50;
            }
        }
    }

    // 4. Canvas bounds constraints
    if (pillX < 10) penalty += (10 - pillX) * 1000;
    if (pillX + pillW > 990) penalty += (pillX + pillW - 990) * 1000;
    if (pillY < 10) penalty += (10 - pillY) * 1000;
    if (pillY + pillH > 690) penalty += (pillY + pillH - 690) * 1000;

    // 5. Penalize overlapping the route spline
    for (let s = 0; s < splinePoints.length; s++) {
        const sp = splinePoints[s];
        if (sp.x >= pillX && sp.x <= pillX + pillW && sp.y >= pillY && sp.y <= pillY + pillH) {
            penalty += 800000;
            break;
        }
    }

    return penalty;
}

export function resolveAllStopLabels(
    stops: { name: string; days?: string; dayLabel?: string }[],
    projectedPoints: ScreenPoint[],
    splinePoints?: ScreenPoint[]
): ResolvedLabelLayout[] {
    const n = stops.length;
    const currentLayouts: (ResolvedLabelLayout | null)[] = new Array(n).fill(null);
    const chosenCandidateIdx: number[] = new Array(n).fill(0);
    const candidateListPerStop: CandidatePosition[][] = [];
    const spline = splinePoints ?? sampleRouteSplinePoints(projectedPoints, 100);

    const pillWidths = stops.map((s, i) => computeStopPillWidth(s, i, n));

    for (let i = 0; i < n; i++) {
        const pt = projectedPoints[i];
        if (!pt) {
            candidateListPerStop.push([]);
            continue;
        }
        candidateListPerStop.push(getCandidatePositions(i, n, pt, stops, projectedPoints, pillWidths[i]));
    }

    // Pass 1: Initial greedy assignment
    for (let i = 0; i < n; i++) {
        const pt = projectedPoints[i];
        if (!pt) continue;
        const candidates = candidateListPerStop[i];
        let bestIdx = 0;
        let bestScore = Infinity;
        for (let c = 0; c < candidates.length; c++) {
            const score = scoreCandidate(candidates[c], i, n, pt, projectedPoints, currentLayouts, spline, pillWidths[i]);
            if (score < bestScore) {
                bestScore = score;
                bestIdx = c;
            }
        }
        chosenCandidateIdx[i] = bestIdx;
        const chosen = candidates[bestIdx];
        currentLayouts[i] = {
            stopIndex: i,
            pillX: round2(pt.x + chosen.offsetX),
            pillY: round2(pt.y + chosen.offsetY),
            pillWidth: pillWidths[i],
            pillHeight: 26,
            hasLeaderLine: chosen.hasLeaderLine,
            leaderTargetX: round2(pt.x),
            leaderTargetY: round2(pt.y),
            textAnchor: chosen.textAnchor,
            alignClass: chosen.alignClass,
        };
    }

    // Pass 2 & 3: Relaxation passes to escape greedy local minima
    for (let pass = 0; pass < 3; pass++) {
        let changed = false;
        for (let i = 0; i < n; i++) {
            const pt = projectedPoints[i];
            if (!pt) continue;
            const candidates = candidateListPerStop[i];
            let bestIdx = chosenCandidateIdx[i];
            let bestScore = scoreCandidate(candidates[bestIdx], i, n, pt, projectedPoints, currentLayouts, spline, pillWidths[i]);

            for (let c = 0; c < candidates.length; c++) {
                if (c === chosenCandidateIdx[i]) continue;
                const score = scoreCandidate(candidates[c], i, n, pt, projectedPoints, currentLayouts, spline, pillWidths[i]);
                if (score < bestScore) {
                    bestScore = score;
                    bestIdx = c;
                    changed = true;
                }
            }

            if (bestIdx !== chosenCandidateIdx[i]) {
                chosenCandidateIdx[i] = bestIdx;
                const chosen = candidates[bestIdx];
                currentLayouts[i] = {
                    stopIndex: i,
                    pillX: round2(pt.x + chosen.offsetX),
                    pillY: round2(pt.y + chosen.offsetY),
                    pillWidth: pillWidths[i],
                    pillHeight: 26,
                    hasLeaderLine: chosen.hasLeaderLine,
                    leaderTargetX: round2(pt.x),
                    leaderTargetY: round2(pt.y),
                    textAnchor: chosen.textAnchor,
                    alignClass: chosen.alignClass,
                };
            }
        }
        if (!changed) break;
    }

    return currentLayouts.filter((l): l is ResolvedLabelLayout => l !== null);
}

/**
 * Generates clean, visible longitude and latitude grid reference lines
 * with adaptive step size so both axes are ALWAYS visible.
 */
export function generateAdaptiveGridLines(
    bounds: GeoBounds,
    width: number,
    height: number
): { path: string; label: string; x: number; y: number; type: 'meridian' | 'parallel' }[] {
    const lines: { path: string; label: string; x: number; y: number; type: 'meridian' | 'parallel' }[] = [];

    const dLng = bounds.maxLng - bounds.minLng;
    const dLat = bounds.maxLat - bounds.minLat;

    // Adaptive step sizing
    let lngStep = 1.0;
    if (dLng <= 1.8) lngStep = 0.5;
    else if (dLng <= 3.5) lngStep = 1.0;
    else if (dLng <= 8.0) lngStep = 2.0;
    else lngStep = 4.0;

    let latStep = 1.0;
    if (dLat <= 1.8) latStep = 0.5;
    else if (dLat <= 3.5) latStep = 1.0;
    else if (dLat <= 8.0) latStep = 2.0;
    else latStep = 4.0;

    const startLng = Math.floor(bounds.minLng / lngStep) * lngStep;
    const endLng = Math.ceil(bounds.maxLng / lngStep) * lngStep;

    const startLat = Math.floor(bounds.minLat / latStep) * latStep;
    const endLat = Math.ceil(bounds.maxLat / latStep) * latStep;

    // Longitude lines (Meridians)
    for (let lng = startLng; lng <= endLng; lng += lngStep) {
        const top = projectGeo(lng, bounds.maxLat, bounds, width, height);
        const bottom = projectGeo(lng, bounds.minLat, bounds, width, height);

        // Format degree label
        const deg = Math.floor(Math.abs(lng));
        const min = Math.round((Math.abs(lng) - deg) * 60);
        const lbl = min > 0
            ? `${deg}°${min}'${lng >= 0 ? 'E' : 'W'}`
            : `${deg}°${lng >= 0 ? 'E' : 'W'}`;

        lines.push({
            path: `M ${top.x.toFixed(1)} ${top.y.toFixed(1)} L ${bottom.x.toFixed(1)} ${bottom.y.toFixed(1)}`,
            label: lbl,
            x: round2(bottom.x),
            y: round2(height - 14),
            type: 'meridian',
        });
    }

    // Latitude lines (Parallels)
    for (let lat = startLat; lat <= endLat; lat += latStep) {
        const left = projectGeo(bounds.minLng, lat, bounds, width, height);
        const right = projectGeo(bounds.maxLng, lat, bounds, width, height);

        const deg = Math.floor(Math.abs(lat));
        const min = Math.round((Math.abs(lat) - deg) * 60);
        const lbl = min > 0
            ? `${deg}°${min}'${lat >= 0 ? 'N' : 'S'}`
            : `${deg}°${lat >= 0 ? 'N' : 'S'}`;

        lines.push({
            path: `M ${left.x.toFixed(1)} ${left.y.toFixed(1)} L ${right.x.toFixed(1)} ${right.y.toFixed(1)}`,
            label: lbl,
            x: 28,
            y: round2(left.y + 4),
            type: 'parallel',
        });
    }

    return lines;
}
