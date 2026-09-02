import { useCmsDraft } from "../shared/CmsDraftContext"
import type { NavbarPageData } from "./navbarTypes"

export const NavbarPreview = () => {
  const page = useCmsDraft<NavbarPageData>()

  if (!page) {
    return (
      <div className="flex h-16 items-center justify-center border-b border-border/60">
        <span className="text-xs text-muted-foreground">
          Loading navbar...
        </span>
      </div>
    )
  }

  const { theme, content } = page.data
  const { brand } = content

  return (
    <header
      className="flex items-center justify-between border-b px-6 py-4 shadow-sm"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
      }}
    >
      {/* Brand */}
      <a
        href={brand.url || "#"}
        className="flex items-center gap-3"
        style={{ color: theme.textColor }}
      >
        {brand.logo ? (
          <img
            src={brand.logo}
            alt={brand.alt}
            className="h-8 w-auto object-contain"
          />
        ) : (
          <span className="text-sm font-bold tracking-wide">
            {brand.name}
          </span>
        )}

        {!brand.logo && brand.name ? null : (
          <span className="text-sm font-semibold">
            {brand.name}
          </span>
        )}
      </a>

      {/* Theme Preview */}
      <div className="flex items-center gap-3">
        <span
          className="rounded-full px-3 py-1 text-[11px] font-medium"
          style={{
            color: theme.textColor,
            border: `1px solid ${theme.textColor}`,
          }}
        >
          Text
        </span>

        <span
          className="rounded-full px-3 py-1 text-[11px] font-semibold"
          style={{
            backgroundColor: theme.activeColor,
            color: theme.backgroundColor === "transparent"
              ? "#FFFFFF"
              : theme.backgroundColor,
          }}
        >
          Active
        </span>
      </div>
    </header>
  )
}