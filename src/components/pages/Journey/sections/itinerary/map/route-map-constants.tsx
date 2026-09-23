/* -------------------------------------------------------------------------- */
/*  Route Map Icons, Palette & Sea Labels                                     */
/*  Shared constants extracted from journey-route-map for reuse & readability  */
/* -------------------------------------------------------------------------- */



/* -------------------------------------------------------------------------- */
/*  Inline SVG Icons                                                          */
/* -------------------------------------------------------------------------- */

export function MapPinIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 11 14"
            fill="currentColor"
            className={className}
            aria-hidden="true"
        >
            <path d="M5.33333 6.66667C5.7 6.66667 6.01389 6.53611 6.275 6.275C6.53611 6.01389 6.66667 5.7 6.66667 5.33333C6.66667 4.96667 6.53611 4.65278 6.275 4.39167C6.01389 4.13056 5.7 4 5.33333 4C4.96667 4 4.65278 4.13056 4.39167 4.39167C4.13056 4.65278 4 4.96667 4 5.33333C4 5.7 4.13056 6.01389 4.39167 6.275C4.65278 6.53611 4.96667 6.66667 5.33333 6.66667ZM5.33333 11.5667C6.68889 10.3222 7.69444 9.19167 8.35 8.175C9.00556 7.15833 9.33333 6.25556 9.33333 5.46667C9.33333 4.25556 8.94722 3.26389 8.175 2.49167C7.40278 1.71944 6.45556 1.33333 5.33333 1.33333C4.21111 1.33333 3.26389 1.71944 2.49167 2.49167C1.71944 3.26389 1.33333 4.25556 1.33333 5.46667C1.33333 6.25556 1.66111 7.15833 2.31667 8.175C2.97222 9.19167 3.97778 10.3222 5.33333 11.5667ZM5.33333 13.3333C3.54444 11.8111 2.20833 10.3972 1.325 9.09167C0.441667 7.78611 0 6.57778 0 5.46667C0 3.8 0.536111 2.47222 1.60833 1.48333C2.68056 0.494444 3.92222 0 5.33333 0C6.74444 0 7.98611 0.494444 9.05833 1.48333C10.1306 2.47222 10.6667 3.8 10.6667 5.46667C10.6667 6.57778 10.225 7.78611 9.34167 9.09167C8.45833 10.3972 7.12222 11.8111 5.33333 13.3333Z" />
        </svg>
    );
}

export function PlusIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <path d="M8 3.5V12.5M3.5 8H12.5" />
        </svg>
    );
}

export function MinusIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <path d="M3.5 8H12.5" />
        </svg>
    );
}

export function ResetIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <path d="M2.5 2.5V6H6" />
            <path d="M3.05 10A5.5 5.5 0 1 0 4.5 4.5L2.5 6" />
        </svg>
    );
}

export function PlayIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 16 16"
            fill="currentColor"
            className={className}
            aria-hidden="true"
        >
            <polygon points="5 3.5 13 8 5 12.5" />
        </svg>
    );
}

export function PauseIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 16 16"
            fill="currentColor"
            className={className}
            aria-hidden="true"
        >
            <rect x="4" y="3" width="2.8" height="10" rx="1" />
            <rect x="9.2" y="3" width="2.8" height="10" rx="1" />
        </svg>
    );
}

export function NavigationIcon({ className, width = 8, height = 8 }: { className?: string; width?: number | string; height?: number | string }) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 16 16"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <polygon points="8,2 13.5,13.5 8,10.5 2.5,13.5" />
        </svg>
    );
}

export function FlagIcon({ className, width = 8, height = 8 }: { className?: string; width?: number | string; height?: number | string }) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 16 16"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <path d="M3.5 14.5V2M3.5 2.5H12.5L10 6L12.5 9.5H3.5" />
        </svg>
    );
}

export function ChevronRightIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <path d="M6 12L10 8L6 4" />
        </svg>
    );
}

export function ChevronDownIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <polyline points="4 6 8 10 12 6" />
        </svg>
    );
}

/* -------------------------------------------------------------------------- */
/*  MIRA Design System Palette Constants (Strictly Cosmetic Visual System)   */
/* -------------------------------------------------------------------------- */
export const MIRA_COLORS = {
    primary: '#182D09',           // --color-primary (Signature Deep Forest Green)
    secondary: '#235347',         // --color-secondary (Deep Pine Teal)
    secondaryMuted: '#2B3424',    // --color-secondary-muted (Balkan Typography & Topography)
    accent: '#af6348',            // --color-accent
    accentLight: '#b85c38',       // --color-accent-light
    accentMuted: '#B86B3A',       // --color-accent-muted
    seaCanvas: '#FFF8F2',         // --color-surface-light (Luminous Editorial Ivory Sea)
    landFill: '#F1EEE5',          // --color-secondary-background (Warm Balkan Landmass)
    coastStroke: '#D8CBB8',       // --color-border-light (Refined Naturalistic Coastline)
    gridLine: '#D8CBB8',          // --color-border-light (Subtle Coordinate Grid)
    gridText: '#8A8070',          // --color-extra-light (Cartographic Longitude/Latitude)
    labelSea: '#8A8070',          // --color-extra-light (Marine Region Italic Labels)
    labelLand: '#2B3424',         // --color-secondary-muted (Terrestrial Regional Serif Typography)
    leaderLine: '#B09C80',        // --color-border-accent-muted (Offset Leader Line Ticks)
    pillBg: '#FFF8F2',            // --color-surface-light (Collision-Free Stop Pill Base)
    pillBorder: '#D8CBB8',        // --color-border-light
    pillBorderActive: '#af6348',  // --color-accent (Active Highlight Border)
    white: '#FFFFFF',             // --color-neutral-100
} as const;

/* -------------------------------------------------------------------------- */
/*  Sea Label Coordinates for Cartographic Typography                         */
/* -------------------------------------------------------------------------- */
export const SEA_LABELS = [
    { name: 'ADRIATIC SEA', lng: 16.5, lat: 42.4, angle: -42 },
    { name: 'IONIAN SEA', lng: 18.8, lat: 38.6, angle: -25 },
    { name: 'TYRRHENIAN SEA', lng: 12.8, lat: 40.2, angle: -10 },
    { name: 'AEGEAN SEA', lng: 24.8, lat: 38.6, angle: 0 },
    { name: 'MEDITERRANEAN SEA', lng: 14.5, lat: 36.2, angle: 0 },
    { name: 'GULF OF TONKIN', lng: 107.5, lat: 19.5, angle: -15 },
];
