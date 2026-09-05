import { ButtonsField } from "../../../shared/ButtonsField"
import type { CtaFormSectionProps } from "./sectionTypes"

export const CtaButtonsForm = ({ data, updateData }: CtaFormSectionProps) => (
  <ButtonsField
    value={data.buttons ?? []}
    onChange={(buttons) => updateData({ buttons })}
  />
)
