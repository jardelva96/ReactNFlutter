// src/services/api.ts
import { EventItem } from "../types";

export type EventFilters = { type?: string; from?: string; to?: string };

const BASE_URL = (import.meta as any).env?.VITE_API_URL?.replace(/\/$/, "");
let lastMode: "api" | "local" = BASE_URL ? "api" : "local";
export const getPersistenceMode = () => lastMode; // opcional p/ mostrar na UI

// -------- LOCAL (fallback) ----------
const STORAGE_KEY = "events.v1";

function loadLocal(): EventItem[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as EventItem[]) : [];
}
function saveLocal(list: EventItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
function ensureSeedLocal() {
  if (loadLocal().length) return;
  const seed: EventItem[] = [
    { id: "1", name: "Tech Meetup Floripa", date: "2025-08-30", type: "Meetup", location: "Florianópolis" },
    { id: "2", name: "Workshop React Avançado", date: "2025-09-05", type: "Workshop", location: "São Paulo" },
    { id: "3", name: "Keynote Online", date: "2025-09-10", type: "Online" },
    { id: "4", name: "Palestra UX", date: "2025-09-12", type: "Palestra" },
  ];
  saveLocal(seed);
}
ensureSeedLocal();

// -------- HELPERS ----------
function buildParams(filters?: EventFilters) {
  const p = new URLSearchParams();
  if (filters?.type && filters.type !== "Todos") p.set("type", filters.type);
  if (filters?.from) p.set("date_gte", filters.from);
  if (filters?.to) p.set("date_lte", filters.to);
  return p.toString();
}

// -------- API-FIRST COM FALLBACK ----------
export async function listEvents(filters?: EventFilters): Promise<EventItem[]> {
  if (BASE_URL) {
    try {
      const r = await fetch(`${BASE_URL}/events?${buildParams(filters)}`);
      if (!r.ok) throw new Error("http");
      const data: EventItem[] = await r.json();
      lastMode = "api";
      return data.sort((a, b) => a.date.localeCompare(b.date));
    } catch {
      console.warn("API indisponível, usando localStorage.");
    }
  }
  lastMode = "local";
  let list = loadLocal().sort((a, b) => a.date.localeCompare(b.date));
  if (filters?.type && filters.type !== "Todos") list = list.filter((e) => e.type === filters.type);
  if (filters?.from) list = list.filter((e) => e.date >= filters.from!);
  if (filters?.to) list = list.filter((e) => e.date <= filters.to!);
  return list;
}

export async function getEvent(id: string) {
  if (BASE_URL) {
    try {
      const r = await fetch(`${BASE_URL}/events/${id}`);
      if (!r.ok) throw new Error("http");
      lastMode = "api";
      return (await r.json()) as EventItem;
    } catch {}
  }
  lastMode = "local";
  return loadLocal().find((e) => e.id == id) ?? null;
}

export async function upsertEvent(
  input: Partial<EventItem> & { name: string; date: string; type: EventItem["type"] }
) {
  if (BASE_URL) {
    try {
      const opts: RequestInit = {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      };
      const r = await fetch(
        input.id ? `${BASE_URL}/events/${input.id}` : `${BASE_URL}/events`,
        { ...opts, method: input.id ? "PATCH" : "POST" }
      );
      if (!r.ok) throw new Error("http");
      lastMode = "api";
      return true;
    } catch {}
  }
  // local
  lastMode = "local";
  const list = loadLocal();
  if (input.id) {
    const i = list.findIndex((e) => e.id === input.id);
    if (i >= 0) list[i] = { ...list[i], ...input } as EventItem;
  } else {
    const id = crypto.randomUUID();
    list.push({ id, ...(input as any) } as EventItem);
  }
  saveLocal(list);
  return true;
}

export async function removeEvent(id: string) {
  if (BASE_URL) {
    try {
      const r = await fetch(`${BASE_URL}/events/${id}`, { method: "DELETE" });
      if (!r.ok) throw new Error("http");
      lastMode = "api";
      return true;
    } catch {}
  }
  lastMode = "local";
  saveLocal(loadLocal().filter((e) => e.id !== id));
  return true;
}
