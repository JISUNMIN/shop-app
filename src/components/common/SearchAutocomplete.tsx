"use client";

import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import {
  getLocalStrings,
  addLocalString,
  removeLocalString,
  clearLocalStrings,
} from "@/utils/storage/localCollection";
import { useTranslation } from "react-i18next";
import { LangCode } from "@/types";
import useSuggest from "@/hooks/useSuggest";

const RECENT_KEY = "recent_searches";

function useDebouncedValue<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}

export default function SearchAutocomplete({
  value,
  onChange,
  placeholder,
  className,
  inputClassName,
  minLength = 1,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  minLength?: number;
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as LangCode;
  const router = useRouter();
  const debounced = useDebouncedValue(value, 180);

  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRecent(getLocalStrings(RECENT_KEY));
  }, []);

  const { listData, isListLoading, isListFetching } = useSuggest({
    searchText: debounced,
    locale: lang,
    minLength,
    enabled: open,
  });

  const items = listData?.data ?? [];
  const loading = isListLoading || isListFetching;

  const submit = (q: string) => {
    const keyword = q.trim();
    if (!keyword) {
      router.push("/");
      setOpen(false);
      return;
    }

    const next = addLocalString(RECENT_KEY, keyword, 8);
    setRecent(next);

    router.push(`/?search=${encodeURIComponent(keyword)}`);
    setOpen(false);
  };

  const recentFiltered = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return recent;
    return recent.filter((x) => x.toLowerCase().includes(q)).slice(0, 8);
  }, [recent, value]);

  const showRecent = recentFiltered.length > 0;
  const showSuggest = value.trim().length >= minLength;

  return (
    <div ref={wrapRef} className={cn("relative w-full", className)}>
      <div className="relative w-full">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Search className="h-4 w-4 text-gray-400" />
        </div>

        <input
          type="search"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submit(value);
            }
            if (e.key === "Escape") setOpen(false);
          }}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-none outline-none pl-9",
            inputClassName,
          )}
          style={
            {
              "--tw-ring-color": "color-mix(in oklch, var(--button-bg) 35%, transparent)",
            } as CSSProperties
          }
        />
      </div>

      {open && (showRecent || showSuggest) && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border bg-white shadow-lg">
          <Command shouldFilter={false}>
            <CommandList className="max-h-72">
              {showRecent && (
                <CommandGroup
                  heading={
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {t("searchAutocomplete.recentSearches")}
                      </span>
                      <button
                        type="button"
                        className="text-xs text-gray-500 hover:text-gray-800"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setRecent(clearLocalStrings(RECENT_KEY));
                        }}
                      >
                        {t("searchAutocomplete.clear")}
                      </button>
                    </div>
                  }
                >
                  {recentFiltered.map((k) => (
                    <CommandItem
                      key={k}
                      value={k}
                      onSelect={() => submit(k)}
                      className="cursor-pointer flex items-center justify-between"
                    >
                      <span className="truncate">{k}</span>

                      <button
                        type="button"
                        className="ml-3 inline-flex h-6 w-6 items-center justify-center rounded-md hover:bg-gray-100"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setRecent(removeLocalString(RECENT_KEY, k));
                        }}
                        aria-label={t("searchAutocomplete.removeRecentAria")}
                      >
                        <X className="h-4 w-4 text-gray-400" />
                      </button>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {showSuggest && (
                <CommandGroup heading={t("searchAutocomplete.suggestions")}>
                  {loading ? (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      {t("searchAutocomplete.loading")}
                    </div>
                  ) : items.length === 0 ? (
                    <CommandEmpty>{t("searchAutocomplete.noResults")}</CommandEmpty>
                  ) : (
                    items.map((it) => (
                      <CommandItem
                        key={it.id}
                        value={it.value}
                        onSelect={() => submit(it.value)}
                        className="cursor-pointer"
                      >
                        {it.label}
                      </CommandItem>
                    ))
                  )}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}
