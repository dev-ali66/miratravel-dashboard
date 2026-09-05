import type { NavbarPreviewSectionProps } from "./sectionTypes"

export const ThemePreviewSection = ({ context }: NavbarPreviewSectionProps) => {
  const { theme } = context

  return (
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
          color:
            theme.backgroundColor === "transparent"
              ? "#FFFFFF"
              : theme.backgroundColor,
        }}
      >
        Active
      </span>
    </div>
  )
}
