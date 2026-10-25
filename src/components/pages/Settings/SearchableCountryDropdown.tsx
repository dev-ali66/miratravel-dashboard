import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Search, X, Check } from "lucide-react"
import { COUNTRIES, type CountryOption } from "@/lib/data/countries"

interface SearchableCountryDropdownProps {
  label: string
  value: string
  onChange: (value: string) => void
  options?: CountryOption[]
  placeholder?: string
  searchPlaceholder?: string
  error?: string
  disabled?: boolean
}

export function SearchableCountryDropdown({
  label,
  value,
  onChange,
  options = COUNTRIES,
  placeholder = "Select...",
  searchPlaceholder = "Search countries...",
  error,
  disabled = false,
}: SearchableCountryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const selectedItem = options.find(
    (item) =>
      item.name.toLowerCase() === (value || "").toLowerCase() ||
      item.code.toLowerCase() === (value || "").toLowerCase() ||
      (value?.toUpperCase() === "USA" && item.code === "US") ||
      (value?.toUpperCase() === "UK" && item.code === "GB")
  )

  const displayName = value === "USA" ? "USA" : selectedItem?.name || value

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      setTimeout(() => searchInputRef.current?.focus(), 50)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const filteredOptions = options.filter((item) => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return true
    return (
      item.name.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q) ||
      (item.region && item.region.toLowerCase().includes(q))
    )
  })

  function handleSelect(name: string) {
    onChange(name)
    setIsOpen(false)
    setSearchQuery("")
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full min-w-0 transition-all ${disabled ? "opacity-60 pointer-events-none" : ""
        }`}
    >
      <div
        className={`relative h-[52px] sm:h-[54px] w-full rounded-lg border transition-all ${error
            ? "border-destructive focus-within:border-destructive shadow-xs"
            : isOpen
              ? "border-primary ring-2 ring-primary/10 shadow-xs"
              : "border-border/80 hover:border-foreground/40 focus-within:border-primary"
          } bg-background`}
      >
        <label className="pointer-events-none absolute -top-2.5 left-3.5 bg-background px-1.5 text-[11px] font-medium tracking-tight text-muted-foreground z-10 rounded">
          {label}
        </label>

        {/* Trigger Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen((prev) => !prev)}
          className="h-full w-full flex items-center justify-between px-3.5 pt-1 text-sm font-normal text-foreground focus:outline-none cursor-pointer group"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            {selectedItem ? (
              <>
                <span className="text-base leading-none shrink-0">
                  {selectedItem.flag}
                </span>
                <span className="truncate font-medium text-foreground">
                  {displayName}
                </span>
                <span className="text-[11px] text-muted-foreground/70 hidden sm:inline">
                  ({selectedItem.code})
                </span>
              </>
            ) : value ? (
              <span className="truncate font-medium text-foreground">
                {value}
              </span>
            ) : (
              <span className="text-muted-foreground/60 font-normal">
                {placeholder}
              </span>
            )}
          </div>

          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.18 }}
            className="text-muted-foreground group-hover:text-foreground shrink-0 pl-2"
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </button>
      </div>

      {error && <p className="text-xs text-destructive pl-1 pt-1">{error}</p>}

      {/* Floating Popover Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-md border border-border/80 bg-popover text-popover-foreground shadow-xl backdrop-blur-md"
          >
            {/* Search Input Bar */}
            <div className="relative border-b border-border/60 p-2.5 bg-muted/30">
              <div className="relative flex items-center">
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="h-9 w-full rounded-lg border border-border/80 bg-background pl-9 pr-8 text-xs text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Options List */}
            <div className="max-h-64 overflow-y-auto p-1.5 scrollbar-thin">
              {filteredOptions.length === 0 ? (
                <div className="py-6 text-center text-xs text-muted-foreground">
                  No match found for &ldquo;{searchQuery}&rdquo;
                </div>
              ) : (
                filteredOptions.map((item) => {
                  const isSelected =
                    selectedItem?.code === item.code ||
                    value?.toLowerCase() === item.name.toLowerCase()

                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => handleSelect(item.name)}
                      className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-xs transition-colors cursor-pointer text-left ${isSelected
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "hover:bg-muted text-foreground"
                        }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="text-base leading-none shrink-0">
                          {item.flag}
                        </span>
                        <span className="truncate">{item.name}</span>
                        <span
                          className={`text-[10px] uppercase font-mono ${isSelected
                              ? "text-primary-foreground/80"
                              : "text-muted-foreground"
                            }`}
                        >
                          {item.code}
                        </span>
                      </div>

                      {isSelected && (
                        <Check className="h-3.5 w-3.5 shrink-0 text-primary-foreground" />
                      )}
                    </button>
                  )
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
