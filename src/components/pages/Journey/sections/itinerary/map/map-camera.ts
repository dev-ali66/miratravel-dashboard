export const CANVAS_WIDTH = 1200;
export const CANVAS_HEIGHT = 760;

export const CAMERA_MARGIN_X = 40;
export const CAMERA_MARGIN_Y = 35;
export const CAMERA_PAD_TOP = 36;
export const CAMERA_PAD_BOTTOM = 36;
export const CAMERA_PAD_RIGHT = 42;
export const CAMERA_MIN_ZOOM = 0.6;
export const CAMERA_MAX_ZOOM = 3.8;

export interface RouteBounds {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    width: number;
    height: number;
    centerX: number;
    centerY: number;
}

export interface ContainerDimensions {
    width: number;
    height: number;
}

export interface BaseCamera {
    baseX: number;
    baseY: number;
    baseW: number;
    baseH: number;
    sidebarFraction: number;
    topInsetFraction: number;
}

export interface CameraState {
    x: number;
    y: number;
    zoom: number;
    viewW: number;
    viewH: number;
}

export function unprojectGeo(
    x: number,
    y: number,
    bounds: any,
    width = CANVAS_WIDTH,
    height = CANVAS_HEIGHT
): { lng: number; lat: number } {
    const u = x / width;
    const v = 1 - y / height;
    const lng = bounds.minLng + u * (bounds.maxLng - bounds.minLng);
    const minLatRad = (bounds.minLat * Math.PI) / 180;
    const maxLatRad = (bounds.maxLat * Math.PI) / 180;
    const minMercN = Math.log(Math.tan(Math.PI / 4 + minLatRad / 2));
    const maxMercN = Math.log(Math.tan(Math.PI / 4 + maxLatRad / 2));
    const mercN = minMercN + v * (maxMercN - minMercN);
    const latRad = 2 * Math.atan(Math.exp(mercN)) - Math.PI / 2;
    const lat = (latRad * 180) / Math.PI;
    return { lng, lat };
}

export function calculateRouteBounds(
    projectedStops: any[],
    labelLayouts: any[]
): RouteBounds {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (let i = 0; i < projectedStops.length; i++) {
        const pt = projectedStops[i];
        if (!pt || !isFinite(pt.x) || !isFinite(pt.y)) continue;
        minX = Math.min(minX, pt.x - 22);
        maxX = Math.max(maxX, pt.x + 22);
        minY = Math.min(minY, pt.y - 22);
        maxY = Math.max(maxY, pt.y + 22);

        const layout = labelLayouts[i];
        if (layout && isFinite(layout.pillX) && isFinite(layout.pillY)) {
            minX = Math.min(minX, layout.pillX - 6);
            maxX = Math.max(maxX, layout.pillX + layout.pillWidth + 6);
            minY = Math.min(minY, layout.pillY - 6);
            maxY = Math.max(maxY, layout.pillY + layout.pillHeight + 6);
        }
    }

    if (!isFinite(minX)) {
        return {
            minX: 0,
            maxX: CANVAS_WIDTH,
            minY: 0,
            maxY: CANVAS_HEIGHT,
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            centerX: CANVAS_WIDTH / 2,
            centerY: CANVAS_HEIGHT / 2,
        };
    }

    const width = Math.max(maxX - minX, 120);
    const height = Math.max(maxY - minY, 120);

    return {
        minX,
        maxX,
        minY,
        maxY,
        width,
        height,
        centerX: (minX + maxX) / 2,
        centerY: (minY + maxY) / 2,
    };
}

export function calculateBaseCamera(
    routeBounds: RouteBounds,
    container: ContainerDimensions,
    measuredSidebarWidth = 230,
    measuredPillHeight = 40
): BaseCamera {
    const contW = container.width;
    const contH = container.height;
    const aspect = Math.max(0.2, contW / Math.max(1, contH));
    const isMobile = contW < 640;
    const isDesktop = contW >= 768;
    const sidebarOffset = isDesktop ? 20 : 12;
    const totalSidebarCoverage = measuredSidebarWidth + sidebarOffset;
    const sidebarFraction = isMobile ? 0 : Math.min(totalSidebarCoverage / Math.max(1, contW), 0.55);
    const topInsetFraction = isMobile ? Math.min((measuredPillHeight + 12) / Math.max(1, contH), 0.35) : 0;

    const reqW = (routeBounds.width + CAMERA_PAD_RIGHT + 20) / Math.max(0.1, 1 - sidebarFraction);
    const reqH = (routeBounds.height + CAMERA_PAD_TOP + CAMERA_PAD_BOTTOM) / Math.max(0.1, 1 - topInsetFraction);

    let baseW: number;
    let baseH: number;

    if (reqW / reqH > aspect) {
        baseW = reqW;
        baseH = reqW / aspect;
    } else {
        baseH = reqH;
        baseW = reqH * aspect;
    }

    const baseX = routeBounds.centerX - ((1 + sidebarFraction) / 2) * baseW;
    const baseY = routeBounds.centerY - ((1 + topInsetFraction) / 2) * baseH;

    return {
        baseX,
        baseY,
        baseW,
        baseH,
        sidebarFraction,
        topInsetFraction,
    };
}

export function clampCamera(
    x: number,
    y: number,
    z: number,
    baseCamera: BaseCamera
): CameraState {
    const clampedZoom = Math.max(CAMERA_MIN_ZOOM, Math.min(CAMERA_MAX_ZOOM, z));
    const curW = baseCamera.baseW / clampedZoom;
    const curH = baseCamera.baseH / clampedZoom;

    const minX = baseCamera.baseX - CAMERA_MARGIN_X;
    const maxX = baseCamera.baseX + baseCamera.baseW + CAMERA_MARGIN_X - curW;
    const minY = baseCamera.baseY - CAMERA_MARGIN_Y;
    const maxY = baseCamera.baseY + baseCamera.baseH + CAMERA_MARGIN_Y - curH;

    let clampedX: number;
    if (minX > maxX) {
        const centerX = baseCamera.baseX + (baseCamera.baseW - curW) / 2;
        clampedX = Math.max(centerX - CAMERA_MARGIN_X, Math.min(centerX + CAMERA_MARGIN_X, x));
    } else {
        clampedX = Math.max(minX, Math.min(maxX, x));
    }

    let clampedY: number;
    if (minY > maxY) {
        const centerY = baseCamera.baseY + (baseCamera.baseH - curH) / 2;
        clampedY = Math.max(centerY - CAMERA_MARGIN_Y, Math.min(centerY + CAMERA_MARGIN_Y, y));
    } else {
        clampedY = Math.max(minY, Math.min(maxY, y));
    }

    return {
        x: clampedX,
        y: clampedY,
        zoom: clampedZoom,
        viewW: curW,
        viewH: curH,
    };
}

export function calculateVisibleGeoRect(
    baseCamera: BaseCamera,
    bounds: any
): any {
    const minCanvasX = baseCamera.baseX - CAMERA_MARGIN_X;
    const maxCanvasX = baseCamera.baseX + baseCamera.baseW + CAMERA_MARGIN_X;
    const minCanvasY = baseCamera.baseY - CAMERA_MARGIN_Y;
    const maxCanvasY = baseCamera.baseY + baseCamera.baseH + CAMERA_MARGIN_Y;

    const topLeft = unprojectGeo(minCanvasX, minCanvasY, bounds, CANVAS_WIDTH, CANVAS_HEIGHT);
    const bottomRight = unprojectGeo(maxCanvasX, maxCanvasY, bounds, CANVAS_WIDTH, CANVAS_HEIGHT);

    return {
        minLng: Math.min(topLeft.lng, bottomRight.lng),
        maxLng: Math.max(topLeft.lng, bottomRight.lng),
        minLat: Math.min(topLeft.lat, bottomRight.lat),
        maxLat: Math.max(topLeft.lat, bottomRight.lat),
    };
}
