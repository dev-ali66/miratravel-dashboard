import { useState, useMemo, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Eye,
  CheckCircle2,
  Clock,
  DollarSign,
  Layers,
  CreditCard,
  Ban,
  CalendarDays,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Pagination } from "@/components/shared/Pagination"
import { useListingPagination } from "@/hooks/ui/useListingPagination"
import { PageHeader, CompactStatCard } from "@/components/shared/PageHeader"
import {
  FilterToolbar,
  FilterGroup,
  FilterSearch,
  FilterSelect,
  FilterActions,
  FilterExportButton,
  FilterResetButton,
} from "@/components/shared/FilterToolbar"
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
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null)
  const [approveBookingItem, setApproveBookingItem] = useState<BookingItem | null>(null)
  const [paymentBookingItem, setPaymentBookingItem] = useState<BookingItem | null>(null)

  // Filters
  const [searchInput, setSearchInput] = useState("")
  const [selectedBookingStatus, setSelectedBookingStatus] = useState<string>("ALL")
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>("ALL")

  const filterKey = `${searchInput}-${selectedBookingStatus}-${selectedPaymentStatus}`

  const {
    mode,
    currentPage,
    setCurrentPage,
    setTargetItems,
    effectiveLimit,
    pageSizeOptions,
    displayItems: bookings,
    hasMore,
    isLoadingMore,
    handleLoadMore,
    setIncomingData,
  } = useListingPagination<BookingItem>({
    mode: "infinite",
    initialTargetItems: 10,
    isGrid: false,
    filterKey,
    keyExtractor: (b) => b.id,
  })

  const { data, isLoading, isFetching, isError, refetch } = useGetBookings({
    page: currentPage,
    limit: effectiveLimit,
    search: searchInput.trim() || undefined,
    bookingStatus: selectedBookingStatus !== "ALL" ? selectedBookingStatus : undefined,
    paymentStatus: selectedPaymentStatus !== "ALL" ? selectedPaymentStatus : undefined,
  })

  useEffect(() => {
    if (data) {
      setIncomingData(data.data, data.meta?.total)
    }
  }, [data, setIncomingData])

  const totalPages = data?.meta?.totalPages || 1
  const totalCount = data?.meta?.total || bookings.length

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
    <div className="w-full space-y-6 pt-2">
      {/* Universal Page Header with 30% title & 70% compact statistics */}
      <PageHeader
        icon={CalendarDays}
        title="Bookings Management"
        subtitle="Manage incoming travel requests, approve bookings, and monitor payments."
        stats={
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full">
            <CompactStatCard
              label="Total Bookings"
              value={metrics.total}
              subtext="All incoming trips"
              icon={Layers}
              iconColor="text-primary"
            />
            <CompactStatCard
              label="Pending Review"
              value={metrics.pending}
              subtext="Awaiting review"
              icon={Clock}
              iconColor="text-blue-500"
            />
            <CompactStatCard
              label="Confirmed"
              value={metrics.confirmed}
              subtext="Approved departures"
              icon={CheckCircle2}
              iconColor="text-emerald-500"
            />
            <CompactStatCard
              label="Financials"
              value={`€${metrics.collected.toLocaleString()}`}
              subtext={`€${metrics.outstanding.toLocaleString()} due`}
              icon={DollarSign}
              iconColor="text-amber-500"
            />
          </div>
        }
      />

      {/* Filter & Search Toolbar */}
      <FilterToolbar>
        <FilterGroup>
          {/* Search expands to take all remaining space on the left */}
          <FilterSearch
            value={searchInput}
            onChange={(val) => {
              setSearchInput(val)
              setCurrentPage(1)
            }}
            placeholder="Search booking #, traveler, email..."
            width="w-full flex-1 min-w-[200px]"
          />
        </FilterGroup>

        <FilterActions>
          {/* Booking Status Dropdown */}
          <FilterSelect
            value={selectedBookingStatus}
            onChange={(val) => {
              setSelectedBookingStatus(val)
              setCurrentPage(1)
            }}
            options={[
              { label: "Request Submitted", value: "REQUEST_SUBMITTED" },
              { label: "Under Review", value: "UNDER_REVIEW" },
              { label: "Approved", value: "APPROVED" },
              { label: "Awaiting Deposit", value: "AWAITING_DEPOSIT" },
              { label: "Deposit Paid (Tentative)", value: "DEPOSIT_PAID_TENTATIVE" },
              { label: "Awaiting Final Payment", value: "AWAITING_FINAL_PAYMENT" },
              { label: "Fully Paid", value: "FULLY_PAID" },
              { label: "Confirmed", value: "CONFIRMED" },
              { label: "Cancelled", value: "CANCELLED" },
              { label: "Rejected", value: "REJECTED" },
            ]}
            allLabel="All Booking Statuses"
            allValue="ALL"
            placeholder="Booking Status"
            width="min-w-[135px] max-w-[170px]"
          />

          {/* Payment Status Dropdown */}
          <FilterSelect
            value={selectedPaymentStatus}
            onChange={(val) => {
              setSelectedPaymentStatus(val)
              setCurrentPage(1)
            }}
            options={[
              { label: "Unpaid", value: "UNPAID" },
              { label: "Deposit Paid", value: "DEPOSIT_PAID" },
              { label: "Partially Paid", value: "PARTIALLY_PAID" },
              { label: "Balance Due", value: "BALANCE_DUE" },
              { label: "Fully Paid", value: "FULLY_PAID" },
              { label: "Refunded", value: "REFUNDED" },
            ]}
            allLabel="All Payment Statuses"
            allValue="ALL"
            placeholder="Payment Status"
            width="min-w-[130px] max-w-[160px]"
          />

          {/* Borderless Segmented Export CSV Button */}
          <FilterExportButton onClick={handleExportCSV} label="Export CSV" />

          {/* Universal Far-Right Refresh Button */}
          <FilterResetButton
            onClick={() => {
              setSearchInput("")
              setSelectedBookingStatus("ALL")
              setSelectedPaymentStatus("ALL")
              setCurrentPage(1)
              refetch?.()
            }}
            title="Refresh & Reset"
          />
        </FilterActions>
      </FilterToolbar>

      {/* Canonical Table Container */}
      <div className="overflow-hidden rounded-md border border-border/60 bg-card/60 shadow-xs backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse whitespace-nowrap">
            <thead className="border-b border-border/60 bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground select-none">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Booking ID</th>
                <th className="px-5 py-3.5 font-semibold">Traveler</th>
                <th className="px-5 py-3.5 font-semibold">Dates</th>
                <th className="px-5 py-3.5 font-semibold">Confirmed Total</th>
                <th className="px-5 py-3.5 font-semibold">Booking Status</th>
                <th className="px-5 py-3.5 font-semibold">Payment Status</th>
                <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-foreground">
              {isLoading && currentPage === 1 && bookings.length === 0 ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-3.5"><div className="h-4 w-24 rounded bg-muted/60" /></td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col gap-1.5">
                        <div className="h-4 w-32 rounded bg-muted/60" />
                        <div className="h-3 w-40 rounded bg-muted/40" />
                      </div>
                    </td>
                    <td className="px-5 py-3.5"><div className="h-4 w-28 rounded bg-muted/60" /></td>
                    <td className="px-5 py-3.5"><div className="h-4 w-16 rounded bg-muted/60" /></td>
                    <td className="px-5 py-3.5"><div className="h-6 w-24 rounded-full bg-muted/60" /></td>
                    <td className="px-5 py-3.5"><div className="h-6 w-24 rounded-full bg-muted/60" /></td>
                    <td className="px-5 py-3.5 text-right"><div className="h-8 w-8 rounded-sm bg-muted/60 ml-auto" /></td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-rose-500">
                    Failed to load bookings.
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Ban className="h-8 w-8 text-muted-foreground/40" />
                      <p className="text-sm font-medium text-foreground">No bookings found</p>
                      <p className="text-xs text-muted-foreground">No bookings found matching current filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <>
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
                        className="group transition-colors hover:bg-muted/30"
                      >
                        <td className="px-5 py-3.5 font-mono text-xs font-semibold text-primary">
                          <button
                            type="button"
                            onClick={() => setSelectedBooking(booking)}
                            className="cursor-pointer hover:underline text-left"
                          >
                            {booking.bookingNumber}
                          </button>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex flex-col">
                            <span className="font-medium text-sm text-foreground">
                              {booking.travelerFirstName} {booking.travelerLastName}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {booking.travelerEmail}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground">
                          <div className="flex flex-col">
                            <span className="text-foreground text-sm">{formatDate(booking.travelArrivalDate)}</span>
                            <span className="text-xs opacity-70">
                              to {formatDate(booking.travelDepartureDate)}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-semibold font-mono text-sm">
                          {booking.confirmedTotal ? (
                            <>
                              {booking.currency} {Number(booking.confirmedTotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </>
                          ) : (
                            <span className="text-muted-foreground italic text-xs font-normal">Pending Offer</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider",
                              getBookingStatusColor(booking.bookingStatus)
                            )}
                          >
                            {formatStatusLabel(booking.bookingStatus)}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider",
                              getPaymentStatusColor(booking.paymentStatus)
                            )}
                          >
                            {formatStatusLabel(booking.paymentStatus)}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
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
                              className="cursor-pointer rounded-sm p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                              title="View Full Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}

                  {/* Subtle inline skeleton row during background fetch */}
                  {Boolean(isLoadingMore || (isFetching && currentPage > 1)) && (
                    <tr className="animate-pulse bg-muted/20 border-b border-border/40">
                      <td className="px-5 py-3.5"><div className="h-4 w-20 rounded bg-muted/60" /></td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-col gap-1.5">
                          <div className="h-4 w-28 rounded bg-muted/60" />
                          <div className="h-3 w-36 rounded bg-muted/40" />
                        </div>
                      </td>
                      <td className="px-5 py-3.5"><div className="h-4 w-24 rounded bg-muted/60" /></td>
                      <td className="px-5 py-3.5"><div className="h-4 w-16 rounded bg-muted/60" /></td>
                      <td className="px-5 py-3.5"><div className="h-6 w-20 rounded-full bg-muted/60" /></td>
                      <td className="px-5 py-3.5"><div className="h-6 w-20 rounded-full bg-muted/60" /></td>
                      <td className="px-5 py-3.5 text-right"><div className="h-8 w-8 rounded-sm bg-muted/60 ml-auto" /></td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Universal Pagination */}
      {totalCount > 0 && (
        <Pagination
          mode={mode}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={data?.meta?.total ?? totalCount}
          pageSize={effectiveLimit}
          pageSizeOptions={pageSizeOptions}
          onPageChange={setCurrentPage}
          onPageSizeChange={setTargetItems}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore || (isFetching && currentPage > 1)}
          onLoadMore={handleLoadMore}
          loadedCount={bookings.length}
          fixed={false}
          isTable
        />
      )}

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
