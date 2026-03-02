import { Badge } from "@/components/ui/badge"
import type { StatusBadgeProps } from "../types/shared.types"

export default function StatusBadge({ status }: StatusBadgeProps) {
  const variant =
    status === "cancelled"
      ? "destructive"
      : status === "completed"
      ? "secondary"
      : status === "confirmed"
      ? "default"
      : "outline"

  return <Badge variant={variant}>{status}</Badge>
}