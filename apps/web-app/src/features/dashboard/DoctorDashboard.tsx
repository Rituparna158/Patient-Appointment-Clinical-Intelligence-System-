import { useEffect } from "react"

import DashboardLayout from "@/app/layout/AppLayout"

import { useDashboardStore } from "@/store/dashboard/dashboard.store"

import DoctorDashboardCounters from "./components/DoctorDashboardCounter"
import ExportButton from "./components/ExportButton"

import { DataTable } from "@/features/shared/table/components/DataTable"
import { TablePagination } from "@/features/shared/table/components/TablePagination"
import { TableFilters } from "@/features/shared/table/components/TableFilters"

import StatusBadge from "@/features/shared/components/StatusBadge"
import TableSkeleton from "@/features/shared/components/TableSkeleton"

import type {
  DoctorUpcomingAppointment,
  RangeType,
} from "../../types/dashboard.types"

import DoctorCompletionChart from "./components/DoctorCompletionChart"
import DoctorPatientTypeChart from "./components/DoctorPatientTypeChart"
import DoctorWorkloadTrendChart from "./components/DoctorWorkloadTrendChart"

export default function DoctorDashboard() {
  const doctorDashboard = useDashboardStore((state) => state.doctorDashboard)
  const doctorTrend = useDashboardStore((state) => state.doctorTrend)
  const completionRate = useDashboardStore((state) => state.completionRate)
  const patientTypes = useDashboardStore((state) => state.patientTypes)

  const range = useDashboardStore((state) => state.range)
  const page = useDashboardStore((state) => state.page)
  const limit = useDashboardStore((state) => state.limit)
  const sortBy = useDashboardStore((state) => state.sortBy)
  const sortOrder = useDashboardStore((state) => state.sortOrder)
  const from = useDashboardStore((state) => state.from)
  const to = useDashboardStore((state) => state.to)

  const setRange = useDashboardStore((state) => state.setRange)
  const setPage = useDashboardStore((state) => state.setPage)
  const setSort = useDashboardStore((state) => state.setSort)
  const setFrom = useDashboardStore((state) => state.setFrom)
  const setTo = useDashboardStore((state) => state.setTo)

  const fetchDoctorDashboard = useDashboardStore(
    (state) => state.fetchDoctorDashboard
  )
  const fetchDoctorCharts = useDashboardStore((state) => state.fetchDoctorCharts)

  useEffect(() => {
    fetchDoctorDashboard()
    fetchDoctorCharts()
  }, [
    fetchDoctorDashboard,
    fetchDoctorCharts,
    range,
    page,
    sortBy,
    sortOrder,
    from,
    to,
  ])

  const counters = doctorDashboard?.counters
  const rows = doctorDashboard?.upcoming ?? []

  const columns = [
    {
      key: "patientName",
      header: "Patient",
      sortable: true,
      render: (row: DoctorUpcomingAppointment) => row.patientName,
    },
    {
      key: "slotDate",
      header: "Date",
      sortable: true,
      render: (row: DoctorUpcomingAppointment) =>
        new Date(row.slotDate).toLocaleDateString(),
    },
    {
      key: "startTime",
      header: "Time",
      sortable: true,
      render: (row: DoctorUpcomingAppointment) => row.startTime,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row: DoctorUpcomingAppointment) => (
        <StatusBadge status={row.status} />
      ),
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Doctor Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Overview of appointments and schedule
            </p>
          </div>

          <div className="flex items-center gap-3">
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

            <ExportButton />
          </div>
        </div>

        {counters && <DoctorDashboardCounters data={counters} />}

        <div className="doctor-dashboard">
          <div className="h-[300px]">
            <DoctorWorkloadTrendChart data={doctorTrend} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {completionRate && (
            <div className="doctor-dashboard">
              <DoctorCompletionChart data={completionRate} />
            </div>
          )}

          {patientTypes && (
            <div className="doctor-dashboard">
              <DoctorPatientTypeChart data={patientTypes} />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Upcoming Appointments</h3>

          <TableFilters
            fromDate={from}
            toDate={to}
            setFromDate={setFrom}
            setToDate={setTo}
          />

          {rows.length === 0 ? (
            <TableSkeleton />
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
            total={rows.length}
            limit={limit}
            onPageChange={setPage}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
