"use client";

import Form from "next/form";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { SearchField } from "@/components/ui/search-field";
import { Button } from "@/components/ui/button";
import { Mood } from "@/types/dream";
import type { Symbol } from "@/types/symbol";

export function ArchiveFilters({
  path,
  query,
  moods = [],
  symbols = [],
  availableSymbols,
}: {
  path: string;
  query: string;
  moods?: string[];
  symbols?: string[];
  availableSymbols?: Symbol[];
}) {
  const t = useTranslations();
  const router = useRouter();
  const [search, setSearch] = useState(query);
  const [selectedMoods, setSelectedMoods] = useState(moods);
  const [selectedSymbols, setSelectedSymbols] = useState(symbols);
  const hasFilters = Boolean(search || selectedMoods.length || selectedSymbols.length
    || query || moods.length || symbols.length);

  function resetFilters() {
    setSearch("");
    setSelectedMoods([]);
    setSelectedSymbols([]);
    router.push(`${path}?page=1`, { scroll: false });
  }

  return (
    <Form action={path} className="mb-8 flex flex-wrap items-center gap-3">
      <input type="hidden" name="page" value="1" />
      <SearchField
        label={t(
          availableSymbols
            ? "ArchiveList.searchDreams"
            : "ArchiveList.searchSymbols",
        )}
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      {availableSymbols && (
        <>
          <FilterDropdown
            label={t("Dreams.mood")}
            name="mood"
            selected={selectedMoods}
            onChange={setSelectedMoods}
            options={Object.values(Mood).map((mood) => ({
              value: mood,
              label: t(`Mood.${mood}`),
            }))}
          />
          <FilterDropdown
            label={t("Navigation.symbols")}
            name="symbol"
            selected={selectedSymbols}
            onChange={setSelectedSymbols}
            options={availableSymbols.map((symbol) => ({
              value: symbol.id,
              label: `${symbol.emoji} ${symbol.name}`,
            }))}
          />
        </>
      )}
      <Button type="submit" variant="secondary">
        {t("ArchiveList.search")}
      </Button>
      <Button type="button" variant="ghost" disabled={!hasFilters} onClick={resetFilters}>
        {t("ArchiveList.reset")}
      </Button>
    </Form>
  );
}

function FilterDropdown({
  label,
  name,
  selected,
  onChange,
  options,
}: {
  label: string;
  name: string;
  selected: string[];
  onChange: (selected: string[]) => void;
  options: { value: string; label: string }[];
}) {
  const dropdownRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    function closeOnOutsideClick(event: PointerEvent) {
      const dropdown = dropdownRef.current;
      if (dropdown?.open && event.target instanceof Node && !dropdown.contains(event.target)) {
        dropdown.open = false;
      }
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, []);

  return (
    <details ref={dropdownRef} className="relative w-40 sm:w-48">
      <summary className="control-interaction cursor-pointer rounded-control border border-line bg-paper-light px-4 py-3 text-sm text-ink focus-visible:outline-purple">
        {label}
        {selected.length > 0 ? ` (${selected.length})` : ""}
      </summary>
      <fieldset className={`absolute top-full ${name === "symbol" ? "right-0" : "left-0"} z-20 mt-2 max-h-64 w-72 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-control border border-line bg-paper-light p-3 shadow-paper-raised`}>
        <legend className="sr-only">{label}</legend>
        {options.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-center gap-3 rounded-control px-2 py-2 text-sm text-ink hover:bg-lavender-light"
          >
            <input
              type="checkbox"
              name={name}
              value={option.value}
              checked={selected.includes(option.value)}
              onChange={(event) => onChange(event.target.checked
                ? [...selected, option.value]
                : selected.filter(value => value !== option.value))}
              className="size-4 accent-purple"
            />
            {option.label}
          </label>
        ))}
      </fieldset>
    </details>
  );
}
