import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth/auth.store';
import type { JSX } from 'react';
import type { Role } from '@/types/auth.types';

interface ProtectedRoutesProps {
  children: JSX.Element;
  allowedRoles?: Role[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRoutesProps) {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles &&
    !allowedRoles.some((role) => user.roles.includes(role))
  ) {
    return <Navigate to="/login" replace />;
  }

  return children;
}