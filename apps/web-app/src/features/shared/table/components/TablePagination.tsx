import { Button } from "@/components/ui/button"

interface Props {
  page: number
  total: number
  limit: number
  onPageChange: (page: number) => void
}

export function TablePagination({
  page,
  total,
  limit,
  onPageChange,
}: Props) {
  const totalPages = Math.ceil(total / limit)

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages || 1}
      </span>

      <div className="flex gap-2">
        <Button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>

        <Button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}




