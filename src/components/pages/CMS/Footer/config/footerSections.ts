import type { ComponentType } from "react"

import { BottomFormSection } from "../shared/form/BottomFormSection"
import { BrandFormSection } from "../shared/form/BrandFormSection"
import { CertificationsFormSection } from "../shared/form/CertificationsFormSection"
import { ContactFormSection } from "../shared/form/ContactFormSection"
import { FooterAppearanceFormSection } from "../shared/form/FooterAppearanceFormSection"
import { LinkColumnsFormSection } from "../shared/form/LinkColumnsFormSection"
import { NewsletterFormSection } from "../shared/form/NewsletterFormSection"
import { SocialAppearanceFormSection } from "../shared/form/SocialAppearanceFormSection"
import { SocialLinksFormSection } from "../shared/form/SocialLinksFormSection"
import type { FooterFormSectionProps } from "../shared/form/sectionTypes"
import { FooterBackgroundImagePreviewSection } from "../shared/preview/FooterBackgroundImagePreviewSection"
import { FooterBackgroundOverlayPreviewSection } from "../shared/preview/FooterBackgroundOverlayPreviewSection"
import { FooterCopyrightPreviewSection } from "../shared/preview/FooterCopyrightPreviewSection"
import { FooterNewsletterCertificationsPreviewSection } from "../shared/preview/FooterNewsletterCertificationsPreviewSection"
import { FooterTopPreviewSection } from "../shared/preview/FooterTopPreviewSection"
import type { FooterPreviewSectionProps } from "../shared/preview/sectionTypes"

export type FooterFormSectionKey =
  | "footer_appearance"
  | "social_appearance"
  | "brand"
  | "link_columns"
  | "contact"
  | "social_links"
  | "newsletter"
  | "certifications"
  | "bottom"

export type FooterPreviewSectionKey =
  | "background_image"
  | "background_overlay"
  | "top"
  | "newsletter_certifications"
  | "copyright"

type FooterFormSectionRegistryEntry = {
  label: string
  form: ComponentType<FooterFormSectionProps>
}

type FooterPreviewSectionRegistryEntry = {
  label: string
  placement: "outer" | "inner"
  preview: ComponentType<FooterPreviewSectionProps>
}

export const footerFormSectionRegistry: Record<
  FooterFormSectionKey,
  FooterFormSectionRegistryEntry
> = {
  footer_appearance: {
    label: "Footer Appearance",
    form: FooterAppearanceFormSection,
  },
  social_appearance: {
    label: "Social Appearance",
    form: SocialAppearanceFormSection,
  },
  brand: {
    label: "Brand",
    form: BrandFormSection,
  },
  link_columns: {
    label: "Link Columns",
    form: LinkColumnsFormSection,
  },
  contact: {
    label: "Contact",
    form: ContactFormSection,
  },
  social_links: {
    label: "Social Links",
    form: SocialLinksFormSection,
  },
  newsletter: {
    label: "Newsletter",
    form: NewsletterFormSection,
  },
  certifications: {
    label: "Certifications",
    form: CertificationsFormSection,
  },
  bottom: {
    label: "Bottom / Copyright",
    form: BottomFormSection,
  },
}

export const footerPreviewSectionRegistry: Record<
  FooterPreviewSectionKey,
  FooterPreviewSectionRegistryEntry
> = {
  background_image: {
    label: "Background Image",
    placement: "outer",
    preview:
      FooterBackgroundImagePreviewSection,
  },
  background_overlay: {
    label: "Background Overlay",
    placement: "outer",
    preview:
      FooterBackgroundOverlayPreviewSection,
  },
  top: {
    label: "Top",
    placement: "inner",
    preview: FooterTopPreviewSection,
  },
  newsletter_certifications: {
    label: "Newsletter + Certifications",
    placement: "inner",
    preview:
      FooterNewsletterCertificationsPreviewSection,
  },
  copyright: {
    label: "Copyright",
    placement: "inner",
    preview: FooterCopyrightPreviewSection,
  },
}

export const footerFormSectionOrder: FooterFormSectionKey[] = [
  "footer_appearance",
  "social_appearance",
  "brand",
  "link_columns",
  "contact",
  "social_links",
  "newsletter",
  "certifications",
  "bottom",
]

export const footerPreviewSectionOrder: FooterPreviewSectionKey[] = [
  "background_image",
  "background_overlay",
  "top",
  "newsletter_certifications",
  "copyright",
]
