"use client";

import Form from "next/form";
import { useState } from "react";
import { useArchiveNavigation } from "@/components/ui/archive-list-transition";
import { useTranslations } from "next-intl";
import { SearchField } from "@/components/ui/search-field";
import { Button } from "@/components/ui/button";
import { Mood } from "@/types/dream";
import type { Symbol } from "@/types/symbol";
import { FilterDropdown } from "./filter-dropdown";

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
  const navigate = useArchiveNavigation();
  const [search, setSearch] = useState(query);
  const [selectedMoods, setSelectedMoods] = useState(moods);
  const [selectedSymbols, setSelectedSymbols] = useState(symbols);
  const hasFilters = Boolean(
    search ||
    selectedMoods.length ||
    selectedSymbols.length ||
    query ||
    moods.length ||
    symbols.length,
  );

  function resetFilters() {
    setSearch("");
    setSelectedMoods([]);
    setSelectedSymbols([]);
    navigate(`${path}?page=1`);
  }

  return (
    <Form
      action={path}
      className="mb-8 flex flex-wrap items-center gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        const params = new URLSearchParams();
        new FormData(event.currentTarget).forEach((value, name) => {
          if (typeof value === "string") params.append(name, value);
        });
        navigate(`${path}?${params}`);
      }}
    >
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
        <div className="grid w-full grid-cols-2 gap-3 md:contents">
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
            searchLabel={t("ArchiveList.searchSymbols")}
            emptyLabel={t("Symbols.noResults")}
            selected={selectedSymbols}
            onChange={setSelectedSymbols}
            options={availableSymbols.map((symbol) => ({
              value: symbol.id,
              label: `${symbol.emoji} ${symbol.name}`,
            }))}
          />
        </div>
      )}
      <Button type="submit" variant="secondary">
        {t("ArchiveList.search")}
      </Button>
      <Button
        type="button"
        variant="ghost"
        disabled={!hasFilters}
        onClick={resetFilters}
      >
        {t("ArchiveList.reset")}
      </Button>
    </Form>
  );
}
