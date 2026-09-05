import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function DownloadReportButton() {
  return (
    <Button
      size="sm"
      className="group relative h-9 gap-2 overflow-hidden bg-primary font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 bg-white/20"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
      <Download className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:scale-105" />
      <span>Download</span>
    </Button>
  )
}
