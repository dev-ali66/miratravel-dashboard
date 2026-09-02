import axios, { AxiosError } from "axios"
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
  (config) => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Global response interceptor for error handling
const handleErrorResponse = (error: AxiosError) => {
  const message =
    (error.response?.data as { message?: string })?.message ||
    error.message ||
    "An unexpected error occurred"

  toast.error(message)

  if (error.response?.status === 401) {
    // Optionally handle 401 unauthorized here (e.g., clear token, redirect to login)
    localStorage.removeItem("accessToken")
    window.dispatchEvent(new Event("unauthorized"))
  }

  return Promise.reject(error)
}

apiPublic.interceptors.response.use((response) => response, handleErrorResponse)
apiPrivate.interceptors.response.use((response) => response, handleErrorResponse)
