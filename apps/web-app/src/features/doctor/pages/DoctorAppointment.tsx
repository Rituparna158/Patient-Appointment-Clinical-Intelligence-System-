import { useEffect, useState } from "react"
import AppLayout from "@/app/layout/AppLayout"

import { useAppointmentStore } from "@/store/appointment/appointment.store"
import { AppointmentService } from "@/services/appointment.service"

import { DataTable } from "@/features/shared/table/components/DataTable"
import { TableSearch } from "@/features/shared/table/components/TableSearch"
import { TableFilters } from "@/features/shared/table/components/TableFilters"
import { TablePagination } from "@/features/shared/table/components/TablePagination"

import TableSkeleton from "@/features/shared/components/TableSkeleton"
import StatusBadge from "@/features/shared/components/StatusBadge"

import { Button } from "@/components/ui/button"
import ConsultationModal from "../components/consultationModal"

import type { Appointment } from "@/types/appointment.types"

export default function DoctorAppointments() {

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
    setStatus,
    setDateRange,
    setPage,
    setSort,

    fetchDoctorAppointments

  } = useAppointmentStore()

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null)

  useEffect(() => {

    fetchDoctorAppointments()

  }, [
    fetchDoctorAppointments,
    page,
    search,
    status,
    fromDate,
    toDate,
    sortBy,
    sortOrder
  ])

  const handleComplete = async (id: string) => {

    await AppointmentService.updateStatus(id, "completed")

    fetchDoctorAppointments()

  }

  const handleCancel = async (id: string) => {

    await AppointmentService.cancelWithRefund(id)

    fetchDoctorAppointments()

  }

  const openConsultation = (id: string) => {

    setSelectedAppointmentId(id)

    setModalOpen(true)

  }

  const columns = [

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
        row.slot
          ? `${row.slot.startTime} - ${row.slot.endTime}`
          : "-"
    },

    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row: Appointment) =>
        <StatusBadge status={row.status}/>
    },

    {
      key: "actions",
      header: "Actions",

      render: (row: Appointment) => {

        if (row.status === "confirmed") {

          return (

            <div className="flex gap-2">

              <Button
                size="sm"
                onClick={() => handleComplete(row.id)}
              >
                Complete
              </Button>

              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleCancel(row.id)}
              >
                Cancel
              </Button>

            </div>

          )
        }

        if (row.status === "completed") {

          return (

            <Button
              size="sm"
              onClick={() => openConsultation(row.id)}
            >
              Add Note
            </Button>

          )
        }

        return "-"

      }

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

        <ConsultationModal
          open={modalOpen}
          appointmentId={selectedAppointmentId}
          onClose={() => setModalOpen(false)}
        />

      </div>

    </AppLayout>

  )
}

