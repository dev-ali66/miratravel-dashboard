import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useMe } from "@/hooks/auth/useMe"

export function PrivateRoute() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
  const { data: user, isLoading } = useMe()
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-4 border-border border-t-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
