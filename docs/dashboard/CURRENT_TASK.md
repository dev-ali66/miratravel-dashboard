# IAM Frontend Refactor

## Booking Module Implementation

## 1. Data Hooks & Types
- [x] Create `src/hooks/booking/useBookings.ts` with types and GET hook.
- [x] Add mutations (Approve, Reject, Cancel, Revise Total).

## 2. UI Components
- [x] Create `src/components/pages/Bookings/index.tsx` (Page wrapper).
- [x] Create `src/components/pages/Bookings/BookingTable.tsx` (Data table).
- [x] Create `src/components/pages/Bookings/BookingDetailsSheet.tsx` (Side drawer for details).

## 3. Routing & Navigation
- [x] Add `/bookings` route to `src/App.tsx`.
- [x] Add "Bookings" link to the main sidebar.

## 4. Verification
- [x] Run `npm run typecheck`.
- [x] Verify UI rendering in browser.
