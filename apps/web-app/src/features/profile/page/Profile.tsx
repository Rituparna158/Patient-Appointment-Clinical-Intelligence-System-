import { useEffect, useState } from 'react';
import DashboardLayout from '@/app/layout/AppLayout';
import { api } from '@/services/api';
import { Avatar } from '@radix-ui/react-avatar';
import { Card } from '@/components/ui/card';
import { AvatarFallback } from '@/components/ui/avatar';

export default function Profile() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchProfile() {
      const res = await api('/auth/me');

      setUser(res);
    }

    fetchProfile();
  }, []);

  if (!user)
    return (
      <DashboardLayout>
        <div className="p-6">Loading...</div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <h1 className="text-2xl font-semibold">My Profile</h1>

        <Card className="mt-6 p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback>{user.full_name?.charAt(0)}</AvatarFallback>
            </Avatar>

            <div>
              <h2 className="text-lg font-medium">{user.full_name}</h2>

              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-8">
            <div className="profile-item">
              <label>Phone</label>
              <p>{user.phone ?? '-'}</p>
            </div>

            <div className="profile-item">
              <label>Gender</label>
              <p>{user.gender ?? '-'}</p>
            </div>

            <div className="profile-item">
              <label>Date of Birth</label>
              <p>{user.date_of_birth ?? '-'}</p>
            </div>

            <div className="profile-item">
              <label>Role</label>
              <p className="capitalize">{user.role}</p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
