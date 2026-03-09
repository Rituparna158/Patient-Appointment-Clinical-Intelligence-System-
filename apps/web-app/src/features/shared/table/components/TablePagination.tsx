import { Button } from "@/components/ui/button"
import { TABLE_TEXT } from "@/constants/table.constants"

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
  onPageChange
}: Props) {

  const totalPages = Math.ceil(total / limit)

  return (

    <div className="table-pagination">

      <span>
        Page {page} of {totalPages || 1}
      </span>

      <div className="flex gap-2">

        <Button
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          {TABLE_TEXT.PREVIOUS}
        </Button>

        <Button
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          {TABLE_TEXT.NEXT}
        </Button>

      </div>

    </div>

  )
}


