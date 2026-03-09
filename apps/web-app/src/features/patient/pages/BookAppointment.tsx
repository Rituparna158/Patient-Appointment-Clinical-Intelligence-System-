import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/app/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AppointmentService } from '@/services/appointment.service';
import { useToast } from '@/hooks/use-toast';
import type {
  Doctor,
  Branch,
  Slot,
  Appointment,
} from '@/types/appointment.types';

export default function BookAppointment() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [doctorId, setDoctorId] = useState('');
  const [branchId, setBranchId] = useState('');
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    try {
      const doctorsData: Doctor[] = await AppointmentService.getDoctors();
      const branchesData: Branch[] = await AppointmentService.getBranches();

      setDoctors(doctorsData);
      setBranches(branchesData);
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load doctors or branches',
      });
    }
  }

  async function fetchSlots() {
    try {
      if (!doctorId || !date) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Please select doctor and date',
        });
        return;
      }

      const data: Slot[] = await AppointmentService.getAvailableSlots(
        doctorId,
        date
      );

      setSlots(data);
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch slots',
      });
    }
  }

  async function handleBook() {
    try {
      if (!selectedSlot || !doctorId || !branchId) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Please select doctor, branch and slot',
        });
        return;
      }

      const appointment: Appointment = await AppointmentService.book({
        doctorId,
        branchId,
        slotId: selectedSlot,
      });

      toast({
        title: 'Appointment Created',
        description: 'Redirecting to payment...',
      });

      navigate(`/patient/payment/${appointment.id}`);
    } catch {
      toast({
        variant: 'destructive',
        title: 'Booking Failed',
        description: 'Unable to create appointment',
      });
    }
  }

  return (
    <DashboardLayout>
      <Card className="form-card">
        <div className="form-header">
          <h2 className="form-title">Book Appointment</h2>
        </div>

        <div className="form-content space-y-4">
          <select
            className="border rounded-md p-2 w-full"
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
          >
            <option value="">Select Doctor</option>

            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                Dr. {doc.user.full_name} ({doc.specialization})
              </option>
            ))}
          </select>

          <select
            className="border rounded-md p-2 w-full"
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
          >
            <option value="">Select Branch</option>

            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>

          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <Button onClick={fetchSlots}>Check Available Slots</Button>

          {slots.length > 0 && (
            <div className="space-y-2 mt-4">
              {slots.map((slot) => (
                <label
                  key={slot.id}
                  className="flex items-center gap-2 border p-2 rounded-md cursor-pointer"
                >
                  <input
                    type="radio"
                    name="slot"
                    value={slot.id}
                    onChange={() => setSelectedSlot(slot.id)}
                  />
                  {new Date(`1970-01-01T${slot.startTime}`).toLocaleTimeString(
                    [],
                    {
                      hour: '2-digit',
                      minute: '2-digit',
                    }
                  )}
                </label>
              ))}
            </div>
          )}

          <Button onClick={handleBook} className="mt-4">
            Proceed to Payment
          </Button>
        </div>
      </Card>
    </DashboardLayout>
  );
}
