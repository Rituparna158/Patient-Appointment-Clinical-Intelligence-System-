import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { useDoctorStore } from "@/store/doctor/doctor.store";
import { DataTable } from "@/features/shared/table/components/DataTable";
import { TableSearch } from "@/features/shared/table/components/TableSearch";
import { TablePagination } from "@/features/shared/table/components/TablePagination";
import type { Doctor } from "@/types/doctor.types";
import type { Column } from "@/features/shared/types/DataTable.types";
 
export default function DoctorListPage() {
  const {
    doctors,
    total,
    page,
    limit,
    search,
    loading,
    setPage,
    setSearch,
    fetchDoctors,
  } = useDoctorStore();
 
  useEffect(() => {
    fetchDoctors();
  }, [page, limit, search, fetchDoctors]);
 
  const columns: Column<Doctor>[] = [
    {
      key: "name",
      header: "Name",
      render: (doctor) => doctor.user.full_name,
    },
    {
      key: "email",
      header: "Email",
      render: (doctor) => doctor.user.email,
    },
    {
      key: "specialization",
      header: "Specialization",
      render: (doctor) => doctor.specialization,
    },
    {
      key: "consultation_fee",
      header: "Consultation Fee",
      render: (doctor) => doctor.consultation_fee ?? "-",
    },
    {
      key: "status",
      header: "Status",
      render: (doctor) => (
        <Badge variant={doctor.is_active ? "default" : "destructive"}>
          {doctor.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ];
 
  return (
    <div className="page-container space-y-6">
      <TableSearch
        value={search}
        onChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
      />
 
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading doctors...</div>
      ) : (
        <DataTable<Doctor>
          data={doctors}
          columns={columns}
          selected={[]}
          onSelect={() => {}}
        />
      )}
 
      <TablePagination
        page={page}
        total={total}
        limit={limit}
        onPageChange={setPage}
      />
    </div>
  );
}
 