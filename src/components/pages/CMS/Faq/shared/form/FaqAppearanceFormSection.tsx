import { DynamicStyledField } from "../../../shared/FormControls"
import type { FaqSectionFormProps } from "./sectionTypes"

export const FaqAppearanceFormSection = ({
  styles,
  updateFaqStyles,
}: FaqSectionFormProps) => (
  <div className="flex flex-col gap-3">
    <DynamicStyledField
      type="color"
      label="Item Background"
      value={styles.faq.itemBackgroundColor}
      onChange={(value) => updateFaqStyles({ itemBackgroundColor: value })}
    />
    <DynamicStyledField
      type="color"
      label="Item Border"
      value={styles.faq.itemBorderColor}
      onChange={(value) => updateFaqStyles({ itemBorderColor: value })}
    />
    <DynamicStyledField
      type="color"
      label="Question Color"
      value={styles.faq.questionColor}
      onChange={(value) => updateFaqStyles({ questionColor: value })}
    />
    <DynamicStyledField
      type="color"
      label="Open Item Background"
      value={styles.faq.openBackgroundColor}
      onChange={(value) => updateFaqStyles({ openBackgroundColor: value })}
    />
    <DynamicStyledField
      type="color"
      label="Open Question Color"
      value={styles.faq.openQuestionColor}
      onChange={(value) => updateFaqStyles({ openQuestionColor: value })}
    />
    <DynamicStyledField
      type="color"
      label="Open Answer Color"
      value={styles.faq.openAnswerColor}
      onChange={(value) => updateFaqStyles({ openAnswerColor: value })}
    />
  </div>
)
