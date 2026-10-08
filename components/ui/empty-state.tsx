import { MoonStar } from "lucide-react";
import { ReactNode } from "react";
import { Heading } from "@/components/ui/heading";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-[50dvh] flex-col items-center justify-center gap-3 px-4 py-12 text-center font-base">
      <MoonStar aria-hidden="true" size={32} className="text-ink" />
      <Heading as="h2" size="subsection">
        {title}
      </Heading>
      {description && (
        <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
