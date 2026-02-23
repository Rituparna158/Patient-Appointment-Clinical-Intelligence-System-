import type { ReactNode } from "react";

interface Props {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}

export default function FormField({
  label,
  required,
  error,
  children,
}: Props) {
  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>

      {children}

      {error && (
        <p className="text-sm text-destructive mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
