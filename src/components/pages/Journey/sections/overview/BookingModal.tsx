import { useState } from "react"
import { X, Check, Calendar, Users, Mail, Phone, User, Sparkles, Send } from "lucide-react"

export interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  journeyTitle?: string
  price?: string | number
  currency?: string
}

export function BookingModal({
  isOpen,
  onClose,
  journeyTitle = "Classic Albania & The Ionian Coast",
  price = "3,195",
  currency = "EUR",
}: BookingModalProps) {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    travelDate: "",
    guests: "2 Guests",
    notes: "",
  })

  if (!isOpen) return null

  const formattedPrice = `${currency === "EUR" ? "€" : currency === "USD" ? "$" : currency || "€"}${
    typeof price === "number" ? price.toLocaleString() : price || "3,195"
  }`

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const handleResetAndClose = () => {
    setSubmitted(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 md:p-6 overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-[#FAF6F0] rounded-xl border border-[#D8CBB8] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#D8CBB8] bg-white px-5 py-4 sm:px-6 sm:py-5">
          <div className="space-y-1 pr-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#182d09] text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-white">
              <Sparkles className="size-3" />
              Booking Inquiry Modal
            </span>
            <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-semibold text-[#080c1d] leading-tight">
              {journeyTitle}
            </h3>
            <p className="text-xs sm:text-sm text-[#af6348] font-semibold">
              Starting from {formattedPrice} / per person
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            className="rounded-full p-2 text-[#464136] hover:bg-neutral-100 transition-colors cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {submitted ? (
            <div className="flex flex-col items-center justify-center text-center py-8 space-y-4">
              <div className="size-14 rounded-full bg-[#182d09] text-white flex items-center justify-center shadow-lg">
                <Check className="size-8" />
              </div>
              <h4 className="font-serif text-xl sm:text-2xl font-semibold text-[#080c1d]">
                Inquiry Received!
              </h4>
              <p className="text-xs sm:text-sm text-[#464136] max-w-md leading-relaxed">
                Thank you for your booking request for <strong>{journeyTitle}</strong>. Our MIRA travel specialist will contact you within 24 hours to confirm availability and tailor your itinerary.
              </p>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="mt-4 rounded-md bg-[#182d09] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white uppercase tracking-wider hover:bg-[#365314] transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Trip Summary Card */}
              <div className="rounded-lg border border-[#D8CBB8] bg-white p-4 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between items-center text-[#080c1d] font-semibold border-b border-[#D8CBB8]/60 pb-2">
                  <span>Selected Experience</span>
                  <span className="text-[#af6348]">{formattedPrice} / person</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#464136] pt-1">
                  <span className="flex items-center gap-1.5">
                    <Check className="size-3.5 text-[#af6348]" /> Taxes & Fees Included
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="size-3.5 text-[#af6348]" /> Tailoring Included
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="size-3.5 text-[#af6348]" /> 24/7 Concierge
                  </span>
                </div>
              </div>

              {/* Input Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#080c1d] flex items-center gap-1.5">
                    <User className="size-3.5 text-[#af6348]" /> Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Eleanor Vance"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-md border border-[#D8CBB8] bg-white px-3 py-2 text-xs sm:text-sm focus:border-[#af6348] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#080c1d] flex items-center gap-1.5">
                    <Mail className="size-3.5 text-[#af6348]" /> Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. eleanor@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-md border border-[#D8CBB8] bg-white px-3 py-2 text-xs sm:text-sm focus:border-[#af6348] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#080c1d] flex items-center gap-1.5">
                    <Phone className="size-3.5 text-[#af6348]" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-md border border-[#D8CBB8] bg-white px-3 py-2 text-xs sm:text-sm focus:border-[#af6348] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#080c1d] flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-[#af6348]" /> Preferred Travel Date
                  </label>
                  <input
                    type="date"
                    value={formData.travelDate}
                    onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                    className="w-full rounded-md border border-[#D8CBB8] bg-white px-3 py-2 text-xs sm:text-sm focus:border-[#af6348] focus:outline-none text-[#464136]"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-[#080c1d] flex items-center gap-1.5">
                    <Users className="size-3.5 text-[#af6348]" /> Number of Guests
                  </label>
                  <select
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    className="w-full rounded-md border border-[#D8CBB8] bg-white px-3 py-2 text-xs sm:text-sm focus:border-[#af6348] focus:outline-none text-[#464136]"
                  >
                    <option value="1 Guest">1 Guest (Solo Travel)</option>
                    <option value="2 Guests">2 Guests (Couple / Pair)</option>
                    <option value="3-4 Guests">3–4 Guests (Small Group)</option>
                    <option value="5+ Guests">5+ Guests (Private Custom Group)</option>
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-[#080c1d]">
                    Special Requests / Tailoring Preferences
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Mention any dietary needs, preferred room types, or extra activities..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full rounded-md border border-[#D8CBB8] bg-white px-3 py-2 text-xs sm:text-sm focus:border-[#af6348] focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit & Cancel Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D8CBB8]/60">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="rounded-md border border-[#D8CBB8] bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#464136] hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-md bg-[#182d09] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white uppercase tracking-wider hover:bg-[#365314] transition-colors cursor-pointer shadow-sm"
                >
                  <Send className="size-4" />
                  Submit Request
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookingModal
