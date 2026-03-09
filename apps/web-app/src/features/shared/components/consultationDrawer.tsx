import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

import type { ConsultationNote } from '@/types/clinical.types';

interface Props {
  open: boolean;
  consultation: ConsultationNote | null;
  onClose: () => void;
}

export default function ConsultationDrawer({
  open,
  consultation,
  onClose,
}: Props) {
  if (!consultation) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[420px]">
        <SheetHeader>
          <SheetTitle>Consultation Details</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 mt-6">
          <div>
            <strong>Patient</strong>
            <div>{consultation.appointment.patient.user.full_name}</div>
          </div>

          <div>
            <strong>Doctor</strong>
            <div>Dr. {consultation.appointment.doctor.user.full_name}</div>
          </div>

          <div>
            <strong>Symptoms</strong>
            <div>{consultation.symptoms}</div>
          </div>

          <div>
            <strong>Diagnosis</strong>
            <div>{consultation.diagnosis}</div>
          </div>

          <div>
            <strong>Prescription</strong>
            <div>{consultation.prescriptions}</div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
