import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useId } from "react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
  showText?: boolean
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  showText = true,
}: PaginationProps) {
  const layoutId = useId()

  const getPageNumbers = () => {
    const pages: (number | string)[] = []

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages)
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        )
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        )
      }
    }

    return pages
  }

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-between gap-4 sm:flex-row",
        className
      )}
    >
      {showText && (
        <div className="hidden text-sm font-medium text-muted-foreground sm:block">
          Page <span className="font-bold text-foreground">{currentPage}</span>{" "}
          of <span className="font-bold text-foreground">{totalPages}</span>
        </div>
      )}

      <div className="flex items-center gap-1.5 rounded-full border border-transparent p-1 transition-all sm:border-border/40 sm:bg-muted/10">
        <motion.button
          whileHover={currentPage === 1 ? {} : { scale: 1.05 }}
          whileTap={currentPage === 1 ? {} : { scale: 0.95 }}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
        </motion.button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === "...") {
              return (
                <div
                  key={`ellipsis-${index}`}
                  className="flex h-9 w-9 items-center justify-center text-muted-foreground/60"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </div>
              )
            }

            const isActive = currentPage === page

            return (
              <motion.button
                whileHover={{ scale: isActive ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={`page-${page}`}
                onClick={() => onPageChange(page as number)}
                className={cn(
                  "relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[14px] font-bold transition-colors duration-200",
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId={`${layoutId}-active`}
                    className="absolute inset-0 rounded-full bg-primary shadow-lg shadow-primary/30"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{page}</span>
              </motion.button>
            )
          })}
        </div>

        <motion.button
          whileHover={currentPage === totalPages ? {} : { scale: 1.05 }}
          whileTap={currentPage === totalPages ? {} : { scale: 0.95 }}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
        </motion.button>
      </div>
    </div>
  )
}
