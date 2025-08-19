import React, {useEffect, useState} from "react";
import {View, Text, Button, ActivityIndicator} from "react-native";
import { api } from "../services/api";
import { useSubs } from "../store/subs";

type Ev = { id:string; name:string; date:string; type:string; location?:string };

export default function Details({route}: any){
  const { id } = route.params as { id: string };
  const [ev,setEv]=useState<Ev|null>(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState<string|null>(null);

  const ids = useSubs(s=>s.ids);
  const toggle = useSubs(s=>s.toggle);
  const subscribed = ev ? ids.includes(ev.id) : false;

  useEffect(()=>{
    (async () => {
      setLoading(true); setError(null);
      try {
        const r = await api.get<Ev>(`/events/${id}`);
        setEv(r.data);
      } catch (e:any) {
        console.log("Erro /events/:id", e?.message ?? e);
        setError(String(e?.message ?? e));
      } finally {
        setLoading(false);
      }
    })();
  },[id]);

  if(loading) return <ActivityIndicator style={{marginTop:40}} />;
  if(error)   return <Text style={{padding:16, color:"crimson"}}>Erro: {error}</Text>;
  if(!ev)     return <Text style={{padding:16}}>Evento não encontrado</Text>;

  return (
    <View style={{padding:16}}>
      <Text style={{fontWeight:"bold", fontSize:18, marginBottom:6}}>{ev.name}</Text>
      <Text>{ev.date} • {ev.type}</Text>
      {!!ev.location && <Text>{ev.location}</Text>}
      <View style={{height:12}} />
      <Button
        title={subscribed ? "Cancelar inscrição" : "Inscrever-se"}
        onPress={()=>toggle(ev.id)}
      />
    </View>
  );
}
