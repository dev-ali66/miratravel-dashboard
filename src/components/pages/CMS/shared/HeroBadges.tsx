import React from "react"

export interface MiraCollectionBadgeProps {
  text?: string
  className?: string
  style?: React.CSSProperties
}

/**
 * MiraCollectionBadge
 * 1:1 replica of frontend's MiraCollectionBadge (cream pill with 8-pointed star icon)
 */
export function MiraCollectionBadge({
  text = "THE MIRA COLLECTION",
  className = "",
  style,
}: MiraCollectionBadgeProps) {
  return (
    <div
      className={`inline-flex items-center justify-center gap-2 md:gap-2.5 bg-[#F4EBE4] select-none px-2.5 md:px-3 lgx:px-3.5 xl:px-4 h-[26px] md:h-[28px] lgx:h-[30px] xl:h-[32px] w-auto min-w-fit shrink-0 ${className}`}
      style={{ backgroundColor: "#F4EBE4", ...style }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="11.906"
        height="21.987"
        viewBox="0 0 12 22"
        fill="none"
        className="w-[10px] h-[18px] md:w-[11.906px] md:h-[21.987px] shrink-0"
        aria-hidden="true"
      >
        <path
          d="M6.68997 10.9935L5.95436 21.9871L5.2168 10.9935L5.95436 0L6.68997 10.9935Z"
          fill="#8D6534"
        />
        <path
          d="M5.95311 11.731L0 10.9951L5.95311 10.2578L11.9062 10.9951L5.95311 11.731Z"
          fill="#8D6534"
        />
        <path
          d="M6.64439 10.9925L8.78611 8.16016L5.9525 10.3009L3.11914 8.16016L5.26087 10.9925L3.11914 13.8271L5.9525 11.6847L8.78611 13.8271L6.64439 10.9925Z"
          fill="#8D6534"
        />
      </svg>
      <span
        style={{
          color: "#1B2117",
          fontFamily: 'var(--font-karena), "Karena Serif", Georgia, serif',
        }}
        className="font-normal uppercase tracking-[1.5px] md:tracking-[2px] whitespace-nowrap text-[11px] md:text-[12px] xl:text-[13.333px]"
      >
        {text}
      </span>
    </div>
  )
}

export interface WishlistHeartButtonProps {
  className?: string
  isLiked?: boolean
  onClick?: () => void
}

/**
 * WishlistHeartButton
 * 1:1 replica of frontend's WishlistHeartButton (circular heart button)
 */
export function WishlistHeartButton({
  className = "",
  isLiked = false,
  onClick,
}: WishlistHeartButtonProps) {
  return (
    <div
      onClick={onClick}
      className={`inline-flex size-9 xlg:size-10 xl:size-10 items-center justify-center rounded-full bg-neutral-100/95 backdrop-blur-xs border border-neutral-200/80 transition-all duration-200 shadow-[0_1px_2px_0px_rgba(0,0,0,0.05)] cursor-pointer hover:border-heart/40 hover:bg-neutral-100 select-none ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={isLiked ? "#FF3347" : "none"}
        stroke={isLiked ? "#FF3347" : "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`size-4 md:size-4.5 xlg:size-5 xl:size-5 transition-colors shrink-0 ${
          isLiked ? "text-[#FF3347]" : "text-neutral-500 hover:text-[#FF3347]"
        }`}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </div>
  )
}

export interface TagBadgePillProps {
  label: string
  className?: string
}

/**
 * TagBadgePill
 * 1:1 replica of frontend's TagBadge pill (rounded-full cream with outline in accent)
 */
export function TagBadgePill({ label, className = "" }: TagBadgePillProps) {
  return (
    <div
      className={`h-6 px-3.5 py-1.5 rounded-full outline bg-neutral-100/90 outline-accent flex justify-center items-center gap-2 shrink-0 select-none ${className}`}
    >
      <span className="text-accent text-[11px] md:text-[12px] xl:text-[13px] font-normal leading-3 md:leading-3.5 xl:leading-4 inline-flex items-center uppercase tracking-wider">
        {label}
      </span>
    </div>
  )
}
