import React from "react";
import type { Event } from "../types";
import { Link } from "react-router-dom";
export const EventCard: React.FC<{ ev: Event }> = ({ ev }) => (
  <div style={{padding:12,border:"1px solid #e5e7eb",borderRadius:12,display:"flex",
    alignItems:"center",justifyContent:"space-between",background:"#fff"}}>
    <div>
      <div style={{fontWeight:700,fontSize:16}}>{ev.name}</div>
      <small>{ev.date} • {ev.type}{ev.location ? ` • ${ev.location}` : ""}</small>
    </div>
    <Link to={`/edit/${ev.id}`}><button>Editar</button></Link>
  </div>
);
