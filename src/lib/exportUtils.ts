import { apiPrivate } from "./api-client"
import { toast } from "sonner"

/**
 * Escape a cell for RFC 4180 compliant CSV.
 * Properly handles quotes, commas, newlines, and nulls.
 */
export function escapeCsvCell(val: any): string {
  if (val === null || val === undefined) return '""'
  if (val instanceof Date) {
    return `"${val.toISOString()}"`
  }
  let str = String(val)
  str = str.replace(/"/g, '""')
  return `"${str}"`
}

/**
 * Downloads a Blob as a file in the browser.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/**
 * Build CSV string with UTF-8 Byte Order Mark (\uFEFF) for Microsoft Excel compatibility.
 */
export function buildCsvContent(headers: string[], rows: any[][]): string {
  const headerRow = headers.map(escapeCsvCell).join(",")
  const dataRows = rows.map((row) => row.map(escapeCsvCell).join(","))
  return `\uFEFF${[headerRow, ...dataRows].join("\r\n")}`
}

/**
 * Client-side CSV generator and downloader.
 */
export function exportToCsv(
  filename: string,
  headers: string[],
  rows: any[][]
): void {
  const csvContent = buildCsvContent(headers, rows)
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  downloadBlob(blob, filename)
}

interface ApiExportOptions {
  endpoint: string // e.g. "bookings", "users", "inquiries", "newsletter", "audit-logs"
  params?: Record<string, any>
  defaultFilename: string
  fallback?: () => void | Promise<void>
  entityName?: string
}

/**
 * Universal Export Handler:
 * 1. Attempts to download high-fidelity CSV from the dedicated backend `/api/v1/export/...` endpoint.
 * 2. If the network or backend is unreachable, gracefully executes fallback client-side CSV generation.
 */
export async function triggerCsvExport({
  endpoint,
  params = {},
  defaultFilename,
  fallback,
  entityName = "Data",
}: ApiExportOptions): Promise<void> {
  const toastId = toast.loading(`Preparing ${entityName} CSV export...`)
  try {
    const response = await apiPrivate.get(`/export/${endpoint}`, {
      params,
      responseType: "blob",
    })

    // Extract filename from Content-Disposition header if present
    let downloadName = defaultFilename
    const disposition = response.headers["content-disposition"]
    if (disposition && disposition.includes("filename=")) {
      const match = disposition.match(/filename="?([^"]+)"?/)
      if (match?.[1]) {
        downloadName = match[1]
      }
    }

    const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" })
    downloadBlob(blob, downloadName)
    toast.success(`${entityName} CSV exported successfully`, { id: toastId })
  } catch (err) {
    // If backend endpoint is unavailable or returned an error, run fallback client generator
    if (fallback) {
      try {
        await fallback()
        toast.success(`${entityName} CSV exported successfully (local fallback)`, {
          id: toastId,
        })
        return
      } catch (fallbackErr) {
        console.error("Export fallback failed:", fallbackErr)
      }
    }
    toast.error(`Failed to export ${entityName} CSV. Please try again.`, {
      id: toastId,
    })
  }
}
