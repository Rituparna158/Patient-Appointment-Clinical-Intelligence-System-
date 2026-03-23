import { useEffect } from "react"
 
import DashboardLayout from "@/app/layout/AppLayout"
 
import { useDashboardStore } from "@/store/dashboard/dashboard.store"
 
import StatusBadge from "@/features/shared/components/StatusBadge"
import TableSkeleton from "@/features/shared/components/TableSkeleton"
 
import { DataTable } from "@/features/shared/table/components/DataTable"
import { TablePagination } from "@/features/shared/table/components/TablePagination"
import { TableFilters } from "@/features/shared/table/components/TableFilters"

import PatientDashboardCounters from "./components/PatientDashboardCounter"
 
import type { PatientUpcomingAppointment, RangeType } from "../../types/dashboard.types"
 
 
export default function PatientDashboard() {
 
  const {
 
    patientDashboard,
    range,
    page,
    limit,
    sortBy,
    sortOrder,
    from,
    to,
    setRange,
    setPage,
    setSort,
    setFrom,
    setTo,
 
    fetchPatientDashboard
 
  } = useDashboardStore()
 
  useEffect(() => {
 
    fetchPatientDashboard()
 
  }, [fetchPatientDashboard, range, page , sortBy , sortOrder , from , to])
 
 
  const counters = patientDashboard?.counters
 
  const rows = patientDashboard?.upcoming ?? []
 
 
  const columns = [
 
    {
      key: "doctorName",
      header: "Doctor",
      sortable: true,
      render: (row: PatientUpcomingAppointment) =>
        row.doctorName
    },
 
    {
      key: "slotDate",
      header: "Date",
      sortable: true,
      render: (row: PatientUpcomingAppointment) =>
        new Date(row.slotDate).toLocaleDateString()
    },
 
    {
      key: "startTime",
      header: "Time",
      sortable: false,
      render: (row: PatientUpcomingAppointment) =>
        row.startTime
    },
 
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row: PatientUpcomingAppointment) =>
        <StatusBadge status={row.status}/>
    }
 
  ]
 
 
  return (
 
    <DashboardLayout>
 
      <div className="space-y-6">
 
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
 
          <div>
 
            <h1 className="text-xl font-semibold">
              Patient Dashboard
            </h1>
 
            <p className="text-sm text-muted-foreground">
              Track your appointments and doctors
            </p>
 
          </div>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as RangeType)}
            className="h-10 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus-:ring-2 focus:ring-ring"
          >
            <option value="today">Today</option>
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
            <option value="year">Yearly</option>
          </select>
 
        </div>
 
 
        {counters && (
 
          <PatientDashboardCounters data={patientDashboard.counters}/>
 
        )}
 
 
        <div className="space-y-4">
 
          <h3 className="font-semibold">
            Upcoming Appointments
          </h3>
 
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
              onSelect={()=>{}}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={setSort}
            />
 
          )}
 
          <TablePagination
            page={page}
            total={rows.length}
            limit={limit}
            onPageChange={setPage}
          />
 
        </div>
 
      </div>
 
    </DashboardLayout>
 
  )
}

 