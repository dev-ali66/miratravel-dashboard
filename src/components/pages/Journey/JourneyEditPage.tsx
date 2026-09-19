import { useParams } from "react-router-dom"
import { JourneyForm } from "./JourneyForm"

export function JourneyEditPage() {
  const { slug } = useParams<{
    slug: string
  }>()

  if (!slug) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-muted-foreground">Journey ID or Slug is missing</p>
      </div>
    )
  }

  return <JourneyForm />
}
