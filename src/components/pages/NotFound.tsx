import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"

export function NotFoundPage() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="font-medium text-9xl">404</h1>
        <p className="text-lg text-muted-foreground">Page not found</p>
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  )
}
