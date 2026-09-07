# Booking Module Walkthrough

The **Booking Module** has been fully implemented according to the approved plan. This module handles all customer travel requests, providing admins with the tools to review, approve, cancel, and monitor the financial status of bookings.

## 1. What was built

### Booking List (Data Table)
- A complete paginated table displaying all bookings.
- Shows important details at a glance: `Booking ID`, `Traveler Info`, `Dates`, and `Total Price`.
- **Status Badges**: Added dynamic, color-coded badges for both `Booking Status` (e.g. APPROVED, UNDER REVIEW) and `Payment Status` (e.g. UNPAID, PARTIALLY PAID).

### Booking Details Sheet (Side Drawer)
- Clicking the "View Details" (eye) icon on any booking opens a beautiful side-drawer.
- **Logistics**: Displays the traveler party type (Adults/Children), Journey details, and dates.
- **Financials**: Displays the confirmed total, paid amount, and outstanding balance in a structured card.
- **Action Hub**: Depending on the booking's current status, actionable buttons are available (e.g., *Approve Booking*, *Reject Request*, *Cancel Booking*).

### API Integration
- Custom hooks (`useBookings.ts` & `usePayments.ts`) were added to connect directly to the backend.
- Action mutations trigger real-time refetching so the UI always reflects the current backend state.

### Routing & Navigation
- Added the `/bookings` route inside `RootLayout.tsx`.
- The main `Sidebar` now includes a `Bookings` link with an appropriate `CalendarDays` icon.

## 2. Verification
- `npm run typecheck` returned zero errors.
- The UI renders perfectly without crashing.

You can visit `http://localhost:5173/bookings` or click "Bookings" in your dashboard sidebar to see it in action!
