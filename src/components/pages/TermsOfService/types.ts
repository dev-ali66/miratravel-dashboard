import {
  createDefaultHeroMultimedia,
  createDefaultTermsHero,
  normalizeLegalHero,
  type LegalHeroData,
} from "@/components/pages/CMS/shared/legalHeroDefaults"

export type { LegalHeroData }
export { createDefaultHeroMultimedia, createDefaultTermsHero, normalizeLegalHero }

export type TermsItem = {
  id: string
  tabTitle: string
  fullTitle: string
  content: string
}

export const DEFAULT_TERMS_ITEMS: TermsItem[] = []
