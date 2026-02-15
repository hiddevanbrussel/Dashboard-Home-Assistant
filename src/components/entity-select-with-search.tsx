"use client";

import { useState, useMemo } from "react";

export type HaEntity = {
  entity_id: string;
  attributes?: Record<string, unknown>;
};

type EntitySelectWithSearchProps = {
  entities: HaEntity[];
  value: string;
  onChange: (value: string) => void;
  /** Filter entities (e.g. only light., only media_player.) */
  filter?: (e: HaEntity) => boolean;
  label?: string;
  placeholder?: string;
  emptyOption?: string;
  className?: string;
  inputClassName?: string;
};

export function EntitySelectWithSearch({
  entities,
  value,
  onChange,
  filter,
  label,
  placeholder = "Zoek op naam of entity_id…",
  emptyOption = "Geen",
  className = "",
  inputClassName = "",
}: EntitySelectWithSearchProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = filter ? entities.filter(filter) : [...entities];
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((e) => {
        const name = ((e.attributes as { friendly_name?: string })?.friendly_name ?? e.entity_id).toLowerCase();
        return name.includes(q) || e.entity_id.toLowerCase().includes(q);
      });
      // Keep current value in list if it would otherwise be filtered out
      if (value && !list.some((e) => e.entity_id === value)) {
        const current = entities.find((e) => e.entity_id === value);
        if (current) list = [current, ...list];
      }
    }
    return list;
  }, [entities, filter, search, value]);

  const displayName = (e: HaEntity) =>
    (e.attributes as { friendly_name?: string })?.friendly_name ?? e.entity_id;

  return (
    <div className={className}>
      {label && (
        <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
          {label}
        </label>
      )}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder}
        className={`mb-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500 ${inputClassName}`}
      />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
      >
        <option value="">{emptyOption}</option>
        {filtered.map((e) => (
          <option key={e.entity_id} value={e.entity_id}>
            {displayName(e)}
          </option>
        ))}
      </select>
    </div>
  );
}
