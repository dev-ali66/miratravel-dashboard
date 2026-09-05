import { RepeaterList } from "../../../shared/RepeaterList"
import { DynamicStyledField } from "../../../shared/FormControls"
import type { FaqItem } from "../../faqTypes"
import type { FaqSectionFormProps } from "./sectionTypes"

export const QuestionsFormSection = ({
  data,
  updateData,
}: FaqSectionFormProps) => (
  <RepeaterList<FaqItem>
    items={data.items ?? []}
    onChange={(items) =>
      updateData({
        items: items.map((item, index) => ({ ...item, order: index + 1 })),
      })
    }
    addLabel="Add question"
    emptyLabel="No questions added."
    itemLabel={(item) => item.question || "Untitled question"}
    newItem={() => ({
      id: `faq-${Date.now()}`,
      order: (data.items?.length ?? 0) + 1,
      question: "",
      answer: "",
      isOpenByDefault: false,
    })}
    renderItem={(item, update) => (
      <div className="flex flex-col gap-2.5">
        <DynamicStyledField
          type="text"
          label="Question"
          value={item.question}
          onChange={(value) => update({ ...item, question: value })}
        />
        <DynamicStyledField
          type="textarea"
          label="Answer"
          value={item.answer}
          onChange={(value) => update({ ...item, answer: value })}
        />
        <DynamicStyledField
          type="switch"
          label="Open by default"
          checked={item.isOpenByDefault}
          onChange={(checked) => update({ ...item, isOpenByDefault: checked })}
        />
      </div>
    )}
  />
)
