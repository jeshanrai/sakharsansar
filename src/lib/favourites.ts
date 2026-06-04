"use client";

/**
 * Global favourites store.
 *
 * A tiny external store (no provider needed) backed by localStorage and
 * synced across tabs. Components subscribe via the `useFavourites` family of
 * hooks; any component can mutate with `toggleFavourite` / `removeFavourite`.
 *
 * Slugs are stored most-recent-first so the favourites page reads as a
 * reverse-chronological list.
 */

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "sakhar:favourites";

// Stable empty reference for the server snapshot — keeps hydration consistent.
const EMPTY: readonly string[] = Object.freeze([]);

let favourites: string[] = [];
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function readStorage(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === "string") : [];
  } catch {
    return [];
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
  } catch {
    // storage may be unavailable (private mode / quota) — keep in-memory state
  }
}

// Load from localStorage + wire cross-tab sync exactly once, on the client.
function ensureHydrated() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  favourites = readStorage(localStorage.getItem(STORAGE_KEY));
  window.addEventListener("storage", (e) => {
    if (e.key !== STORAGE_KEY) return;
    favourites = readStorage(e.newValue);
    emit();
  });
}

function subscribe(callback: () => void) {
  ensureHydrated();
  listeners.add(callback);
  return () => listeners.delete(callback);
}

/* ─── Hooks ─────────────────────────────────────────────────────────── */

/** Reactive list of favourited product slugs (most recent first). */
export function useFavourites(): readonly string[] {
  return useSyncExternalStore(
    subscribe,
    () => favourites,
    () => EMPTY,
  );
}

/** Reactive boolean for a single slug. */
export function useIsFavourite(slug: string): boolean {
  return useFavourites().includes(slug);
}

/** Reactive count of favourited items. */
export function useFavouritesCount(): number {
  return useFavourites().length;
}

/* ─── Mutations ─────────────────────────────────────────────────────── */

export function toggleFavourite(slug: string) {
  ensureHydrated();
  favourites = favourites.includes(slug)
    ? favourites.filter((s) => s !== slug)
    : [slug, ...favourites];
  persist();
  emit();
}

export function removeFavourite(slug: string) {
  ensureHydrated();
  if (!favourites.includes(slug)) return;
  favourites = favourites.filter((s) => s !== slug);
  persist();
  emit();
}

export function clearFavourites() {
  ensureHydrated();
  if (favourites.length === 0) return;
  favourites = [];
  persist();
  emit();
}
