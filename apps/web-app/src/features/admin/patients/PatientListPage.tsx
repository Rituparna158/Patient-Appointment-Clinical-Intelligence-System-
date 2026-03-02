import { useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { usePatientStore } from "./store/patient.store"
import { DataTable } from "@/features/shared/table/components/DataTable"
import { TableSearch } from "@/features/shared/table/components/TableSearch"
import { TablePagination } from "@/features/shared/table/components/TablePagination"
import type { Patient } from "./types/patient.types"

export default function PatientListPage() {
  const {
    patients,
    total,
    page,
    limit,
    search,
    loading,
    setPage,
    setSearch,
    fetchPatients,
  } = usePatientStore()

  useEffect(() => {
      fetchPatients()
  }, [page,search])

  const columns = [
    {
      header: "Name",
      render: (p: Patient) => p.user.full_name,
    },
    {
      header: "Email",
      render: (p: Patient) => p.user.email,
    },
    {
      header: "Address",
      render: (p: Patient) => p.address ?? "-",
    },
    {
      header: "Emergency",
      render: (p: Patient) => p.emergencyContact,
    },
    {
      header: "Status",
      render: (p: Patient) => (
        <Badge variant={p.isActive ? "default" : "destructive"}>
          {p.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ]

  return (
    <div className="page-container space-y-6">

      <TableSearch
        value={search}
        onChange={(value) => {
          setSearch(value)

        }}
        placeholder="Search by name or email"
      />

      {loading ? (
        <div className="text-muted-foreground text-sm">
          Loading patients...
        </div>
      ) : (
        <DataTable data={patients} columns={columns} />
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
