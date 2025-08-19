import React, { useEffect, useState } from "react";
import { listEvents } from "../services/events";
import { Event } from "../types";
import { EventCard } from "../components/EventCard";
import { Link } from "react-router-dom";
export default function EventsListPage(){
  const [items, setItems] = useState<Event[]>([]);
  const [type, setType] = useState(""); const [from, setFrom] = useState(""); const [to, setTo] = useState("");
  const load = async ()=> setItems(await listEvents({type, from, to}));
  useEffect(()=>{ load(); },[]);
  return (<div className="container"><h2>Eventos</h2>
    <div className="toolbar">
      <select value={type} onChange={e=>setType(e.target.value)}>
        <option value="">Todos</option><option>tech</option><option>meetup</option><option>workshop</option>
      </select>
      <input type="date" value={from} onChange={e=>setFrom(e.target.value)} />
      <input type="date" value={to} onChange={e=>setTo(e.target.value)} />
      <button onClick={load}>Filtrar</button>
      <Link to="/new"><button>Novo</button></Link>
    </div>
    <div className="grid">{items.map(ev => (<EventCard key={ev.id} ev={ev} />))}</div></div>);
}
