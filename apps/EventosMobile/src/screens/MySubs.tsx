// src/screens/MySubs.tsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { useSubs } from "../store/subs";
import { api } from "../services/api";

type Ev = { id: string; name: string; date: string };

export default function MySubs() {
  const ids = useSubs((s) => s.ids);
  const [events, setEvents] = useState<Ev[]>([]);

  useEffect(() => {
    if (!ids.length) { setEvents([]); return; }
    // json-server aceita ?id=1&id=2...
    const params = new URLSearchParams();
    ids.forEach((id) => params.append("id", String(id)));
    api.get<Ev[]>(`/events?${params.toString()}`).then((r) => setEvents(r.data));
  }, [ids]);

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 8 }}>
        Minhas inscrições
      </Text>
      <FlatList
        data={events}
        keyExtractor={(i) => String(i.id)}
        ListEmptyComponent={<Text>Nenhuma inscrição.</Text>}
        renderItem={({ item }) => (
          <Text>- {item.name} ({item.date})</Text>
        )}
      />
    </View>
  );
}
