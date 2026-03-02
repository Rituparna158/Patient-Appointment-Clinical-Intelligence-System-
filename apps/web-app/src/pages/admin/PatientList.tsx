import { useEffect, useState } from "react";
import DashboardLayout from "@/app/layout/AppLayout";
import { PatientService } from "@/services/patient.service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { PatientProfile } from "@/types/patient.types";

export default function PatientList() {
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  async function fetchPatients() {
    const data = await PatientService.search({
      search,
      page,
      limit: 5,
    });

    setPatients(data.patients);
    setTotal(data.total);
  }

  useEffect(() => {
    fetchPatients();
  }, [page]);

  return (
    <DashboardLayout>
      <h2 className="page-heading">Patients</h2>

      <div className="flex gap-3 mt-6">
        <Input
          placeholder="Search by address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button onClick={() => fetchPatients()}>
          Search
        </Button>
      </div>

      <div className="mt-6 space-y-4">
        {patients.map((p) => (
          <div
            key={p.id}
            className="p-4 border border-border rounded-md"
          >
            <p><b>Address:</b> {p.address}</p>
            <p><b>Emergency Contact:</b> {p.emergencyContact}</p>
            <p><b>Status:</b> {p.isActive ? "Active" : "Inactive"}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-6 items-center">
        <Button
          onClick={() => setPage((prev) => prev - 1)}
          disabled={page === 1}
        >
          Prev
        </Button>

        <span>Page {page}</span>

        <Button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={patients.length < 5}
        >
          Next
        </Button>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        Total Patients: {total}
      </p>
    </DashboardLayout>
  );
}