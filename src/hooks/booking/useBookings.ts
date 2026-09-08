import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"
import { toast } from "sonner"

export type BookingStatus =
  | "REQUEST_SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "AWAITING_DEPOSIT"
  | "DEPOSIT_PAID_TENTATIVE"
  | "AWAITING_FINAL_PAYMENT"
  | "FULLY_PAID"
  | "CONFIRMED"
  | "CANCELLED"
  | "REJECTED"

export type PaymentStatus =
  | "UNPAID"
  | "PARTIALLY_PAID"
  | "DEPOSIT_PAID"
  | "BALANCE_DUE"
  | "FULLY_PAID"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED"

export type TravelerType = "COUPLE" | "SOLO" | "FAMILY" | "FRIENDS" | "GROUP"

export interface BookingItem {
  id: string
  bookingNumber: string
  journeyId: string
  journey?: {
    id: string
    title: string
    price?: number | string
  }
  createdBy: string
  travelerFirstName: string
  travelerLastName: string
  travelerEmail: string
  travelerPhone?: string | null
  travelerNationality?: string | null
  travelArrivalDate: string
  travelDepartureDate: string
  adults: number
  children: number
  travelerType?: TravelerType
  travelerMessage?: string | null
  confirmedTotal?: string | null
  currency: string
  paidAmount: string
  outstandingAmount: string
  bookingStatus: BookingStatus
  paymentStatus: PaymentStatus
  createdAt: string
  updatedAt: string
}

export type GetBookingsResponse = {
  success: boolean
  message: string
  code: number
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  data: BookingItem[]
}

export interface GetBookingsParams {
  page?: number
  limit?: number
  search?: string
  bookingStatus?: string
  paymentStatus?: string
  departureFrom?: string
  departureTo?: string
}

export function useGetBookings(params: GetBookingsParams = {}) {
  const { page = 1, limit = 10, search, bookingStatus, paymentStatus, departureFrom, departureTo } = params

  return useQuery({
    queryKey: ["bookings", page, limit, search, bookingStatus, paymentStatus, departureFrom, departureTo],
    queryFn: async () => {
      const queryParams: Record<string, any> = { page, limit }
      if (search) queryParams.search = search
      if (bookingStatus && bookingStatus !== "ALL") queryParams.bookingStatus = bookingStatus
      if (paymentStatus && paymentStatus !== "ALL") queryParams.paymentStatus = paymentStatus
      if (departureFrom) queryParams.departureFrom = departureFrom
      if (departureTo) queryParams.departureTo = departureTo

      const res = await apiPrivate.get<GetBookingsResponse>("/bookings", {
        params: queryParams,
      })
      return res.data
    },
  })
}

export interface ApproveBookingPayload {
  id: string
  data?: {
    confirmedTotal?: number
    currency?: string
    scheduleOverride?: {
      overrideReason: string
      items: Array<{
        label: string
        calculationType: "PERCENTAGE" | "FIXED" | "REMAINDER"
        ruleValue?: number
        dueRule: "IMMEDIATE_AFTER_APPROVAL" | "DAYS_BEFORE_DEPARTURE" | "FIXED_DATE" | "MANUAL"
        dueValue?: number
        fixedDate?: string | Date
      }>
    }
  }
}

// Action: Approve
export function useApproveBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: ApproveBookingPayload) => {
      const res = await apiPrivate.post(`/bookings/${id}/approve`, data || {})
      return res.data
    },
    onSuccess: () => {
      toast.success("Booking approved and payment schedule generated successfully")
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
      queryClient.invalidateQueries({ queryKey: ["payment-schedules"] })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to approve booking")
    },
  })
}

// Action: Reject
export function useRejectBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const res = await apiPrivate.post(`/bookings/${id}/reject`, { reason })
      return res.data
    },
    onSuccess: () => {
      toast.success("Booking request rejected")
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
      queryClient.invalidateQueries({ queryKey: ["payment-schedules"] })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to reject booking")
    },
  })
}

// Action: Cancel
export function useCancelBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const res = await apiPrivate.post(`/bookings/${id}/cancel`, { reason })
      return res.data
    },
    onSuccess: () => {
      toast.success("Booking cancelled")
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
      queryClient.invalidateQueries({ queryKey: ["payment-schedules"] })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to cancel booking")
    },
  })
}

// Action: Revise Total
export function useReviseBookingTotal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, newConfirmedTotal, reason }: { id: string; newConfirmedTotal: number; reason: string }) => {
      const res = await apiPrivate.post(`/bookings/${id}/revise-total`, { newConfirmedTotal, reason })
      return res.data
    },
    onSuccess: () => {
      toast.success("Booking total revised and schedule recalculated")
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
      queryClient.invalidateQueries({ queryKey: ["payment-schedules"] })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to revise booking total")
    },
  })
}
