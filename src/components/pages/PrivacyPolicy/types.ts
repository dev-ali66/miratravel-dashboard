import {
  createDefaultHeroMultimedia,
  createDefaultPrivacyHero,
  normalizeLegalHero,
  type LegalHeroData,
} from "@/components/pages/CMS/shared/legalHeroDefaults"

export type { LegalHeroData }
export { createDefaultHeroMultimedia, createDefaultPrivacyHero, normalizeLegalHero }

export type PolicyItem = {
  id: string
  tabTitle: string
  fullTitle: string
  content: string
}

export const DEFAULT_ITEMS: PolicyItem[] = []
