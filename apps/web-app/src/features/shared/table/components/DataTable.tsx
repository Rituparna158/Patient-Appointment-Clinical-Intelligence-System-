import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Props } from "../../types/DataTable.types";
 
export function DataTable<T extends { id: string }>({
  data = [],
  columns = [],
  selected = [],
  onSelect,
  sortBy,
  sortOrder,
  onSort,
}: Props<T>) {

  function handleSort(key: string, sortable?: boolean) {
    if (!sortable || !onSort) return
    onSort(key)
  }
 
  function getAriaSort(key: string, sortable?: boolean) {
    if (!sortable) return undefined
    if (sortBy !== key) return "none"
    return sortOrder === "ASC" ? "ascending" : "descending"
  }

  return (
    <div className="rounded-lg border border-border bg-card text-card-foreground overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="w-[40px]" />
         {columns.map((col) => {
              const isSorted = sortBy === col.key
 
              return (
                <TableHead
                  key={col.key}
                  className="p-0"
                  aria-sort={getAriaSort(col.key, col.sortable)}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => handleSort(col.key, col.sortable)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          handleSort(col.key, col.sortable)
                        }
                      }}
                      className="flex w-full items-center gap-1 px-4 py-3 text-left font-semibold text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                    >
                      <span>{col.header}</span>
 
                      {isSorted && (
                        <span
                          className="text-xs text-muted-foreground"
                          aria-hidden="true"
                        >
                          {sortOrder === "ASC" ? "▲" : "▼"}
                        </span>
                      )}
                    </button>
                  ) : (
                    <div className="px-4 py-3 font-semibold text-foreground">
                      {col.header}
                    </div>
                  )}
                </TableHead>
              )
            })}
          </TableRow>
        </TableHeader>
 
        <TableBody>
          {data.length === 0 ? (
            <TableRow className="border-border">
              <TableCell
                colSpan={columns.length + 1}
                className="text-center py-8 text-muted-foreground"
              >
                No records found
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={row.id} className="border-border hover:bg-muted/40">
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selected.includes(row.id)}
                    onChange={() => onSelect(row.id)}
                    aria-label="Select row"
                    className="h-4 w-4 accent-primary"
                  />
                </TableCell>
                {columns.map((col) => (
                  <TableCell key={col.key} className="text-muted-foreground">{col.render(row)}</TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
 