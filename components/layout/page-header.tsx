import { ReactNode } from "react";
import { Heading } from "@/components/ui/heading";

type PageHeaderProps = {
  title: ReactNode;
  action?: ReactNode;
  description?: ReactNode;
  prefix?: ReactNode;
};

export function PageHeader({
  title,
  action,
  description,
  prefix,
}: PageHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        {prefix}
        <div>
          <Heading as="h1">{title}</Heading>
          {description && (
            <p className="mt-1 font-base text-sm text-ink-soft">
              {description}
            </p>
          )}
        </div>
      </div>

      {action}
    </header>
  );
}
