import type { ReactElement } from "react"

import type {
  TextAreaFieldProps as SharedTextAreaFieldProps,
  TextFieldProps as SharedTextFieldProps,
} from "../../../shared/FormControls"
import type { FooterContent, FooterTheme } from "../../footerTypes"

export type FooterTextFieldRenderer = (
  props: SharedTextFieldProps
) => ReactElement

export type FooterTextAreaFieldRenderer = (
  props: SharedTextAreaFieldProps
) => ReactElement

export type FooterFormSectionContext = {
  theme: FooterTheme
  content: FooterContent
  updateTheme: (
    patch: Partial<FooterTheme>
  ) => void
  updateContent: (
    patch: Partial<FooterContent>
  ) => void
  TextField: FooterTextFieldRenderer
  TextAreaField: FooterTextAreaFieldRenderer
}

export type FooterFormSectionProps = {
  context: FooterFormSectionContext
}
