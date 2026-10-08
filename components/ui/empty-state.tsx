import { MoonStar } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex min-h-[50dvh] flex-col items-center justify-center gap-3 px-4 py-12 text-center font-base">
      <MoonStar aria-hidden="true" size={32} className="text-ink" />
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      {description && (
        <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
          {description}
        </p>
      )}
    </div>
  );
}
