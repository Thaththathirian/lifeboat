import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusBadgeVariants = cva(
  "status-badge inline-flex items-center gap-1",
  {
    variants: {
      status: {
        pending: "status-pending",
        approved: "status-approved", 
        rejected: "status-rejected",
        interview: "status-interview",
        documents: "status-documents",
        "update-profile": "bg-orange-100 text-orange-800 border border-orange-200",
        "schedule-interview": "bg-blue-100 text-blue-800 border border-blue-200",
        "upload-documents": "bg-purple-100 text-purple-800 border border-purple-200",
        "documents-submitted": "bg-indigo-100 text-indigo-800 border border-indigo-200",
        "eligible-for-scholarship": "bg-green-100 text-green-800 border border-green-200",
        "payment-pending": "bg-yellow-100 text-yellow-800 border border-yellow-200",
        "paid": "bg-emerald-100 text-emerald-800 border border-emerald-200",
        "upload-academic-results": "bg-cyan-100 text-cyan-800 border border-cyan-200",
        "academic-results-uploaded": "bg-teal-100 text-teal-800 border border-teal-200",
        "apply-for-next": "bg-violet-100 text-violet-800 border border-violet-200",
        "alumni": "bg-rose-100 text-rose-800 border border-rose-200",
        "blocked": "bg-red-100 text-red-800 border border-red-200"
      }
    },
    defaultVariants: {
      status: "pending"
    }
  }
)

export interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  children: React.ReactNode
  className?: string
}

export function StatusBadge({ children, status, className }: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ status }), className)}>
      {children}
    </span>
  )
}