import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import type { Props } from "../../types/DataTable.types"
export function DataTable<T extends { id: string }>({
  data,
  columns,
  selected,
  onSelect,
  sortBy,
  sortOrder,
  onSort
}: Props<T>) {

  return (

    <div className="rounded-lg border bg-white overflow-hidden">

      <Table>

        <TableHeader>

          <TableRow>

            <TableHead className="w-[40px]"></TableHead>

            {columns.map(col => (

    <TableHead
    key={col.key}
    className={`cursor-pointer select-none ${
        col.sortable ? "hover:bg-gray-50" : ""
    }`}
    onClick={() => col.sortable && onSort?.(col.key)}
    >

    <div className="flex items-center gap-1">

        {col.header}

        {col.sortable && sortBy === col.key && (
        sortOrder === "ASC"
            ? <span className="text-xs">▲</span>
            : <span className="text-xs">▼</span>
        )}

    </div>

    </TableHead>


            ))}

          </TableRow>

        </TableHeader>

        <TableBody>

          {data.length === 0 && (

            <TableRow>

              <TableCell
                colSpan={columns.length + 1}
                className="text-center py-8 text-muted-foreground"
              >
                No records found
              </TableCell>

            </TableRow>

          )}

          {data.map(row => (

            <TableRow key={row.id} className="hover:bg-gray-50">

              <TableCell>

                <input
                  type="checkbox"
                  checked={selected.includes(row.id)}
                  onChange={() => onSelect(row.id)}
                />

              </TableCell>

              {columns.map(col => (

                <TableCell key={col.key}>
                  {col.render(row)}
                </TableCell>

              ))}

            </TableRow>

          ))}

        </TableBody>

      </Table>

    </div>

  )

}





