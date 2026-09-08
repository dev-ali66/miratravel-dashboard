import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import {
  Eye,
  Search,
  CheckCircle2,
  Clock,
  DollarSign,
  Layers,
  Download,
  Filter,
  CreditCard,
  Ban,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Pagination from "@/components/pages/UserList/Pagination"
import {
  useGetBookings,
  type BookingItem,
  type BookingStatus,
  type PaymentStatus,
} from "@/hooks/booking/useBookings"
import BookingDetailsSheet from "./BookingDetailsSheet"
import { ApproveBookingModal } from "./ApproveBookingModal"
import { RecordPaymentModal } from "./RecordPaymentModal"

export default function BookingTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null)
  const [approveBookingItem, setApproveBookingItem] = useState<BookingItem | null>(null)
  const [paymentBookingItem, setPaymentBookingItem] = useState<BookingItem | null>(null)

  // Filters
  const [searchInput, setSearchInput] = useState("")
  const [selectedBookingStatus, setSelectedBookingStatus] = useState<string>("ALL")
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>("ALL")

  const limit = 10
  const { data, isLoading, isError } = useGetBookings({
    page: currentPage,
    limit,
    search: searchInput.trim() || undefined,
    bookingStatus: selectedBookingStatus !== "ALL" ? selectedBookingStatus : undefined,
    paymentStatus: selectedPaymentStatus !== "ALL" ? selectedPaymentStatus : undefined,
  })

  const bookings = data?.data || []
  const totalPages = data?.meta?.totalPages || 1
  const totalCount = data?.meta?.total || bookings.length

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

  // Status Colors
  const getBookingStatusColor = (status: BookingStatus) => {
    switch (status) {
      case "APPROVED":
      case "CONFIRMED":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
      case "REQUEST_SUBMITTED":
      case "UNDER_REVIEW":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
      case "AWAITING_DEPOSIT":
      case "DEPOSIT_PAID_TENTATIVE":
      case "AWAITING_FINAL_PAYMENT":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
      case "FULLY_PAID":
        return "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20"
      case "CANCELLED":
      case "REJECTED":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
      default:
        return "bg-muted/40 text-muted-foreground border-border/50"
    }
  }

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case "UNPAID":
      case "FAILED":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
      case "PARTIALLY_PAID":
      case "DEPOSIT_PAID":
      case "BALANCE_DUE":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
      case "FULLY_PAID":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
      case "REFUNDED":
      case "PARTIALLY_REFUNDED":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
      default:
        return "bg-muted/40 text-muted-foreground border-border/50"
    }
  }

  const formatStatusLabel = (status: string) => {
    return status.replace(/_/g, " ")
  }

  // Summary Metrics
  const metrics = useMemo(() => {
    const pendingCount = bookings.filter(
      (b) => b.bookingStatus === "REQUEST_SUBMITTED" || b.bookingStatus === "UNDER_REVIEW"
    ).length
    const confirmedCount = bookings.filter(
      (b) => b.bookingStatus === "CONFIRMED" || b.bookingStatus === "FULLY_PAID"
    ).length
    const totalCollected = bookings.reduce((sum, b) => sum + (Number(b.paidAmount) || 0), 0)
    const totalOutstanding = bookings.reduce((sum, b) => sum + (Number(b.outstandingAmount) || 0), 0)

    return {
      total: totalCount,
      pending: pendingCount,
      confirmed: confirmedCount,
      collected: totalCollected,
      outstanding: totalOutstanding,
    }
  }, [bookings, totalCount])

  // CSV Export Handler
  const handleExportCSV = () => {
    if (bookings.length === 0) return
    const headers = [
      "Booking Number",
      "Traveler Name",
      "Email",
      "Arrival Date",
      "Departure Date",
      "Confirmed Total",
      "Currency",
      "Paid Amount",
      "Outstanding Amount",
      "Booking Status",
      "Payment Status",
    ]
    const rows = bookings.map((b) => [
      b.bookingNumber,
      `"${b.travelerFirstName} ${b.travelerLastName}"`,
      b.travelerEmail,
      b.travelArrivalDate,
      b.travelDepartureDate,
      b.confirmedTotal || 0,
      b.currency,
      b.paidAmount,
      b.outstandingAmount,
      b.bookingStatus,
      b.paymentStatus,
    ])

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `mira_bookings_export_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top KPI Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border/60 bg-background/50 p-4 backdrop-blur-xl shadow-xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Bookings
            </span>
            <span className="text-2xl font-bold font-mono text-foreground mt-1">
              {metrics.total}
            </span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Layers className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 backdrop-blur-xl shadow-xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
              Pending Review
            </span>
            <span className="text-2xl font-bold font-mono text-blue-700 dark:text-blue-300 mt-1">
              {metrics.pending}
            </span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 backdrop-blur-xl shadow-xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
              Confirmed Trips
            </span>
            <span className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-300 mt-1">
              {metrics.confirmed}
            </span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 backdrop-blur-xl shadow-xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
              Collected / Outstanding
            </span>
            <div className="text-sm font-bold font-mono text-amber-700 dark:text-amber-300 mt-1">
              €{metrics.collected.toLocaleString()} / <span className="opacity-70">€{metrics.outstanding.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background/50 p-4 backdrop-blur-xl">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value)
              setCurrentPage(1)
            }}
            placeholder="Search booking #, traveler name, email..."
            className="w-full rounded-xl border border-border bg-background/80 pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* Status Dropdowns & Export */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={selectedBookingStatus}
              onChange={(e) => {
                setSelectedBookingStatus(e.target.value)
                setCurrentPage(1)
              }}
              className="rounded-xl border border-border bg-background/80 px-3 py-2 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
            >
              <option value="ALL">All Booking Statuses</option>
              <option value="REQUEST_SUBMITTED">Request Submitted</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="APPROVED">Approved</option>
              <option value="AWAITING_DEPOSIT">Awaiting Deposit</option>
              <option value="DEPOSIT_PAID_TENTATIVE">Deposit Paid (Tentative)</option>
              <option value="AWAITING_FINAL_PAYMENT">Awaiting Final Payment</option>
              <option value="FULLY_PAID">Fully Paid</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <select
            value={selectedPaymentStatus}
            onChange={(e) => {
              setSelectedPaymentStatus(e.target.value)
              setCurrentPage(1)
            }}
            className="rounded-xl border border-border bg-background/80 px-3 py-2 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
          >
            <option value="ALL">All Payment Statuses</option>
            <option value="UNPAID">Unpaid</option>
            <option value="DEPOSIT_PAID">Deposit Paid</option>
            <option value="PARTIALLY_PAID">Partially Paid</option>
            <option value="BALANCE_DUE">Balance Due</option>
            <option value="FULLY_PAID">Fully Paid</option>
            <option value="REFUNDED">Refunded</option>
          </select>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-border bg-background/80 px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
            title="Export CSV"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Booking Table Container */}
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
                    <th className="px-6 py-4 font-semibold tracking-wider">Total Value</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Booking Status</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Payment Status</th>
                    <th className="px-6 py-4 text-right font-semibold tracking-wider">Actions</th>
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
                      <td className="px-6 py-4 text-right">
                        <div className="h-8 w-8 animate-pulse rounded-md bg-muted/60 ml-auto" />
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
            <Ban className="h-8 w-8 opacity-40" />
            <p>No bookings found matching current filters.</p>
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
                    <th className="px-6 py-4 font-semibold tracking-wider">Confirmed Total</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Booking Status</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Payment Status</th>
                    <th className="px-6 py-4 text-right font-semibold tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking, idx) => {
                    const isPreApproval =
                      booking.bookingStatus === "REQUEST_SUBMITTED" ||
                      booking.bookingStatus === "UNDER_REVIEW"

                    return (
                      <motion.tr
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04, duration: 0.25 }}
                        key={booking.id}
                        className="group border-b border-border/40 transition-colors last:border-0 hover:bg-muted/30"
                      >
                        <td className="px-6 py-4 font-mono text-xs font-semibold text-primary">
                          <button
                            type="button"
                            onClick={() => setSelectedBooking(booking)}
                            className="cursor-pointer hover:underline text-left"
                          >
                            {booking.bookingNumber}
                          </button>
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
                            <span className="text-foreground">{formatDate(booking.travelArrivalDate)}</span>
                            <span className="text-xs opacity-70">
                              to {formatDate(booking.travelDepartureDate)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold font-mono">
                          {booking.confirmedTotal ? (
                            <>
                              {booking.currency} {Number(booking.confirmedTotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </>
                          ) : (
                            <span className="text-muted-foreground italic text-xs font-normal">Pending Offer</span>
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
                          <div className="inline-flex items-center gap-1">
                            {/* Quick Action: Approve */}
                            {isPreApproval && (
                              <button
                                type="button"
                                onClick={() => setApproveBookingItem(booking)}
                                className="cursor-pointer rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-500/10 transition-colors"
                                title="Approve & Send Payment Offer"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </button>
                            )}

                            {/* Quick Action: Record Payment */}
                            {!isPreApproval &&
                              booking.bookingStatus !== "CANCELLED" &&
                              booking.bookingStatus !== "REJECTED" && (
                                <button
                                  type="button"
                                  onClick={() => setPaymentBookingItem(booking)}
                                  className="cursor-pointer rounded-lg p-1.5 text-primary hover:bg-primary/10 transition-colors"
                                  title="Record Manual Payment"
                                >
                                  <CreditCard className="h-4 w-4" />
                                </button>
                              )}

                            {/* View Full Details */}
                            <button
                              type="button"
                              onClick={() => setSelectedBooking(booking)}
                              className="cursor-pointer rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                              title="View Full Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
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

      {/* Main Details Sheet */}
      <BookingDetailsSheet
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />

      {/* Quick Approval Modal from Table Action */}
      <ApproveBookingModal
        booking={approveBookingItem}
        isOpen={!!approveBookingItem}
        onClose={() => setApproveBookingItem(null)}
      />

      {/* Quick Record Payment Modal from Table Action */}
      <RecordPaymentModal
        booking={paymentBookingItem}
        isOpen={!!paymentBookingItem}
        onClose={() => setPaymentBookingItem(null)}
      />
    </div>
  )
}
