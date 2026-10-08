import { ReactNode } from "react";

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
    <header className="flex flex-col gap-5 pb-8 sm:flex-row sm:items-baseline sm:justify-between">
      <div className="flex gap-4 items-center">
        {prefix}
        <div>
          <h1 className="font-handwritten text-4xl leading-none text-ink sm:text-5xl">
            {title}
          </h1>
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
