import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useMe } from "@/hooks/auth/useMe"

export function PublicRoute() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
  const { data: user } = useMe()
  const location = useLocation()

  // Already logged in → redirect to dashboard or the page they tried to visit
  if (token && user) {
    const from = location.state?.from?.pathname || "/"
    return <Navigate to={from} replace />
  }

  return <Outlet />
}
