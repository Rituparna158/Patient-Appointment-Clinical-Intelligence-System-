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
  const [patient, setPatient] = useState<Patient | null>(null)
  const [consultations, setConsultations] = useState<ConsultationNote[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open || !patientId) return

    let ignore = false

    async function fetchProfile() {
      setLoading(true)

      try {
        const res = await api(`/clinical/doctor/patient/${patientId}`) as PatientProfileApiResponse

        if (!ignore) {
          setPatient(res.data.patient)
          setConsultations(res.data.consultations)
        }
      } catch (error) {
        if (!ignore) {
          setPatient(null)
          setConsultations([])
          console.error("Failed to fetch patient profile:", error)
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    fetchProfile()

    return () => {
      ignore = true
    }
  }, [open, patientId])

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose()
      }}
    >
      <SheetContent className="w-[500px] flex flex-col h-full">
        <SheetHeader>
          <SheetTitle>Patient Profile</SheetTitle>
        </SheetHeader>

        {loading && <p className="mt-4">Loading...</p>}

        {!loading && patient && (
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
                {consultations.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No consultations found.
                  </p>
                )}

                {consultations.map((note, index) => (
                  <div
                    key={note.id}
                    className={`border rounded p-3 ${
                      index === 0 ? "bg-muted border-primary/40" : "bg-card border-border"
                    }`}
                  >
                    {index === 0 && (
                      <span className="inline-block text-xs bg-primary text-primary-foreground px-2 py-1 rounded mb-2">
                        Latest
                      </span>
                    )}

                    <p className="text-sm text-forground">
                      <strong>Symptoms:</strong> {note.symptoms}
                    </p>

                    <p className="text-sm text-forground">
                      <strong>Diagnosis:</strong> {note.diagnosis}
                    </p>

                    <p className="text-sm text-forground">
                      <strong>Prescription:</strong> {note.prescriptions}
                    </p>

                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(note.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!loading && !patient && (
          <p className="mt-4 text-sm text-muted-foreground">
            Patient data not available.
          </p>
        )}
      </SheetContent>
    </Sheet>
  )
}
