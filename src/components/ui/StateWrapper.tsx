import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface StateWrapperProps {
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
  emptyMessage?: string;
  children: ReactNode;
}

export default function StateWrapper({
  isLoading,
  error,
  isEmpty,
  emptyMessage = "No data found.",
  children,
}: StateWrapperProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-blue-500">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 p-4 border border-red-900/50 bg-red-900/10 rounded-lg text-sm text-center">
        {error}
      </div>
    );
  }

  if (isEmpty) {
    return <div className="text-muted text-center py-8">{emptyMessage}</div>;
  }

  return <>{children}</>;
}
