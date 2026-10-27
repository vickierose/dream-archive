import { Search } from "lucide-react";
import { TextField } from "@/components/ui/text-field";
import type { ComponentProps } from "react";

export function SearchField({ label, ...props }: { label: string } & Pick<ComponentProps<"input">, "defaultValue" | "value" | "onChange">) {
  return (
    <TextField
      id="archive-search"
      name="q"
      type="search"
      label={label}
      hideLabel
      placeholder={label}
      {...props}
      leadingIcon={<Search size={18} />}
      wrapperClassName="min-w-0 flex-1 basis-full sm:basis-0"
    />
  );
}
