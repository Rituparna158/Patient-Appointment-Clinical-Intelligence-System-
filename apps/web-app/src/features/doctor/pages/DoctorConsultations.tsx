import { useEffect, useState } from "react"
import { useClinicalStore } from "@/store/clinical/clinical.store"

import { DataTable } from "@/features/shared/table/components/DataTable"
import { TablePagination } from "@/features/shared/table/components/TablePagination"
import { TableSearch } from "@/features/shared/table/components/TableSearch"
import { TableFilters } from "@/features/shared/table/components/TableFilters"

import TableSkeleton from "@/features/shared/components/TableSkeleton"
import { Button } from "@/components/ui/button"

import PatientProfileDrawer from "../components/PatientProfileDrawer"

import AppLayout from "@/app/layout/AppLayout"

import type { ConsultationNote } from "@/types/clinical.types"

export default function DoctorConsultationsPage() {

  const {

    notes,
    total,
    page,
    limit,
    search,
    from,
    to,
    sortBy,
    sortOrder,

    setPage,
    setSearch,
    setFrom,
    setTo,
    setSort,

    fetchDoctorConsultations

  } = useClinicalStore()

  const [loading, setLoading] = useState(false)

  const [patientId, setPatientId] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {

    setLoading(true)

    fetchDoctorConsultations()
      .finally(() => setLoading(false))

  }, [page, search, from, to, sortBy, sortOrder])


  const openProfile = (row: ConsultationNote) => {

    const id = row.appointment?.patient?.id

    if (!id) return

    setPatientId(id)
    setDrawerOpen(true)

  }


  const columns = [

    {
      key: "patient",
      header: "Patient",
      sortable: true,
      render: (row: ConsultationNote) =>
        row.appointment?.patient?.user?.full_name ?? "-"
    },

    {
      key: "doctor",
      header: "Doctor",
      sortable: true,
      render: (row: ConsultationNote) =>
        row.appointment?.doctor?.user?.full_name ?? "-"
    },

    {
      key: "slot",
      header: "Slot",
      sortable: true,
      render: (row: ConsultationNote) =>

        row.appointment?.slot
          ? `${row.appointment.slot.slotDate}
            ${row.appointment.slot.startTime}-${row.appointment.slot.endTime}`
          : "-"
    },

    {
      key: "createdAt",
      header: "Created At",
      sortable: true,
      render: (row: ConsultationNote) =>
        new Date(row.createdAt).toLocaleString()
    },

    {
      key: "actions",
      header: "Actions",
      render: (row: ConsultationNote) => (

        <Button
          size="sm"
          onClick={() => openProfile(row)}
        >
          View Profile
        </Button>

      )
    }

  ]


  return (

    <AppLayout>

      <div className="page-container">

        <h1 className="page-heading">
          Doctor Consultations
        </h1>

        <div className="flex gap-4 my-4">

          <TableSearch
            value={search}
            onChange={setSearch}
          />

          <TableFilters
            fromDate={from}
            toDate={to}
            setFromDate={setFrom}
            setToDate={setTo}
          />

        </div>


        {loading ? (

          <TableSkeleton/>

        ) : (

          <DataTable
            data={notes}
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


        <PatientProfileDrawer
          open={drawerOpen}
          patientId={patientId}
          onClose={() => setDrawerOpen(false)}
        />

      </div>

    </AppLayout>

  )

}


