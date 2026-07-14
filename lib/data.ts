// Memoized fetchers for the static /data assets.
import type { CategoryData, IndexData, TraceData } from "./types";

const cache = new Map<string, Promise<unknown>>();

function fetchJson<T>(path: string): Promise<T> {
  if (!cache.has(path)) {
    const promise = fetch(path).then((res) => {
      if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
      return res.json();
    });
    promise.catch(() => cache.delete(path)); // don't cache failures
    cache.set(path, promise);
  }
  return cache.get(path) as Promise<T>;
}

export const getIndex = () => fetchJson<IndexData>("/data/index.json");
export const getCategory = (slug: string) => fetchJson<CategoryData>(`/data/categories/${slug}.json`);
export const getTraces = (taskId: string) => fetchJson<TraceData>(`/data/traces/${taskId}.json`);
