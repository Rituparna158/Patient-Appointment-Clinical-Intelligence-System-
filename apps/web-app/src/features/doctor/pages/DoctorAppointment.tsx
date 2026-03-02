import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { AppointmentService } from "@/services/appointment.service";
import { useToast } from "@/hooks/use-toast";
import type { Appointment } from "@/types/appointment.types";
import AppLayout from "@/app/layout/AppLayout";

export default function DoctorAppointments() {
  const { toast } = useToast();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [todayFilter, setTodayFilter] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");

  async function fetchAppointments() {
    try {
      const res = await AppointmentService.getDoctorAppointments();
      setAppointments(res.data.rows ?? []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load appointments";
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAppointments();
  }, []);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appt) => {
      const matchesStatus =
        statusFilter === "all" ? true : appt.status === statusFilter;

      const matchesSearch = appt.Patient?.user?.full_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      let matchesToday = true;
      if (todayFilter) {
        const todayDate = new Date().toISOString().split("T")[0];
        matchesToday = appt.slot?.slotDate === todayDate;
      }

      return matchesStatus && matchesSearch && matchesToday;
    });
  }, [appointments, statusFilter, searchTerm, todayFilter]);

  async function updateStatus(id: string, status: string) {
    try {
      await AppointmentService.changeStatus(id, status);
      toast({ title: "Status updated" });
      fetchAppointments();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update";
      toast({ variant: "destructive", title: "Error", description: message });
    }
  }

  return (
    <AppLayout>
      <h2 className="page-heading">My Appointments</h2>

      {/* FILTERS */}
      <div className="mt-4 flex flex-wrap gap-4">
        {/* Search by patient */}
        <Input
          placeholder="Search by patient..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />

        {/* Status */}
        <div className="w-48">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>

            <SelectContent className="select-content-fix">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="requested">Requested</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="missed">Missed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Today */}
        <Button
          variant={todayFilter ? "destructive" : "outline"}
          onClick={() => setTodayFilter((prev) => !prev)}
        >
          {todayFilter ? "Showing Today Only" : "Show Today"}
        </Button>
      </div>

      {/* TABLE */}
      <div className="mt-6 bg-card border border-border rounded-xl shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="space-y-2 p-4">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredAppointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No appointments found
                </TableCell>
              </TableRow>
            ) : (
              filteredAppointments.map((appt) => (
                <TableRow key={appt.id}>
                  <TableCell>
                    {appt.Patient?.user?.full_name ?? "-"}
                  </TableCell>

                  <TableCell>
                    {appt.Patient?.user?.email ?? "-"}
                  </TableCell>

                  <TableCell>
                    {appt.slot?.slotDate ?? "-"} <br />
                    {appt.slot?.startTime ?? ""} - {appt.slot?.endTime ?? ""}
                  </TableCell>

                  <TableCell>
                    <Badge className={`status-${appt.status}`}>
                      {appt.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline">
                      {appt.paymentStatus}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {appt.status === "confirmed" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            updateStatus(appt.id, "completed")
                          }
                        >
                          Complete
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            updateStatus(appt.id, "cancelled")
                          }
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
}