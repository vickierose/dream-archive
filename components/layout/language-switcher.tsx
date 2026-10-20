"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  KeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
} from "react";
import { setLocale } from "@/lib/actions/locale";
import { Check, Languages } from "lucide-react";
import type { AppLocale } from "@/i18n/config";

const languages = [
  { locale: "en", label: "EN" },
  { locale: "uk", label: "UA" },
] as const;

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const t = useTranslations();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  function positionMenu() {
    const trigger = triggerRef.current;
    const menu = menuRef.current;
    if (!trigger || !menu || !menu.matches(":popover-open")) return;
    if (!trigger.getClientRects().length) {
      menu.hidePopover();
      return;
    }
    const bounds = trigger.getBoundingClientRect();
    menu.style.width = `${bounds.width}px`;
    const gap = 6;
    const left = Math.max(
      8,
      Math.min(
        bounds.right - menu.offsetWidth,
        window.innerWidth - menu.offsetWidth - 8,
      ),
    );
    const top =
      bounds.bottom + gap + menu.offsetHeight <= window.innerHeight - 8
        ? bounds.bottom + gap
        : Math.max(8, bounds.top - menu.offsetHeight - gap);
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
  }

  useEffect(() => {
    window.addEventListener("resize", positionMenu);
    window.addEventListener("scroll", positionMenu, true);
    return () => {
      window.removeEventListener("resize", positionMenu);
      window.removeEventListener("scroll", positionMenu, true);
    };
  }, []);

  function focusOption(index: number) {
    menuRef.current
      ?.querySelectorAll<HTMLButtonElement>("button")
      [index]?.focus();
  }

  function showMenu(focusIndex?: number) {
    menuRef.current?.showPopover();
    positionMenu();
    if (focusIndex !== undefined) focusOption(focusIndex);
  }

  function closeMenu() {
    menuRef.current?.hidePopover();
    triggerRef.current?.focus();
  }

  function chooseLanguage(value: AppLocale) {
    closeMenu();
    if (value === locale || pending) return;
    setError(false);
    startTransition(async () => {
      try {
        await setLocale(value);
      } catch {
        setError(true);
      }
    });
  }

  function handleMenuKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu();
    } else if (event.key === "Tab") {
      closeMenu();
    } else if (
      ["ArrowDown", "ArrowUp", "Home", "End", "e", "E", "u", "U"].includes(
        event.key,
      )
    ) {
      event.preventDefault();
      const buttons = Array.from(
        event.currentTarget.querySelectorAll("button"),
      );
      const current = buttons.indexOf(
        document.activeElement as HTMLButtonElement,
      );
      const next =
        event.key === "Home" || event.key.toLowerCase() === "e"
          ? 0
          : event.key === "End" || event.key.toLowerCase() === "u"
            ? languages.length - 1
            : (current +
                (event.key === "ArrowUp" ? -1 : 1) +
                languages.length) %
              languages.length;
      focusOption(next);
    }
  }
  return (
    <div className="flex flex-col gap-1">
      <div
        className={`relative rounded-control text-ink-soft hover:bg-lavender-light hover:text-ink ${className}`}
      >
        <button
          ref={triggerRef}
          id={`${id}-trigger`}
          type="button"
          aria-label={t("Common.language")}
          aria-busy={pending}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={`${id}-menu`}
          popoverTarget={`${id}-menu`}
          disabled={pending}
          className="control-interaction w-full flex items-center gap-3 rounded-control bg-transparent py-2.5 px-3 font-base text-sm text-inherit focus:not-focus-visible:outline-none"
          onClick={(event) => {
            const keyboard = event.detail === 0;
            requestAnimationFrame(() => {
              positionMenu();
              if (keyboard && menuRef.current?.matches(":popover-open"))
                focusOption(0);
            });
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              showMenu(event.key === "ArrowDown" ? 0 : languages.length - 1);
            }
          }}
          onBlur={(event) => {
            if (!menuRef.current?.contains(event.relatedTarget))
              menuRef.current?.hidePopover();
          }}
        >
          <Languages aria-hidden="true" size={18} />
          {languages.find((language) => language.locale === locale)?.label}
        </button>
      </div>
      <div
        ref={menuRef}
        id={`${id}-menu`}
        popover="auto"
        role="menu"
        aria-labelledby={`${id}-trigger`}
        className="fixed inset-auto m-0 rounded-control border border-line bg-paper-light p-1 font-base text-sm text-ink shadow-popover"
        onToggle={(event) => setOpen(event.newState === "open")}
        onBlur={(event) => {
          if (
            event.relatedTarget !== triggerRef.current &&
            !event.currentTarget.contains(event.relatedTarget)
          ) {
            menuRef.current?.hidePopover();
          }
        }}
        onKeyDown={handleMenuKeyDown}
      >
        {languages.map((language) => (
          <button
            key={language.locale}
            type="button"
            role="menuitemradio"
            aria-checked={locale === language.locale}
            tabIndex={-1}
            lang={language.locale}
            disabled={pending}
            className="control-interaction flex min-h-10 w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left hover:bg-lavender-light focus-visible:bg-lavender-light focus-visible:-outline-offset-2 focus:not-focus-visible:outline-none"
            onClick={() => chooseLanguage(language.locale)}
          >
            {language.label}
            {locale === language.locale && (
              <Check aria-hidden="true" size={16} className="text-purple" />
            )}
          </button>
        ))}
      </div>
      {error && (
        <p role="alert" className="text-xs text-danger">
          {t("Common.languageError")}
        </p>
      )}
    </div>
  );
}
