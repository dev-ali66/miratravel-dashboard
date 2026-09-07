import { useState } from "react"
import { motion } from "framer-motion"
import { Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import Pagination from "@/components/pages/UserList/Pagination"
import {
  useGetBookings,
  type BookingItem,
  type BookingStatus,
  type PaymentStatus,
} from "@/hooks/booking/useBookings"
import BookingDetailsSheet from "./BookingDetailsSheet"

export default function BookingTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null)
  
  const limit = 10
  const { data, isLoading, isError } = useGetBookings(currentPage, limit)

  const bookings = data?.data || []
  const totalPages = data?.meta?.totalPages || 1

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—"
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getBookingStatusColor = (status: BookingStatus) => {
    switch (status) {
      case "APPROVED":
      case "CONFIRMED":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      case "REQUEST_SUBMITTED":
      case "UNDER_REVIEW":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "AWAITING_DEPOSIT":
      case "DEPOSIT_PAID_TENTATIVE":
      case "AWAITING_FINAL_PAYMENT":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "FULLY_PAID":
        return "bg-teal-500/10 text-teal-500 border-teal-500/20"
      case "CANCELLED":
      case "REJECTED":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20"
      default:
        return "bg-muted/40 text-muted-foreground border-border/50"
    }
  }

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case "UNPAID":
      case "FAILED":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20"
      case "PARTIALLY_PAID":
      case "DEPOSIT_PAID":
      case "BALANCE_DUE":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "FULLY_PAID":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      case "REFUNDED":
      case "PARTIALLY_REFUNDED":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      default:
        return "bg-muted/40 text-muted-foreground border-border/50"
    }
  }

  const formatStatusLabel = (status: string) => {
    return status.replace(/_/g, " ")
  }

  return (
    <>
      <div className="min-h-[400px] overflow-hidden rounded-2xl border border-border/60 bg-background/50 backdrop-blur-xl">
        {/* Loading State */}
        {isLoading ? (
          <div className="w-full">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border/60 bg-muted/40 text-xs text-muted-foreground uppercase">
                  <tr>
                    <th className="px-6 py-4 font-semibold tracking-wider">Booking ID</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Traveler</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Dates</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Total</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Booking Status</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Payment Status</th>
                    <th className="px-6 py-4 text-right font-semibold tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="border-b border-border/40">
                      <td className="px-6 py-4">
                        <div className="h-4 w-24 animate-pulse rounded bg-muted/60" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <div className="h-4 w-32 animate-pulse rounded bg-muted/60" />
                          <div className="h-3 w-40 animate-pulse rounded bg-muted/40" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 w-28 animate-pulse rounded bg-muted/60" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 w-16 animate-pulse rounded bg-muted/60" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 w-24 animate-pulse rounded-full bg-muted/60" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 w-24 animate-pulse rounded-full bg-muted/60" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          <div className="h-8 w-8 animate-pulse rounded-md bg-muted/60" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : isError ? (
          <div className="flex h-64 items-center justify-center text-rose-500">
            Failed to load bookings.
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3 text-muted-foreground">
            <p>No bookings found.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full overflow-hidden text-left text-sm whitespace-nowrap">
                <thead className="border-b border-border/60 bg-muted/40 text-xs text-muted-foreground uppercase">
                  <tr>
                    <th className="px-6 py-4 font-semibold tracking-wider">Booking ID</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Traveler</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Dates</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Total</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Booking Status</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Payment Status</th>
                    <th className="px-6 py-4 text-right font-semibold tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking, idx) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.3 }}
                      key={booking.id}
                      className="group border-b border-border/40 transition-colors last:border-0 hover:bg-muted/30"
                    >
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-primary">
                        {booking.bookingNumber}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {booking.travelerFirstName} {booking.travelerLastName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {booking.travelerEmail}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        <div className="flex flex-col">
                          <span>{formatDate(booking.travelArrivalDate)}</span>
                          <span className="text-xs opacity-70">
                            to {formatDate(booking.travelDepartureDate)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        {booking.confirmedTotal ? (
                          <>
                            {booking.currency} {booking.confirmedTotal}
                          </>
                        ) : (
                          <span className="text-muted-foreground italic text-xs font-normal">Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                            getBookingStatusColor(booking.bookingStatus)
                          )}
                        >
                          {formatStatusLabel(booking.bookingStatus)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                            getPaymentStatusColor(booking.paymentStatus)
                          )}
                        >
                          {formatStatusLabel(booking.paymentStatus)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedBooking(booking)}
                          className="cursor-pointer rounded-lg p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary opacity-0 group-hover:opacity-100"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {totalPages > 1 && (
              <div className="border-t border-border/60 bg-background/50 p-5 backdrop-blur-xl">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>

      <BookingDetailsSheet
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </>
  )
}
