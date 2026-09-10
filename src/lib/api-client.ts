import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios"
import { toast } from "sonner"

const BASE_URL =
  import.meta.env.VITE_API_URL || "https://api.get-surf.com/api/v1"

export const apiPublic = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
})

export const apiPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
})

// Intercept requests to attach the access token
apiPrivate.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Concurrency queue for handling multiple requests during token refresh
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: any) => void
  reject: (reason?: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

const handleForceLogout = () => {
  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")
  localStorage.removeItem("sessionInfo")
  window.dispatchEvent(new Event("unauthorized"))
  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.replace("/login")
  }
}

// Public API response interceptor
apiPublic.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const message =
      (error.response?.data as { message?: string })?.message ||
      error.message ||
      "An unexpected error occurred"

    toast.error(message)
    return Promise.reject(error)
  }
)

// Private API response interceptor with automatic token refresh and login redirect
apiPrivate.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & {
      _retry?: boolean
    }) | undefined

    if (!error.response || !originalRequest) {
      return Promise.reject(error)
    }

    // Handle 401 Unauthorized
    if (error.response.status === 401) {
      // Don't attempt to refresh if already retried or if calling refresh endpoint
      if (
        originalRequest._retry ||
        originalRequest.url?.includes("/auth/refresh-token")
      ) {
        handleForceLogout()
        return Promise.reject(error)
      }

      const refreshToken = localStorage.getItem("refreshToken")

      // If no refresh token exists, immediately redirect to login
      if (!refreshToken) {
        handleForceLogout()
        return Promise.reject(error)
      }

      if (isRefreshing) {
        // Queue parallel requests while token is refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return apiPrivate(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const response = await apiPublic.post("/auth/refresh-token", {
          refreshToken,
        })

        const newAccessToken =
          response.data?.data?.accessToken || response.data?.accessToken
        const newRefreshToken =
          response.data?.data?.refreshToken || response.data?.refreshToken
        const sessionData =
          response.data?.data?.session || response.data?.session

        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken)
        }
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken)
        }
        if (sessionData) {
          localStorage.setItem("sessionInfo", JSON.stringify(sessionData))
        }

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        processQueue(null, newAccessToken)

        return apiPrivate(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        handleForceLogout()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // For non-401 errors, show toast notification
    const message =
      (error.response?.data as { message?: string })?.message ||
      error.message ||
      "An unexpected error occurred"

    toast.error(message)
    return Promise.reject(error)
  }
)
