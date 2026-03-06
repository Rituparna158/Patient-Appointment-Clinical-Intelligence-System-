import { useEffect, useState } from "react"

import AppLayout from "@/app/layout/AppLayout"

import PageHeader from "@/features/shared/components/PageHeader"
import EmptyState from "@/features/shared/components/EmptyState"

import { DataTable } from "@/features/shared/table/components/DataTable"
import { TablePagination } from "@/features/shared/table/components/TablePagination"
import { TableSearch } from "@/features/shared/table/components/TableSearch"

import ConsultationDrawer from "@/features/shared/components/consultationDrawer"

import { useClinicalStore } from "@/features/clinical/store/clinical.store"

import type { ConsultationNote } from "@/features/clinical/types/clinical.types"

import { Button } from "@/components/ui/button"

export default function AdminClinicalRecords() {

  const {
    notes,
    fetchAdminRecords,
    page,
    limit,
    total,
    setPage,
    search,
    setSearch,
  } = useClinicalStore()

  const [drawer, setDrawer] = useState(false)

  const [selected, setSelected] =
    useState<ConsultationNote | null>(null)

  useEffect(() => {
    fetchAdminRecords()
  }, [page, search])

  const columns = [

    {
      header: "Date",
      render: (row: ConsultationNote) =>
        row.appointment.slot.slotDate
    },

    {
      header: "Patient",
      render: (row: ConsultationNote) =>
        row.appointment.patient.user.full_name
    },

    {
      header: "Doctor",
      render: (row: ConsultationNote) =>
        `Dr. ${row.appointment.doctor.user.full_name}`
    },

    {
      header: "Diagnosis",
      render: (row: ConsultationNote) =>
        row.diagnosis
    },

    {
      header: "Record",
      render: (row: ConsultationNote) => (

        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setSelected(row)
            setDrawer(true)
          }}
        >
          View Record
        </Button>

      )
    }

  ]

  return (

    <AppLayout>

      <PageHeader
        title="Clinical Records"
        description="All hospital consultation records"
      />

      <div className="mt-6">

        <TableSearch
          value={search}
          onChange={setSearch}
          placeholder="Search patient..."
        />

      </div>

      <div className="mt-6 border rounded-xl p-4">

        {notes.length === 0 ? (

          <EmptyState message="No clinical records available" />

        ) : (

          <DataTable
            data={notes}
            columns={columns}
          />

        )}

      </div>

      <div className="mt-4">

        <TablePagination
          page={page}
          total={total}
          limit={limit}
          onPageChange={setPage}
        />

      </div>

      <ConsultationDrawer
        open={drawer}
        consultation={selected}
        onClose={() => setDrawer(false)}
      />

    </AppLayout>

  )

}

