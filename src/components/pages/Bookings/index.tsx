import BookingTable from "./BookingTable"
import { CalendarDays } from "lucide-react"

export default function BookingsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-foreground">
          <CalendarDays className="h-8 w-8 text-primary" />
          Bookings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage all incoming travel requests, approve bookings, and monitor payments.
        </p>
      </div>

      <BookingTable />
    </div>
  )
}
