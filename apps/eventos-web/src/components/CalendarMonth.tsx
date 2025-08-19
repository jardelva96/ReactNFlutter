import { useMemo, useState } from "react";
import { Event } from "../services/api";
import { getMonthMatrix, ptMonthYear, toISODate } from "../lib/date";

type Props = {
  events: Event[];
  onPick?: (isoDate: string) => void; // clica num dia -> filtra aquele dia
};

const DOW = ["S", "T", "Q", "Q", "S", "S", "D"]; // seg a dom (abreviado "estilo gmail")

export default function CalendarMonth({ events, onPick }: Props) {
  const [month, setMonth] = useState(new Date());
  const cells = useMemo(() => getMonthMatrix(month), [month]);

  const mapByDay = useMemo(() => {
    const m = new Map<string, Event[]>();
    for (const e of events) {
      const arr = m.get(e.date) ?? [];
      arr.push(e);
      m.set(e.date, arr);
    }
    return m;
  }, [events]);

  function colorFor(type: Event["type"]) {
    switch (type) {
      case "tech": return "#1a73e8";
      case "sports": return "#188038";
      case "food": return "#d93025";
      case "music": return "#a05a00";
      default: return "#5e35b1";
    }
  }

  return (
    <div className="calendar">
      <div className="cal-head">
        <button className="btn ghost" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>◀</button>
        <div style={{fontWeight:600}}>{ptMonthYear(month)}</div>
        <button className="btn ghost" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>▶</button>
      </div>

      <div className="cal-grid">
        {DOW.map(d => <div key={d} className="dow">{d}</div>)}
        {cells.map((d, i) => {
          const iso = toISODate(d);
          const list = mapByDay.get(iso) ?? [];
          const outMonth = d.getMonth() !== month.getMonth();
          return (
            <div
              key={i}
              className={`cell ${outMonth ? "out" : ""}`}
              onClick={() => onPick?.(iso)}
              title={list.map(e => e.name).join(", ")}
            >
              <span className="day">{d.getDate()}</span>
              <div style={{position:"absolute", left:8, right:8, bottom:8, display:"flex", gap:6, flexWrap:"wrap"}}>
                {list.slice(0,4).map((ev, idx) => (
                  <span key={idx} className="dot" style={{background: colorFor(ev.type)}} />
                ))}
                {list.length > 4 && <span style={{fontSize:11, color:"#5f6368"}}>+{list.length-4}</span>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
