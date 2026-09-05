import { useParams } from "react-router-dom"
import { LocationForm } from "./LocationForm"

export function LocationEditPage() {
  const { slug } = useParams<{
    slug: string
  }>()

  if (!slug) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-muted-foreground">Location ID is missing</p>
      </div>
    )
  }

  return <LocationForm />
}
