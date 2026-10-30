import { LoaderCircle } from "lucide-react";

export function Spinner({ className = "size-5" }: { className?: string }) {
  return (
    <LoaderCircle
      aria-hidden="true"
      className={`shrink-0 animate-spin motion-reduce:animate-none ${className}`}
    />
  );
}
