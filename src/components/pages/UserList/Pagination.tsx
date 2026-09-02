import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useId } from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
    showText?: boolean;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    className,
    showText = true,
}: PaginationProps) {
    const layoutId = useId();
    
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 4) {
                pages.push(1, 2, 3, 4, 5, '...', totalPages);
            } else if (currentPage >= totalPages - 3) {
                pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        
        return pages;
    };

    return (
        <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4 w-full", className)}>
            {showText && (
                <div className="hidden sm:block text-sm text-muted-foreground font-medium">
                    Page <span className="text-foreground font-bold">{currentPage}</span> of{" "}
                    <span className="text-foreground font-bold">{totalPages}</span>
                </div>
            )}
            
            <div className="flex items-center gap-1.5 p-1 rounded-full border border-transparent sm:border-border/40 sm:bg-muted/10 transition-all">
                <motion.button
                    whileHover={currentPage === 1 ? {} : { scale: 1.05 }}
                    whileTap={currentPage === 1 ? {} : { scale: 0.95 }}
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative flex items-center justify-center w-9 h-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
                </motion.button>

                <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => {
                        if (page === '...') {
                            return (
                                <div key={`ellipsis-${index}`} className="w-9 h-9 flex items-center justify-center text-muted-foreground/60">
                                    <MoreHorizontal className="w-4 h-4" />
                                </div>
                            );
                        }

                        const isActive = currentPage === page;
                        
                        return (
                            <motion.button
                                whileHover={{ scale: isActive ? 1 : 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                key={`page-${page}`}
                                onClick={() => onPageChange(page as number)}
                                className={cn(
                                    "relative w-9 h-9 flex items-center justify-center rounded-full text-[14px] font-bold cursor-pointer transition-colors duration-200",
                                    isActive
                                        ? "text-primary-foreground"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId={`${layoutId}-active`}
                                        className="absolute inset-0 bg-primary rounded-full shadow-lg shadow-primary/30"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                                    />
                                )}
                                <span className="relative z-10">{page}</span>
                            </motion.button>
                        );
                    })}
                </div>

                <motion.button
                    whileHover={currentPage === totalPages ? {} : { scale: 1.05 }}
                    whileTap={currentPage === totalPages ? {} : { scale: 0.95 }}
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative flex items-center justify-center w-9 h-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                    <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
                </motion.button>
            </div>
        </div>
    );
}
