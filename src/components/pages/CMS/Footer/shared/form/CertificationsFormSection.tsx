import { DynamicStyledField } from "../../../shared/FormControls"
import { RepeaterList } from "../../../shared/RepeaterList"

import type { FooterCertification } from "../../footerTypes"
import type { FooterFormSectionProps } from "./sectionTypes"

export const CertificationsFormSection = ({
  context,
}: FooterFormSectionProps) => {
  const {
    content,
    updateContent,
    TextField,
  } = context

  const certifications = content.certifications ?? []

  return (
    <div className="rounded-lg border border-border/60 p-3">
      <p className="mb-3 text-xs font-semibold text-foreground">
        Certifications
      </p>

      <RepeaterList<FooterCertification>
        items={certifications}
        onChange={(newCertifications) =>
          updateContent({
            certifications:
              newCertifications,
          })
        }
        addLabel="Add certification"
        emptyLabel="No certifications."
        itemLabel={(item) =>
          item.name ||
          "Untitled certification"
        }
        newItem={() => ({
          name: "",
          image: "",
          url: "",
          alt: "",
        })}
        renderItem={(
          certification,
          updateCertification
        ) => (
          <div className="flex flex-col gap-3">
            <TextField
              label="Name"
              value={
                certification.name ??
                ""
              }
              onChange={(value) =>
                updateCertification({
                  ...certification,
                  name: value,
                })
              }
            />

            <DynamicStyledField
              type="image"
              label="Image"
              value={
                certification.image ??
                ""
              }
              fieldName="footerCertificationImage"
              onChange={(value) =>
                updateCertification({
                  ...certification,
                  image: value,
                })
              }
            />

            <TextField
              label="Alt text"
              value={
                certification.alt ??
                ""
              }
              onChange={(value) =>
                updateCertification({
                  ...certification,
                  alt: value,
                })
              }
            />

            <TextField
              label="URL"
              value={
                certification.url ??
                ""
              }
              onChange={(value) =>
                updateCertification({
                  ...certification,
                  url: value,
                })
              }
            />
          </div>
        )}
      />
    </div>
  )
}
