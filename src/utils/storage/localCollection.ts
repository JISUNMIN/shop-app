const isBrowser = () => typeof window !== "undefined";

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
