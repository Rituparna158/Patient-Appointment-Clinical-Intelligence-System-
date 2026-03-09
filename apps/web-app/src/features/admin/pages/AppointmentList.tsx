import { useEffect } from "react"
import AppLayout from "@/app/layout/AppLayout"

import { useAppointmentStore } from "@/store/appointment/appointment.store"

import { DataTable } from "@/features/shared/table/components/DataTable"
import { TableSearch } from "@/features/shared/table/components/TableSearch"
import { TablePagination } from "@/features/shared/table/components/TablePagination"
import { TableFilters } from "@/features/shared/table/components/TableFilters"

import TableSkeleton from "@/features/shared/components/TableSkeleton"
import StatusBadge from "@/features/shared/components/StatusBadge"

import type { Appointment } from "@/types/appointment.types"

export default function AdminAppointments() {

  const {
    appointments,
    total,
    page,
    limit,
    search,
    status,
    fromDate,
    toDate,
    sortBy,
    sortOrder,
    loading,
    setSearch,
    setPage,
    setSort,
    setStatus,
    setDateRange,
    fetchAdminAppointments
  } = useAppointmentStore()

  useEffect(() => {
    fetchAdminAppointments()
  }, [page, search, status, fromDate, toDate, sortBy, sortOrder])

  const columns = [

    {
      key: "doctor",
      header: "Doctor",
      sortable: true,
      render: (row: Appointment) =>
        row.doctor?.user?.full_name ?? "-"
    },

    {
      key: "patient",
      header: "Patient",
      sortable: true,
      render: (row: Appointment) =>
        row.patient?.user?.full_name ?? "-"
    },

    {
      key: "date",
      header: "Date",
      sortable: true,
      render: (row: Appointment) =>
        row.slot?.slotDate ?? "-"
    },

    {
      key: "time",
      header: "Time",
      sortable: true,
      render: (row: Appointment) =>
        `${row.slot?.startTime} - ${row.slot?.endTime}`
    },

    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row: Appointment) =>
        <StatusBadge status={row.status}/>
    }

  ]

  return (

    <AppLayout>

      <div className="space-y-4">

        <TableSearch
          value={search}
          onChange={setSearch}
        />

        <TableFilters
          status={status}
          setStatus={setStatus}
          fromDate={fromDate}
          toDate={toDate}
          setFromDate={(v) => setDateRange(v, toDate)}
          setToDate={(v) => setDateRange(fromDate, v)}
        />

        {loading ? (

          <TableSkeleton/>

        ) : (

          <DataTable
            data={appointments}
            columns={columns}
            selected={[]}
            onSelect={() => {}}
            onSort={setSort}
            sortBy={sortBy}
            sortOrder={sortOrder}
          />

        )}

        <TablePagination
          page={page}
          total={total}
          limit={limit}
          onPageChange={setPage}
        />

      </div>

    </AppLayout>

  )
}
