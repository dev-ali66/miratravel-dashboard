import { DynamicStyledField } from "../../../shared/FormControls"
import { RepeaterList } from "../../../shared/RepeaterList"
import type { FooterCertification } from "../../footerTypes"
import type { FooterFormSectionProps } from "./sectionTypes"

export const CertificationsFormSection = ({
  context,
}: FooterFormSectionProps) => {
  const { content, updateContent } = context
  const certifications = content.certifications ?? []

  return (
    <div className="space-y-6">
      <RepeaterList<FooterCertification>
        items={certifications}
        onChange={(newCertifications) => updateContent({ certifications: newCertifications })}
        addLabel="Add Certification / Badge"
        emptyLabel="No certifications added."
        itemLabel={(item) => item.name || "Untitled Certification"}
        newItem={() => ({
          name: "",
          image: "",
          url: "",
          alt: "",
        })}
        renderItem={(certification, updateCertification) => (
          <div className="space-y-4 p-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DynamicStyledField
                label="Certification Name"
                type="text"
                value={certification.name ?? ""}
                onChange={(val) =>
                  updateCertification({
                    ...certification,
                    name: typeof val === "object" ? val.value : val,
                  })
                }
              />

              <DynamicStyledField
                label="URL"
                type="text"
                value={certification.url ?? ""}
                onChange={(val) =>
                  updateCertification({
                    ...certification,
                    url: typeof val === "object" ? val.value : val,
                  })
                }
              />
            </div>

            <DynamicStyledField
              type="image"
              label="Badge / Logo Image"
              value={certification.image ?? ""}
              fieldName="footerCertificationImage"
              onChange={(val) =>
                updateCertification({
                  ...certification,
                  image: typeof val === "object" ? val.url || val.value || val : val,
                })
              }
            />

            <DynamicStyledField
              label="Alt Text"
              type="text"
              value={certification.alt ?? ""}
              onChange={(val) =>
                updateCertification({
                  ...certification,
                  alt: typeof val === "object" ? val.value : val,
                })
              }
            />
          </div>
        )}
      />
    </div>
  )
}

