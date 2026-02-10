const isBrowser = () => typeof window !== "undefined";

// number
const normalizeIds = (ids: unknown): number[] => {
  if (!Array.isArray(ids)) return [];
  return [...new Set(ids.map(Number).filter(Number.isFinite))];
};

export function getLocalIds(key: string): number[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(key);
    return normalizeIds(raw ? JSON.parse(raw) : []);
  } catch {
    return [];
  }
}

export function setLocalIds(key: string, ids: unknown): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(normalizeIds(ids)));
  } catch {}
}

export function hasLocalId(key: string, id: number): boolean {
  return getLocalIds(key).includes(Number(id));
}

export function addLocalId(key: string, id: number): void {
  const next = normalizeIds([...getLocalIds(key), id]);
  setLocalIds(key, next);
}

export function removeLocalId(key: string, id: number): void {
  const n = Number(id);
  setLocalIds(
    key,
    getLocalIds(key).filter((v) => v !== n),
  );
}

export function clearLocalIds(key: string): void {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(key);
  } catch {}
}

// string
const normalizeStrings = (items: unknown): string[] => {
  if (!Array.isArray(items)) return [];
  return [
    ...new Set(
      items
        .map((x) => String(x))
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  ];
};

export function getLocalStrings(key: string): string[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(key);
    return normalizeStrings(raw ? JSON.parse(raw) : []);
  } catch {
    return [];
  }
}

export function setLocalStrings(key: string, items: unknown): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(normalizeStrings(items)));
  } catch {}
}

export function addLocalString(key: string, item: string, limit = 8): string[] {
  const k = item.trim();
  if (!k) return getLocalStrings(key);

  const prev = getLocalStrings(key);
  const next = [k, ...prev.filter((x) => x !== k)].slice(0, limit);

  setLocalStrings(key, next);
  return next;
}

export function removeLocalString(key: string, item: string): string[] {
  const prev = getLocalStrings(key);
  const next = prev.filter((x) => x !== item);
  setLocalStrings(key, next);
  return next;
}

export function clearLocalStrings(key: string): string[] {
  if (!isBrowser()) return [];
  try {
    localStorage.removeItem(key);
  } catch {}
  return [];
}
