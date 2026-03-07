import { useEffect, useMemo, useState } from 'react';
import { ClinicalService } from '@/services/clinical.service';

import { DataTable } from '@/features/shared/table/components/DataTable';
import { TableSearch } from '@/features/shared/table/components/TableSearch';
import { TablePagination } from '@/features/shared/table/components/TablePagination';

import type { ConsultationNote } from '@/features/clinical/types/clinical.types';
import ConsultationDrawer from '@/features/shared/components/consultationDrawer';
import AppLayout from '@/app/layout/AppLayout';
import { Button } from '@/components/ui/button';

export default function MedicalTimeline() {
  const [records, setRecords] = useState<ConsultationNote[]>([]);
  const [search, setSearch] = useState('');
  
  const [drawer, setDrawer] = useState(false);
    const [page, setPage] = useState(1);
    const limit = 10;
  const [total] = useState(0);
  const [selected, setSelected] = useState<ConsultationNote | null>(null);

  useEffect(() => {
    async function load() {
      const res = await ClinicalService.getPatientTimeline(page, limit);
      setRecords(res.data ?? []);
      //setTotal(res.data?.count ?? 0);
    }

    load();
  }, []);

  const filtered = useMemo(() => {
    return records.filter((r) =>
      r.appointment?.doctor?.user?.full_name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [records, search]);

  const columns = [
    {
      header: 'Doctor',
      render: (row: ConsultationNote) =>
        row.appointment?.doctor?.user?.full_name ?? '-',
    },
    {
      header: 'Date',
      render: (row: ConsultationNote) => row.appointment?.slot?.slotDate ?? '-',
    },
    {
      header: 'Diagnosis',
      render: (row: ConsultationNote) => row.diagnosis ?? '-',
    },
    {
      header: 'Record',
      render: (row: ConsultationNote) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setSelected(row);
            setDrawer(true);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Medical Timeline</h1>

        <TableSearch value={search} onChange={setSearch} />

        <DataTable columns={columns} data={filtered} />

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
        </div>
    </AppLayout>
  );
}
