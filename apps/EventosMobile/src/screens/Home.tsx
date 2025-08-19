import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Button } from "react-native";
import { api } from "../services/api";

type Ev = { id: string; name: string; date: string; type: string };

export default function Home({ navigation }: any) {
  const [data, setData] = useState<Ev[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const r = await api.get<Ev[]>("/events");
      setData(r.data);
    } catch (e: any) {
      console.log("Erro /events:", e?.message ?? e);
      setError(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;
  if (error)   return (
    <View style={{ padding: 16 }}>
      <Text style={{ color: "crimson", marginBottom: 8 }}>Erro: {error}</Text>
      <Button title="Tentar novamente" onPress={load} />
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 16, paddingBottom: 24 }}>
      <FlatList
        data={data}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Details", { id: item.id })}
            style={{ padding: 14, borderWidth: 1, borderColor: "#ddd", borderRadius: 12, marginBottom: 8, backgroundColor: "#fff" }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.name}</Text>
            <Text>{item.date} • {item.type}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>Nenhum evento</Text>}
      />
      <Button title="Minhas inscrições" onPress={() => navigation.navigate("MySubs")} />
    </View>
  );
}
