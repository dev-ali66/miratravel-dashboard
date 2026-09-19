import { useEffect, useRef, useState } from 'react';

const EXACT_VIDEO_PATH = '/videos/loading-animation.mp4';
const MAX_FALLBACK_TIMEOUT_MS = 4000; // Safeguard: max 4 seconds before dismissing
const MIN_DISPLAY_TIME_MS = 1600;     // Minimum display time for a smooth, premium visual experience
const FADE_DURATION_MS = 500;         // 500ms smooth fade-out transition

export default function PageLoader() {
  const [isMounted, setIsMounted] = useState(true);
  const [isFading, setIsFading] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const pageReadyRef = useRef(false);
  const minTimeReachedRef = useRef(false);
  const dismissedRef = useRef(false);
  const startTimeRef = useRef<number>(0);
  const prefersReducedMotionRef = useRef(false);
  const triggerDismissRef = useRef<() => void>(() => { });

  useEffect(() => {
    startTimeRef.current = Date.now();

    prefersReducedMotionRef.current =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    // Lock background scroll during loading animation
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Single source of truth for dismissing the loader.
    const triggerDismiss = () => {
      if (dismissedRef.current) return;
      dismissedRef.current = true;

      setIsFading(true);

      setTimeout(() => {
        setIsMounted(false);
        document.body.style.overflow = previousOverflow;
      }, FADE_DURATION_MS);
    };

    triggerDismissRef.current = triggerDismiss;

    // Called once the page itself is ready (window load, or autoplay failure fallback).
    const handlePageReady = () => {
      if (pageReadyRef.current) return; // guard against double-invocation
      pageReadyRef.current = true;

      const elapsed = Date.now() - startTimeRef.current;
      const remainingMinTime = Math.max(0, MIN_DISPLAY_TIME_MS - elapsed);

      setTimeout(() => {
        minTimeReachedRef.current = true;
        // If the video already finished (or reduced-motion skipped it),
        // this is what actually closes the loader once min-time passes.
        triggerDismiss();
      }, remainingMinTime);
    };

    // Reduced motion: skip the animation, just respect min display time then dismiss.
    if (prefersReducedMotionRef.current) {
      handlePageReady();
    } else if (document.readyState === 'complete') {
      // Page already loaded (e.g. hydration or cached).
      handlePageReady();
    } else {
      window.addEventListener('load', handlePageReady, { once: true });
    }

    const fallbackTimer = setTimeout(() => {
      triggerDismiss();
    }, MAX_FALLBACK_TIMEOUT_MS);

    if (!prefersReducedMotionRef.current && videoRef.current) {
      videoRef.current.play().catch(() => {
        window.removeEventListener('load', handlePageReady);
        handlePageReady();
      });
    }

    return () => {
      clearTimeout(fallbackTimer);
      window.removeEventListener('load', handlePageReady);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleVideoEnded = () => {
    if (!pageReadyRef.current && videoRef.current) {
      // Page is taking longer than the video's duration: loop replay.
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => { });
      return;
    }

    if (pageReadyRef.current && minTimeReachedRef.current) {
      triggerDismissRef.current();
    }
  };

  const handleVideoError = () => {
    triggerDismissRef.current();
  };

  if (!isMounted) return null;

  return (
    <div
      role="status"
      aria-label="Loading page"
      aria-live="polite"
      className={`fixed inset-0 z-[999999] flex items-center justify-center bg-[#F2E9E3] select-none transition-opacity duration-500 ease-out ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <span className="sr-only">Loading page…</span>
      <div className="relative flex items-center justify-center w-full max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl px-6 aspect-video">
        <video
          ref={videoRef}
          src={EXACT_VIDEO_PATH}
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={handleVideoEnded}
          onError={handleVideoError}
          className="w-full h-full object-contain pointer-events-none"
        />
      </div>
    </div>
  );
}
