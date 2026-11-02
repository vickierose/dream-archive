"use client";

import { ChevronDown, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { TextField } from "./text-field";

export function FilterDropdown({
  label,
  name,
  selected,
  onChange,
  options,
  searchLabel,
  emptyLabel,
}: {
  label: string;
  name: string;
  selected: string[];
  onChange: (selected: string[]) => void;
  options: { value: string; label: string }[];
  searchLabel?: string;
  emptyLabel?: string;
}) {
  const dropdownRef = useRef<HTMLDetailsElement>(null);
  const [optionSearch, setOptionSearch] = useState("");
  const normalizedSearch = optionSearch.trim().toLocaleLowerCase();
  const matchesSearch = (option: { label: string }) =>
    option.label.toLocaleLowerCase().includes(normalizedSearch);

  useEffect(() => {
    function closeOnOutsideClick(event: PointerEvent) {
      const dropdown = dropdownRef.current;
      if (
        dropdown?.open &&
        event.target instanceof Node &&
        !dropdown.contains(event.target)
      ) {
        dropdown.open = false;
      }
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () =>
      document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, []);

  return (
    <details
      ref={dropdownRef}
      className="relative min-w-0 sm:w-48"
      onToggle={(event) => {
        if (!event.currentTarget.open) setOptionSearch("");
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          event.currentTarget.open = false;
          event.currentTarget.querySelector("summary")?.focus();
        }
      }}
    >
      <summary className="control-interaction flex cursor-pointer list-none items-center justify-between gap-2 rounded-control border border-line bg-paper-light px-4 py-3 text-sm text-ink focus-visible:outline-purple [&::-webkit-details-marker]:hidden">
        <span>
          {label}
          {selected.length > 0 ? ` (${selected.length})` : ""}
        </span>
        <ChevronDown aria-hidden="true" size={16} className="shrink-0" />
      </summary>
      <fieldset
        className={`absolute top-full ${name === "symbol" ? "right-0" : "left-0"} z-20 mt-2 min-w-0 w-72 max-w-[calc(100vw-2rem)] rounded-control border border-line bg-paper-light p-3 shadow-paper-raised`}
      >
        <legend className="sr-only">{label}</legend>
        {searchLabel && (
          <TextField
            id={`${name}-filter-search`}
            type="search"
            label={searchLabel}
            hideLabel
            placeholder={searchLabel}
            value={optionSearch}
            onChange={(event) => setOptionSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.preventDefault();
            }}
            leadingIcon={<Search size={18} />}
            wrapperClassName="mb-2"
          />
        )}
        <div className="max-h-64 overflow-y-auto">
          {searchLabel && !options.some(matchesSearch) && (
            <p role="status" className="px-2 py-3 text-sm text-ink-muted">
              {emptyLabel}
            </p>
          )}
          {options.map((option) => (
            <label
              key={option.value}
              hidden={!matchesSearch(option)}
              className={`${matchesSearch(option) ? "flex" : "hidden"} cursor-pointer items-center gap-3 rounded-control px-2 py-2 text-sm text-ink hover:bg-lavender-light`}
            >
              <input
                type="checkbox"
                name={name}
                value={option.value}
                checked={selected.includes(option.value)}
                onChange={(event) =>
                  onChange(
                    event.target.checked
                      ? [...selected, option.value]
                      : selected.filter((value) => value !== option.value),
                  )
                }
                className="size-4 accent-purple"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>
    </details>
  );
}
