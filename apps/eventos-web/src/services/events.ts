import { api } from "../lib/api";
import type { Event } from "../types";
export async function listEvents(q?: { type?: string; from?: string; to?: string }) {
  const search: Record<string, string> = {};
  if (q?.type) search.type = q.type;
  if (q?.from) search.date_gte = q.from;
  if (q?.to)   search.date_lte = q.to;
  return api.get("events", { searchParams: search }).json<Event[]>();
}
export const getEvent    = (id: string) => api.get(`events/${id}`).json<Event>();
export const createEvent = (e: Omit<Event,"id">) => api.post("events", { json: e }).json<Event>();
export const updateEvent = (id: string, e: Partial<Event>) => api.patch(`events/${id}`, { json: e }).json<Event>();
