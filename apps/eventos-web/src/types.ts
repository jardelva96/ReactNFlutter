export type Event = { id: string; name: string; date: string; type: "tech"|"meetup"|"workshop"; location?: string; };
export type EventType = "Palestra" | "Workshop" | "Meetup" | "Online" | "Outro";

export interface EventItem {
  id: string;
  name: string;
  date: string; // ISO yyyy-mm-dd
  type: EventType;
  location?: string;
  description?: string;
}
