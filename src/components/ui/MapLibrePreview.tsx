import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
// Prefer a local worker URL when running under Vite to avoid CORS to unpkg
// The `?url` suffix tells Vite to return an asset URL. TypeScript may not recognize it, so ignore the type error.
// @ts-ignore
import maplibreWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?url";

type Props = {
    latitude: number;
    longitude: number;
    zoom: number;
    className?: string;
    draggable?: boolean;
    onChange?: (lat: number, lng: number, zoom: number) => void;
};

export default function MapLibrePreview({ latitude, longitude, zoom, className, draggable = false, onChange, }: Props) {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const markerRef = useRef<maplibregl.Marker | null>(null);
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const [coords, setCoords] = useState({ lat: latitude ?? 0, lng: longitude ?? 0, zoom: zoom ?? 0 });

    function handleZoomIn() {
        const map = mapRef.current;
        if (!map) return;
        map.zoomIn();
        const center = map.getCenter();
        const z = map.getZoom();
        setCoords({ lat: center.lat, lng: center.lng, zoom: z });
        onChange?.(center.lat, center.lng, z);
    }

    function handleZoomOut() {
        const map = mapRef.current;
        if (!map) return;
        map.zoomOut();
        const center = map.getCenter();
        const z = map.getZoom();
        setCoords({ lat: center.lat, lng: center.lng, zoom: z });
        onChange?.(center.lat, center.lng, z);
    }

    function handleLocate() {
        const map = mapRef.current;
        if (!map) return;
        const lat = markerRef.current ? markerRef.current.getLngLat().lat : latitude;
        const lng = markerRef.current ? markerRef.current.getLngLat().lng : longitude;
        map.flyTo({ center: [lng || 0, lat || 0], zoom: Math.max(map.getZoom(), 8) });
        const z = map.getZoom();
        setCoords({ lat: lat ?? 0, lng: lng ?? 0, zoom: z });
        onChange?.(lat ?? 0, lng ?? 0, z);
    }

    useEffect(() => {
        if (typeof window === "undefined") return;

        if (!mapContainer.current) return;

        if (!mapRef.current) {
            // set worker url (prefer local Vite asset URL, fall back to CDN with a safe version)
            try {
                const hasGetWorkerUrl = typeof (maplibregl as any).getWorkerUrl === "function";
                const currentWorker = hasGetWorkerUrl ? (maplibregl as any).getWorkerUrl() : null;
                if (hasGetWorkerUrl && !currentWorker) {
                    if (typeof maplibreWorkerUrl === "string" && maplibreWorkerUrl.length) {
                        try {
                            (maplibregl as any).setWorkerUrl(maplibreWorkerUrl);
                        } catch (err) {
                            // fall through to CDN fallback
                        }
                    }

                    // fallback to CDN if Vite asset not available
                    if (!(maplibregl as any).getWorkerUrl()) {
                        const version = "6.6.0";
                        (maplibregl as any).setWorkerUrl(
                            `https://unpkg.com/maplibre-gl@${version}/dist/maplibre-gl-worker.mjs`
                        );
                    }
                }
            } catch (e) {
                // ignore failures to set worker URL
            }

            mapRef.current = new maplibregl.Map({
                container: mapContainer.current,
                style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
                center: [longitude || 0, latitude || 0],
                zoom: zoom ?? 6,
            });

            markerRef.current = new maplibregl.Marker({ draggable }).setLngLat([longitude || 0, latitude || 0]).addTo(mapRef.current);

            // marker drag end -> report new coords
            markerRef.current.on("dragend", () => {
                const lngLat = markerRef.current!.getLngLat();
                const currentZoom = mapRef.current!.getZoom();
                setCoords({ lat: lngLat.lat, lng: lngLat.lng, zoom: currentZoom });
                onChange?.(lngLat.lat, lngLat.lng, currentZoom);
            });

            // map move end -> report new zoom/center
            mapRef.current.on("moveend", () => {
                const center = mapRef.current!.getCenter();
                const currentZoom = mapRef.current!.getZoom();
                setCoords({ lat: center.lat, lng: center.lng, zoom: currentZoom });
                onChange?.(center.lat, center.lng, currentZoom);
            });
        }

        const map = mapRef.current;
        if (!map) return;

        // update view when props change
        map.jumpTo({ center: [longitude || 0, latitude || 0], zoom: zoom ?? 6 });

        // keep local coords in sync with props
        setCoords({ lat: latitude ?? 0, lng: longitude ?? 0, zoom: zoom ?? 0 });

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    // watch for prop changes and update marker/center
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;
        map.jumpTo({ center: [longitude || 0, latitude || 0], zoom: zoom ?? 6 });

        // update marker position and draggable
        if (!markerRef.current) {
            markerRef.current = new maplibregl.Marker({ draggable }).setLngLat([longitude || 0, latitude || 0]).addTo(map);
        } else {
            markerRef.current.setLngLat([longitude || 0, latitude || 0]);
            // @ts-ignore - maplibre types include setDraggable on Marker
            if (typeof (markerRef.current as any).setDraggable === "function") {
                try { (markerRef.current as any).setDraggable(draggable); } catch (e) { /* ignore */ }
            }
        }
    }, [latitude, longitude, zoom]);

    return (
        <div ref={wrapperRef} className={className ?? "w-full h-[300px] rounded-md overflow-hidden relative"}>
            <div ref={mapContainer} className="w-full h-full" />

            <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
                <button
                    type="button"
                    aria-label="Zoom in"
                    onClick={handleZoomIn}
                    className="bg-white/90 text-black rounded-md p-2 shadow"
                >
                    +
                </button>

                <button
                    type="button"
                    aria-label="Zoom out"
                    onClick={handleZoomOut}
                    className="bg-white/90 text-black rounded-md p-2 shadow"
                >
                    −
                </button>

                <button
                    type="button"
                    aria-label="Locate"
                    onClick={handleLocate}
                    className="bg-white/90 text-black rounded-md p-2 shadow"
                >
                    ⌖
                </button>
            </div>
            <div className="absolute left-3 bottom-3 z-20 bg-white/90 text-black rounded-md p-2 shadow text-xs">
                <div>Lat: {coords.lat.toFixed(5)}</div>
                <div>Lng: {coords.lng.toFixed(5)}</div>
                <div>Zoom: {coords.zoom.toFixed(2)}</div>
            </div>
        </div>
    );
}
