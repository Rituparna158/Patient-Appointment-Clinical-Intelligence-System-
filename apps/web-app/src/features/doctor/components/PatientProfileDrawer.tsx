import { useEffect, useState } from "react"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet"

import { api } from "@/services/api"

import type { ConsultationNote,  } from "@/types/clinical.types"
import type { PatientProfileApiResponse,Patient, Props } from "@/types/patientProfile.types"



export default function PatientProfileDrawer({

  open,
  patientId,
  onClose

}: Props) {

  const [patient, setPatient] =
    useState<Patient | null>(null)

  const [consultations, setConsultations] =
    useState<ConsultationNote[]>([])

  const [loading, setLoading] =
    useState(false)


useEffect(() => {

  if (!patientId) return

  setLoading(true)

  api(`/clinical/doctor/patient/${patientId}`)

    .then((res) => {

      const response = res as PatientProfileApiResponse

      const data = response.data

      setPatient(data.patient)

      setConsultations(data.consultations)

    })

    .finally(() => setLoading(false))

}, [patientId])



  return (

    <Sheet
      open={open}
      onOpenChange={onClose}
    >

      <SheetContent className="w-[500px] flex flex-col h-full">

        <SheetHeader>

          <SheetTitle>
            Patient Profile
          </SheetTitle>

        </SheetHeader>


        {loading && (
          <p>Loading...</p>
        )}


        {patient && (

          <div className="flex flex-col flex-1 overflow-hidden mt-6">

  <div>
    <h3 className="font-semibold">Name</h3>
    <p>{patient.user.full_name}</p>
  </div>

  <div className="mt-2">
    <h3 className="font-semibold">Email</h3>
    <p>{patient.user.email}</p>
  </div>

  <div className="mt-6 flex flex-col flex-1 overflow-hidden">

    <h3 className="font-semibold mb-2">
      Consultation History
    </h3>

    <div className="flex-1 overflow-y-auto space-y-3 pr-2">

      {consultations.map((note, index) => (

        <div
          key={note.id}
          className={`border rounded p-3 ${
            index === 0 ? "bg-green-50 border-green-400" : ""
          }`}
        >

          {index === 0 && (
            <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
              Latest
            </span>
          )}

          <p>
            <strong>Symptoms:</strong> {note.symptoms}
          </p>

          <p>
            <strong>Diagnosis:</strong> {note.diagnosis}
          </p>

          <p>
            <strong>Prescription:</strong> {note.prescriptions}
          </p>

          <p className="text-xs text-gray-500">
            {new Date(note.createdAt).toLocaleString()}
          </p>

        </div>

      ))}

    </div>

  </div>

</div>

        )}

      </SheetContent>

    </Sheet>

  )

}
