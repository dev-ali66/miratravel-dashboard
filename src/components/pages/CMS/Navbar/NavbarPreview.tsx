import { useCmsDraft } from "../shared/CmsDraftContext"

import {
  navbarSectionOrder,
  navbarSectionRegistry,
} from "./config/navbarSections"
import type { NavbarPageData } from "./navbarTypes"
import type { NavbarPreviewSectionContext } from "./shared/preview/sectionTypes"

export const NavbarPreview = () => {
  const page = useCmsDraft<NavbarPageData>()

  if (!page) {
    return (
      <div className="flex h-16 items-center justify-center border-b border-border/60">
        <span className="text-xs text-muted-foreground">Loading navbar...</span>
      </div>
    )
  }

  const { theme, content } = page.data
  const sectionContext: NavbarPreviewSectionContext = {
    theme,
    content,
  }

  return (
    <header
      className="flex items-center justify-between border-b px-6 py-4 shadow-sm"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
      }}
    >
      {navbarSectionOrder.map((key) => {
        const PreviewSection = navbarSectionRegistry[key].preview

        return <PreviewSection key={key} context={sectionContext} />
      })}
    </header>
  )
}
