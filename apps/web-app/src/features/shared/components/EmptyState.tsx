import type { EmptyStateProps } from "../types/shared.types";
export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex justify-center py-10 text-muted-foreground">
      {message}
    </div>
  );
}
