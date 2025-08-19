// src/store/subs.ts
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

type SubState = { ids: string[]; toggle: (id: string) => void; hydrate: () => Promise<void> };

export const useSubs = create<SubState>((set, get) => ({
  ids: [],
  async hydrate() {
    const raw = await AsyncStorage.getItem("subs.v1");
    if (raw) set({ ids: JSON.parse(raw) });
  },
  toggle(id) {
    const has = get().ids.includes(id);
    const next = has ? get().ids.filter((i) => i !== id) : [...get().ids, id];
    set({ ids: next });
    AsyncStorage.setItem("subs.v1", JSON.stringify(next)).catch(()=>{});
  },
}));
