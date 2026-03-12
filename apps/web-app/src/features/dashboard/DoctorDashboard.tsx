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

import type { DoctorUpcomingAppointment } from "../../types/dashboard.types"

export default function DoctorDashboard() {

  const {
    doctorDashboard,
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

    fetchDoctorDashboard
  } = useDashboardStore()

  useEffect(() => {

    fetchDoctorDashboard()

  }, [])

  const counters = doctorDashboard?.counters

  const rows = doctorDashboard?.upcoming ?? []

  const columns = [

    {
      key: "patientName",
      header: "Patient",
      sortable: true,
      render: (row: DoctorUpcomingAppointment) =>
        row.patientName
    },

    {
      key: "slotDate",
      header: "Date",
      sortable: true,
      render: (row: DoctorUpcomingAppointment) =>
        new Date(row.slotDate).toLocaleDateString()
    },

    {
      key: "startTime",
      header: "Time",
      sortable: false,
      render: (row: DoctorUpcomingAppointment) =>
        row.startTime
    },

    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row: DoctorUpcomingAppointment) =>
        <StatusBadge status={row.status}/>
    }

  ]

  return (

    <DashboardLayout>

      <div className="space-y-6">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div>

            <h1 className="text-xl font-semibold">
              Doctor Dashboard
            </h1>

            <p className="text-sm text-muted-foreground">
              Overview of appointments and schedule
            </p>

          </div>

          <ExportButton/>

        </div>

        {counters && (

          <DoctorDashboardCounters data={doctorDashboard.counters}/>

        )}

        {/* TABLE */}

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


