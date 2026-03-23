import { useEffect, useState } from "react"
import { useClinicalStore } from "@/store/clinical/clinical.store"
import { DataTable } from "@/features/shared/table/components/DataTable"
import { TablePagination } from "@/features/shared/table/components/TablePagination"
import { TableSearch } from "@/features/shared/table/components/TableSearch"
import TableSkeleton from "@/features/shared/components/TableSkeleton"
import { TableFilters } from "@/features/shared/table/components/TableFilters"
import AppLayout from "@/app/layout/AppLayout"
import type { ConsultationNote } from "@/types/clinical.types"
import { Button } from "@/components/ui/button"
import ConsultationDrawer from "@/features/shared/components/consultationDrawer"

export default function AdminRecordsPage() {
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
    loading,
    setPage,
    setSearch,
    setFrom,
    setTo,
    setSort,
    fetchAdminRecords
  } = useClinicalStore()

   const [selectedNote, setSelectedNote] = useState<ConsultationNote | null>(null)
    const [drawerOpen, setDrawerOpen] = useState(false)
  

  useEffect(() => {
    
    fetchAdminRecords()
  }, [fetchAdminRecords,page, search,from, to, sortBy, sortOrder])

  const openDrawer = (note: ConsultationNote) => {

    setSelectedNote(note)

    setDrawerOpen(true)

  }

  const columns = [

  {
    key: "patient",
    header: "Patient",
    render: (row: typeof notes[0]) =>
      row.appointment?.patient?.user?.full_name ?? "-",
    sortable: true
  },

  {
    key: "doctor",
    header: "Doctor",
    render: (row: typeof notes[0]) =>
      row.appointment?.doctor?.user?.full_name ?? "-",
    sortable: true,
  },

  {
    key: "slot",
    header: "Slot",
    sortable: true,
    render: (row: typeof notes[0]) => 

      row.appointment?.slot ?
      `${row.appointment.slot.slotDate} 
      ${row.appointment.slot.startTime}-${row.appointment.slot.endTime}`
      : "-"
  },
  {
    key: "createdAt",
    header: "Created At",
    sortable: true,
    render: (row: typeof notes[0]) =>
      new Date(row.createdAt).toLocaleString()
  },
  {
      key: "actions",
      header: "Actions",
      render: (row: typeof notes[0]) => (

        <Button
          size="sm"
          onClick={() => openDrawer(row)}
        >
          View
        </Button>

      )
    }

]



  return (
    <AppLayout>
    <div className="page-container">
      <h1 className="page-heading">Admin Clinical Records</h1>

      <div className="flex gap-4 my-4">
        <TableSearch value={search} onChange={setSearch} />
        <TableFilters
          fromDate={from}
          toDate={to}
          setFromDate={setFrom}
          setToDate={setTo}
        />
      </div>

      {loading ? <TableSkeleton /> : (
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

      <ConsultationDrawer
        open={drawerOpen}
        consultation={selectedNote}
         onClose={() => setDrawerOpen(false)}
        />
      
    </div>
    </AppLayout>
  )
}
