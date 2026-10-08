"use client";

import { FormActions } from "@/components/ui/form-actions";
import { Dialog } from "@/components/ui/dialog";
import { Feedback } from "@/components/ui/feedback";
import { useEffect, useId, useRef, useState, type Ref } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { ChevronDown, Plus, SmilePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { SelectableButton } from "@/components/ui/selectable-button";
import { createSymbol, getSymbols } from "@/lib/actions/symbol";
import type { Symbol } from "@/types/symbol";

const EmojiPicker = dynamic(() => import("@/components/ui/emoji-picker"), {
  ssr: false,
  loading: () => (
    <Feedback tone="notice" className="p-4">
      Loading emojis...
    </Feedback>
  ),
});

type DreamSymbolsProps = {
  value: string[];
  onChange: (value: string[]) => void;
  onBlur: () => void;
  buttonRef?: Ref<HTMLButtonElement>;
};

export function DreamSymbols({
  value,
  onChange,
  onBlur,
  buttonRef,
}: DreamSymbolsProps) {
  const [symbols, setSymbols] = useState<Symbol[]>([]);
  const [open, setOpen] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;
    getSymbols()
      .then((items) => {
        if (active) setSymbols(items);
      })
      .catch(() => {
        if (active) setLoadError(true);
      });
    return () => {
      active = false;
    };
  }, []);

  function select(symbol: Symbol) {
    setSymbols((items) =>
      items.some((item) => item.id === symbol.id) ? items : [...items, symbol],
    );
    if (!value.includes(symbol.id)) onChange([...value, symbol.id]);
    onBlur();
    setOpen(false);
  }

  return (
    <>
      <div className="mt-2 flex flex-wrap gap-3">
        {value.map((id) => {
          const symbol = symbols.find((item) => item.id === id);
          return (
            <SelectableButton
              key={id}
              isSelected
              onBlur={onBlur}
              aria-label={`Remove ${symbol?.name ?? "symbol"}`}
              onClick={() =>
                onChange(value.filter((selectedId) => selectedId !== id))
              }
            >
              <span aria-hidden="true">{symbol?.emoji}</span>
              {symbol?.name ?? "Loading symbol..."}
              <X size={14} aria-hidden="true" />
            </SelectableButton>
          );
        })}
        <button
          ref={buttonRef}
          type="button"
          onBlur={onBlur}
          onClick={() => setOpen(true)}
          className="control-interaction inline-flex items-center gap-2 rounded-full border border-dashed border-lavender bg-paper-light px-4 py-3 font-base text-sm font-semibold text-ink-soft not-disabled:hover:border-lavender-dark not-disabled:hover:text-purple"
        >
          <Plus aria-hidden="true" size={16} /> Add symbol
        </button>
      </div>
      {loadError && (
        <Feedback className="mt-2">
          Could not load symbols. Open Add symbol to retry.
        </Feedback>
      )}
      {open &&
        createPortal(
          <SymbolPopup
            selectedIds={value}
            onSelect={select}
            onClose={() => setOpen(false)}
            onLoad={(items) => {
              setSymbols(items);
              setLoadError(false);
            }}
          />,
          document.body,
        )}
    </>
  );
}

function SymbolSelect({
  id,
  symbols,
  selectedIds,
  value,
  disabled,
  loading,
  onChange,
}: {
  id: string;
  symbols: Symbol[];
  selectedIds: string[];
  value: string;
  disabled: boolean;
  loading: boolean;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const selected = symbols.find((symbol) => symbol.id === value);
  const options = symbols.filter((symbol) =>
    symbol.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  function choose(symbol: Symbol) {
    onChange(symbol.id);
    setQuery("");
    setOpen(false);
    setActive(-1);
    inputRef.current?.focus();
  }

  return (
    <div
      className="relative mt-2"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false);
          setQuery("");
          setActive(-1);
        }
      }}
    >
      <div className="flex items-center rounded-control border border-line bg-paper-light focus-within:border-lavender-dark focus-within:ring-2 focus-within:ring-lavender-light">
        <input
          ref={inputRef}
          role="combobox"
          aria-label="Search and select a symbol"
          aria-expanded={open}
          aria-controls={`${id}-options`}
          aria-autocomplete="list"
          aria-activedescendant={
            open && active >= 0 ? `${id}-option-${active}` : undefined
          }
          disabled={disabled}
          autoComplete="off"
          className="min-w-0 flex-1 rounded-control bg-transparent px-4 py-3 font-base text-sm text-ink outline-none"
          placeholder={
            loading
              ? "Loading symbols..."
              : selected
                ? `${selected.emoji} ${selected.name}`
                : "Select or search symbols..."
          }
          value={
            open ? query : selected ? `${selected.emoji} ${selected.name}` : ""
          }
          onClick={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              setOpen(true);
              const direction = event.key === "ArrowDown" ? 1 : -1;
              let next = active;
              for (let i = 0; i < options.length; i++) {
                next = (next + direction + options.length) % options.length;
                if (!selectedIds.includes(options[next].id)) {
                  setActive(next);
                  break;
                }
              }
            } else if (event.key === "Enter" && open) {
              event.preventDefault();
              event.stopPropagation();
              if (
                active >= 0 &&
                options[active] &&
                !selectedIds.includes(options[active].id)
              )
                choose(options[active]);
            } else if (event.key === "Escape" && open) {
              event.preventDefault();
              event.stopPropagation();
              setOpen(false);
              setQuery("");
            }
          }}
        />
        {value && (
          <button
            type="button"
            aria-label="Clear selected symbol"
            disabled={disabled}
            className="control-interaction rounded-control p-2 text-ink-soft not-disabled:hover:text-purple"
            onClick={() => {
              onChange("");
              setQuery("");
              setActive(-1);
              inputRef.current?.focus();
            }}
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}
        <button
          type="button"
          aria-label="Toggle symbol options"
          disabled={disabled}
          className="control-interaction rounded-control p-3 text-ink-soft not-disabled:hover:text-purple"
          onClick={() => {
            setOpen(!open);
            inputRef.current?.focus();
          }}
        >
          <ChevronDown size={16} aria-hidden="true" />
        </button>
      </div>
      {open && !disabled && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-44 overflow-y-auto rounded-panel border border-line bg-paper-light py-1 shadow-popover">
          <ul
            id={`${id}-options`}
            role="listbox"
            aria-label="Available symbols"
          >
            {options.map((symbol, index) => (
              <li
                key={symbol.id}
                id={`${id}-option-${index}`}
                role="option"
                aria-selected={symbol.id === value}
                aria-disabled={selectedIds.includes(symbol.id)}
                className={`px-4 py-2 font-base text-sm ${selectedIds.includes(symbol.id) ? "cursor-not-allowed text-ink-muted" : "cursor-pointer hover:bg-lavender-light"} ${active === index || symbol.id === value ? "bg-lavender-light" : ""}`}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  if (!selectedIds.includes(symbol.id)) choose(symbol);
                }}
              >
                {symbol.emoji} {symbol.name}
                {selectedIds.includes(symbol.id) ? " (already added)" : ""}
              </li>
            ))}
          </ul>
          {options.length === 0 && (
            <p className="px-4 py-2 text-sm text-ink-soft">No symbols found.</p>
          )}
        </div>
      )}
    </div>
  );
}

function SymbolPopup({
  selectedIds,
  onSelect,
  onClose,
  onLoad,
}: {
  selectedIds: string[];
  onSelect: (symbol: Symbol) => void;
  onClose: () => void;
  onLoad: (symbols: Symbol[]) => void;
}) {
  const id = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const busyRef = useRef(false);
  const onLoadRef = useRef(onLoad);
  const [symbols, setSymbols] = useState<Symbol[]>([]);

  const [selectedId, setSelectedId] = useState("");
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const dialog = dialogRef.current!;
    dialog.showModal();
    let active = true;
    getSymbols()
      .then((items) => {
        if (!active) return;
        setSymbols(items);
        onLoadRef.current(items);
      })
      .catch(() => {
        if (active)
          setError("Could not load symbols. Close and reopen to retry.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
      dialog.close();
    };
  }, []);

  async function add() {
    if (busyRef.current) return;
    setError(undefined);
    const selected = symbols.find((symbol) => symbol.id === selectedId);
    if (selected) {
      onSelect(selected);
      return;
    }
    if (!name.trim() || !emoji) {
      setError("Enter a name and choose an emoji.");
      return;
    }
    busyRef.current = true;
    setSaving(true);
    try {
      const result = await createSymbol({ name, emoji });
      if (result.symbol) onSelect(result.symbol);
      else setError(result.error);
    } catch {
      setError("Could not add the symbol. Please try again.");
    } finally {
      busyRef.current = false;
      setSaving(false);
    }
  }

  return (
    <Dialog
      ref={dialogRef}
      titleId={`${id}-title`}
      title="Add symbol"
      overflow="visible"
      onCancel={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!busyRef.current) onClose();
      }}
    >
      <form
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void add();
        }}
      >
        <fieldset disabled={saving || loading}>
          <legend className="field-label">Choose an existing symbol</legend>
          <SymbolSelect
            id={id}
            symbols={symbols}
            selectedIds={selectedIds}
            value={selectedId}
            disabled={saving || loading}
            loading={loading}
            onChange={(value) => {
              setSelectedId(value);
              setShowEmojis(false);
            }}
          />
        </fieldset>
        <fieldset
          disabled={!!selectedId || saving}
          className="border-t border-line pt-6 disabled:opacity-50"
        >
          <legend className="field-label">Create a new symbol</legend>
          <div className="relative flex items-center gap-3">
            <button
              type="button"
              aria-label={emoji ? "Change emoji" : "Choose emoji"}
              aria-expanded={showEmojis}
              aria-controls={`${id}-emoji-picker`}
              className="control-interaction mt-2 grid size-11 shrink-0 place-items-center rounded-control border border-line bg-paper-light text-purple not-disabled:hover:bg-lavender-light"
              onClick={() => setShowEmojis(!showEmojis)}
            >
              {emoji ? (
                <span className="text-xl">{emoji}</span>
              ) : (
                <SmilePlus size={21} aria-hidden="true" />
              )}
            </button>
            <TextField
              id={`${id}-name`}
              label="Symbol name"
              hideLabel
              wrapperClassName="mt-2 min-w-0 flex-1"
              value={name}
              maxLength={80}
              placeholder="Symbol name"
              onFocus={() => setShowEmojis(false)}
              onChange={(event) => setName(event.target.value)}
            />
            {showEmojis && !selectedId && (
              <div
                id={`${id}-emoji-picker`}
                className="absolute bottom-full left-0 z-30 mb-2 w-80 max-w-full rounded-panel bg-paper-light shadow-popover"
                inert={saving}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    event.preventDefault();
                    event.stopPropagation();
                    setShowEmojis(false);
                  }
                }}
              >
                <EmojiPicker
                  onSelect={(emoji) => {
                    setEmoji(emoji);
                    setShowEmojis(false);
                  }}
                />
              </div>
            )}
          </div>
        </fieldset>
        {error && <Feedback>{error}</Feedback>}
        <FormActions>
          <Button
            type="button"
            variant="secondary"
            disabled={saving}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!selectedId && (!name.trim() || !emoji)}
            loading={saving}
            loadingLabel="Adding..."
          >
            Add
          </Button>
        </FormActions>
      </form>
    </Dialog>
  );
}
