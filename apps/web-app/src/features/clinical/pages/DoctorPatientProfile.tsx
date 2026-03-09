import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import AppLayout from "@/app/layout/AppLayout"
import { ClinicalService } from "@/services/clinical.service"

import { DataTable } from "@/features/shared/table/components/DataTable"
import TableSkeleton from "@/features/shared/components/TableSkeleton"
import type { ConsultationRow } from "../../../types/clinical.types"


export default function DoctorPatientProfile() {

  const { patientId } = useParams()

  const [loading, setLoading] = useState(true)

  const [patient, setPatient] = useState<any>(null)

  const [consultations, setConsultations] = useState<ConsultationRow[]>([])

  useEffect(() => {

    if (!patientId) return

    ClinicalService
      .getPatientProfile(patientId)
      .then((data) => {

        setPatient(data.patient)

        setConsultations(data.consultations)

      })
      .finally(() => setLoading(false))

  }, [patientId])

  const columns = [

    {
      key: "date",
      header: "Date",
      render: (row: ConsultationRow) =>
        row.appointment?.slot?.slotDate ?? "-"
    },

    {
      key: "time",
      header: "Time",
      render: (row: ConsultationRow) =>
        row.appointment?.slot
          ? `${row.appointment.slot.startTime} - ${row.appointment.slot.endTime}`
          : "-"
    },

    {
      key: "symptoms",
      header: "Symptoms",
      render: (row: ConsultationRow) =>
        row.symptoms
    },

    {
      key: "diagnosis",
      header: "Diagnosis",
      render: (row: ConsultationRow) =>
        row.diagnosis
    },

    {
      key: "prescriptions",
      header: "Prescription",
      render: (row: ConsultationRow) =>
        row.prescriptions
    }

  ]

  return (

    <AppLayout>

      <div className="space-y-6">

        {loading ? (

          <TableSkeleton/>

        ) : (

          <>

            <div className="border rounded-lg p-4 bg-white">

              <h2 className="text-lg font-semibold">
                Patient Profile
              </h2>

              <div className="mt-3">

                <p>
                  <strong>Name:</strong> {patient?.user?.full_name}
                </p>

                <p>
                  <strong>Email:</strong> {patient?.user?.email}
                </p>

              </div>

            </div>

            <div>

              <h2 className="text-lg font-semibold mb-2">
                Consultation History
              </h2>

              <DataTable
                data={consultations}
                columns={columns}
                selected={[]}
                onSelect={() => {}}
              />

            </div>

          </>

        )}

      </div>

    </AppLayout>

  )

}