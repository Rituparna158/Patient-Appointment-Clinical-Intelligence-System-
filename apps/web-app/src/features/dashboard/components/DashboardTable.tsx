import { useEffect } from "react"
 
import { useDashboardStore } from "../../../store/dashboard/dashboard.store"
 
import { DataTable } from "@/features/shared/table/components/DataTable"
import { TablePagination } from "@/features/shared/table/components/TablePagination"
import { TableFilters } from "@/features/shared/table/components/TableFilters"
 
import TableSkeleton from "@/features/shared/components/TableSkeleton"
 
import type { DailyAnalyticsRow } from "../../../types/dashboard.types"
 
export default function DashboardTable() {
 
  const {
    rows,
    total,
    page,
    limit,
    sortBy,
    sortOrder,
    from,
    to,
 
    setPage,
    setSort,
    setFrom,
    setTo,
 
    fetchAdminTable,
  
  } = useDashboardStore()
 
  useEffect(() => {
 
    fetchAdminTable()

 
  }, [ page , sortBy , sortOrder , from , to])
 
  const columns = [
 
    {
      key: "date",
      header: "Date",
      sortable: true,
      render: (row: DailyAnalyticsRow) =>
        new Date(row.date).toLocaleDateString()
    },
 
    {
      key: "totalAppointments",
      header: "Total Appointments",
      sortable: true,
      render: (row: DailyAnalyticsRow) =>
        row.totalAppointments
    },
 
    {
      key: "completedAppointments",
      header: "Completed",
      sortable: true,
      render: (row: DailyAnalyticsRow) =>
        row.completedAppointments
    },
 
    {
      key: "cancelledAppointments",
      header: "Cancelled",
      sortable: true,
      render: (row: DailyAnalyticsRow) =>
        row.cancelledAppointments
    },
 
    {
      key: "missedAppointments",
      header: "Missed",
      sortable: true,
      render: (row: DailyAnalyticsRow) =>
        row.missedAppointments
    },
 
    {
      key: "uniquePatients",
      header: "Unique Patients",
      sortable: true,
      render: (row: DailyAnalyticsRow) =>
        row.uniquePatients
    },
 
    {
      key: "followUpsScheduled",
      header: "Follow Ups",
      sortable: true,
      render: (row: DailyAnalyticsRow) =>
        row.followUpsScheduled
    }
 
  ]
 
  return (
 
    <div className="space-y-4">
 
 
      <TableFilters
        fromDate={from}
        toDate={to}
        setFromDate={setFrom}
        setToDate={setTo}
      />
 
      {rows.length === 0 ? (
 
        <TableSkeleton/>
 
      ) : (
 
        <DataTable
          data={rows}
          columns={columns}
          selected={[]}
          onSelect={() => {}}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={setSort}
        />
 
      )}

 
      <TablePagination
        page={page}
        total={total}
        limit={limit}
        onPageChange={setPage}
      />
 
    </div>
 
  )
}
