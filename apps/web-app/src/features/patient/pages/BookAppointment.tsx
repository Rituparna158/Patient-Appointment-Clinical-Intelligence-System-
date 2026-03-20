import { useCallback, useEffect, useState } from 'react';
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
import FormField from '@/components/ui/FormField';

export default function BookAppointment() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [doctorId, setDoctorId] = useState('');
  const [branchId, setBranchId] = useState('');
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);

    const loadInitialData = useCallback(async () => {
    try {
      const [doctorsData, branchesData] = await Promise.all([
        AppointmentService.getDoctors(),
        AppointmentService.getBranches(),
      ]);

      setDoctors(doctorsData);
      setBranches(branchesData);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to load doctors or branches',
      });
    }
  }, [toast]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  async function fetchSlots() {
    try {
      if (!doctorId || !branchId || !date) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Please select doctor, branch and date',
        });
        return;
      }

      setLoadingSlots(true);
      setSelectedSlot('');

      const data: Slot[] = await AppointmentService.getAvailableSlots(
        doctorId,
        branchId,
        date
      );

      setSlots(data);

      if (data.length === 0) {
        toast({
          title: 'No slots found',
          description: 'No available slots for selected doctor, branch and date',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to fetch slots',
      });
    } finally {
      setLoadingSlots(false);
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

      setBooking(true);

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
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Booking Failed',
        description:
          error instanceof Error ? error.message : 'Unable to create appointment',
      });
    } finally {
      setBooking(false);
    }
  }

  return (
    <DashboardLayout>
      <Card className="form-card">
        <div className="form-header">
          <h2 className="form-title">Book Appointment</h2>
        </div>

        <div className="form-content space-y-4">
          <FormField
              label="Select Your Preffered Doctor"
              required  
          >
          <select
            className="border rounded-md p-2 w-full"
            value={doctorId}
            onChange={(e) => {
              setDoctorId(e.target.value);
              setSlots([]);
              setSelectedSlot('');
            }}
          >
            
            <option value="">Select Doctor</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                Dr. {doc.user.full_name} ({doc.specialization})
              </option>
            ))}
          </select>
          </FormField>

          <FormField
              label="Select Your Preffered Branch"
              required  
          >
          <select
            className="border rounded-md p-2 w-full"
            value={branchId}
            onChange={(e) => {
              setBranchId(e.target.value);
              setSlots([]);
              setSelectedSlot('');
            }}
          >
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
          </FormField>

          <FormField
              label="Select Slot Date"
              required  
          >
          <Input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setSlots([]);
              setSelectedSlot('');
            }}
          />
          </FormField>

          <Button onClick={fetchSlots} disabled={loadingSlots}>
            {loadingSlots ? 'Loading Slots...' : 'Check Available Slots'}
          </Button>

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
                    checked={selectedSlot === slot.id}
                    onChange={() => setSelectedSlot(slot.id)}
                  />
                  {new Date(`1970-01-01T${slot.startTime}`).toLocaleTimeString(
                    [],
                    {
                      hour: '2-digit',
                      minute: '2-digit',
                    }
                  )}
                  {' - '}
                  {new Date(`1970-01-01T${slot.endTime}`).toLocaleTimeString(
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

          <Button onClick={handleBook} className="mt-4" disabled={booking}>
            {booking ? 'Booking...' : 'Proceed to Payment'}
          </Button>
        </div>
      </Card>
    </DashboardLayout>
  );
}




