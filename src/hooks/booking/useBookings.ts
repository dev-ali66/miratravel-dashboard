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
  // For the frontend table, it's very likely the backend includes some journey details if expanded
  journey?: {
    id: string
    title: string
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

export function useGetBookings(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ["bookings", page, limit],
    queryFn: async () => {
      const res = await apiPrivate.get<GetBookingsResponse>("/bookings", {
        params: { page, limit },
      })
      return res.data
    },
  })
}

// Action: Approve
export function useApproveBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiPrivate.post(`/bookings/${id}/approve`)
      return res.data
    },
    onSuccess: () => {
      toast.success("Booking approved successfully")
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
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
    mutationFn: async (id: string) => {
      const res = await apiPrivate.post(`/bookings/${id}/reject`)
      return res.data
    },
    onSuccess: () => {
      toast.success("Booking rejected successfully")
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
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
    mutationFn: async (id: string) => {
      const res = await apiPrivate.post(`/bookings/${id}/cancel`)
      return res.data
    },
    onSuccess: () => {
      toast.success("Booking cancelled successfully")
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to cancel booking")
    },
  })
}
