interface Props {
  status?: string
  setStatus?: (value: string) => void
  fromDate?: string
  toDate?: string
  setFromDate: (value: string) => void
  setToDate: (value: string) => void
}

export function TableFilters({
  status,
  setStatus,
  fromDate,
  toDate,
  setFromDate,
  setToDate
}: Props) {

  return (

    <div className="table-filters flex gap-3 items-center">
        
      {status !== undefined && setStatus && (
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">All Status</option>
          <option value="requested">Requested</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="missed">Missed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      )}

      {/* From Date */}
      <input
        type="date"
        value={fromDate ?? ""}
        onChange={(e) => setFromDate(e.target.value)}
        className="border rounded px-2 py-1"
      />

      {/* To Date */}
      <input
        type="date"
        value={toDate ?? ""}
        onChange={(e) => setToDate(e.target.value)}
        className="border rounded px-2 py-1"
      />

    </div>

  )
}
