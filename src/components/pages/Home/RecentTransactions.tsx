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
      className={`flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm ${className || ""}`}
    >
      <div className="flex items-center justify-between p-6 pb-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            Recent Transactions
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Review the latest financial records
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-y border-border bg-muted/40 text-xs text-muted-foreground uppercase">
            <tr>
              <th className="px-6 py-3 font-medium">Transaction ID</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Customer</th>
              <th className="px-6 py-3 text-right font-medium">Amount</th>
              <th className="px-6 py-3 text-center font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions.map((tx) => (
              <tr key={tx.id} className="transition-colors hover:bg-muted/20">
                <td className="px-6 py-4 font-medium whitespace-nowrap text-foreground">
                  {tx.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                  {tx.date}
                </td>
                <td className="px-6 py-4 font-medium text-foreground">
                  {tx.customer}
                </td>
                <td className="px-6 py-4 text-right font-medium text-foreground">
                  {tx.amount}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusColor(tx.status)}`}
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
