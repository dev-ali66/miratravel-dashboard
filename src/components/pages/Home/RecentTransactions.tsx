import { SlideBottom } from "@/components/animation"

const transactions = [
  {
    id: "TX-9842",
    date: "2026-06-15",
    customer: "Olivia Martin",
    amount: "$1,999.00",
    status: "Completed",
  },
  {
    id: "TX-9841",
    date: "2026-06-15",
    customer: "Jackson Lee",
    amount: "$39.00",
    status: "Completed",
  },
  {
    id: "TX-9840",
    date: "2026-06-14",
    customer: "Isabella Nguyen",
    amount: "$299.00",
    status: "Processing",
  },
  {
    id: "TX-9839",
    date: "2026-06-14",
    customer: "William Kim",
    amount: "$99.00",
    status: "Completed",
  },
  {
    id: "TX-9838",
    date: "2026-06-13",
    customer: "Sofia Davis",
    amount: "$39.00",
    status: "Failed",
  },
  {
    id: "TX-9837",
    date: "2026-06-13",
    customer: "Liam Johnson",
    amount: "$1,450.00",
    status: "Completed",
  },
  {
    id: "TX-9836",
    date: "2026-06-12",
    customer: "Emma Wilson",
    amount: "$89.00",
    status: "Refunded",
  },
]

export default function RecentTransactions({
  className,
}: {
  className?: string
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      case "Processing":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400"
      case "Failed":
        return "bg-destructive/10 text-destructive"
      case "Refunded":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-foreground"
    }
  }

  return (
    <SlideBottom
      delay={0.3}
      className={`flex flex-col overflow-hidden rounded-md border border-border/60 bg-card/60 shadow-xs backdrop-blur-xl ${className || ""}`}
    >
      <div className="flex items-center justify-between p-5 pb-3.5">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-foreground">
            Recent Transactions
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Review the latest financial records
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="border-b border-border/60 bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground select-none">
            <tr>
              <th className="px-5 py-3.5 font-semibold">Transaction ID</th>
              <th className="px-5 py-3.5 font-semibold">Date</th>
              <th className="px-5 py-3.5 font-semibold">Customer</th>
              <th className="px-5 py-3.5 text-right font-semibold">Amount</th>
              <th className="px-5 py-3.5 text-center font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 text-foreground">
            {transactions.map((tx) => (
              <tr key={tx.id} className="transition-colors hover:bg-muted/30">
                <td className="px-5 py-3.5 font-mono text-xs font-semibold text-primary whitespace-nowrap">
                  {tx.id}
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap text-sm text-muted-foreground">
                  {tx.date}
                </td>
                <td className="px-5 py-3.5 font-medium text-sm text-foreground">
                  {tx.customer}
                </td>
                <td className="px-5 py-3.5 text-right font-mono font-semibold text-sm text-foreground">
                  {tx.amount}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex justify-center">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${getStatusColor(tx.status)}`}
                    >
                      {tx.status}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SlideBottom>
  )
}
