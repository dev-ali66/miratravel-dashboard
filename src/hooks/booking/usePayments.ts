import { useQuery } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"

export type ScheduleItemCalcType = "PERCENTAGE" | "FIXED" | "REMAINDER"
export type ScheduleItemDueRule =
  | "IMMEDIATE_AFTER_APPROVAL"
  | "DAYS_BEFORE_DEPARTURE"
  | "FIXED_DATE"
  | "MANUAL"
export type ScheduleItemStatus =
  | "SCHEDULED"
  | "DUE"
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "WAIVED"
  | "REFUNDED"

export interface PaymentScheduleItem {
  id: string
  scheduleId: string
  sequence: number
  label: string
  calculationType: ScheduleItemCalcType
  ruleValue: string | null
  dueRule: ScheduleItemDueRule
  dueValue: number | null
  dueDate: string | null
  calculatedAmount: string
  paidAmount: string
  status: ScheduleItemStatus
  createdAt: string
  updatedAt: string
}

export interface PaymentSchedule {
  id: string
  bookingId: string
  templateType: string
  totalScheduledAmount: string
  status: "ACTIVE" | "SUPERSEDED" | "CANCELLED"
  overrideReason: string | null
  createdAt: string
  items?: PaymentScheduleItem[]
}

export function useGetPaymentSchedules(bookingId?: string) {
  return useQuery({
    queryKey: ["payment-schedules", bookingId],
    queryFn: async () => {
      const res = await apiPrivate.get<{ data: PaymentSchedule[] }>(
        "/payment-schedules",
        {
          params: { bookingId },
        }
      )
      return res.data.data
    },
    enabled: !!bookingId,
  })
}

export type PaymentRecordStatus =
  | "SUCCEEDED"
  | "FAILED"
  | "PENDING"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED"

export interface PaymentRecord {
  id: string
  bookingId: string
  scheduleItemId: string | null
  paymentDate: string
  amount: string
  currency: string
  method: string | null
  pspTransactionRef: string | null
  status: PaymentRecordStatus
  refundAmount: string
  adminNotes: string | null
  createdAt: string
}

export function useGetPaymentRecords(bookingId?: string) {
  return useQuery({
    queryKey: ["payment-records", bookingId],
    queryFn: async () => {
      const res = await apiPrivate.get<{ data: PaymentRecord[] }>(
        "/payment-records",
        {
          params: { bookingId },
        }
      )
      return res.data.data
    },
    enabled: !!bookingId,
  })
}
