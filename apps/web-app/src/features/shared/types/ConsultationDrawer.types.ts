import type { ConsultationNote } from '@/types/clinical.types';

export interface ConsultationDrawerProps {
  open: boolean;
  consultation: ConsultationNote | null;
  onClose: () => void;
}
