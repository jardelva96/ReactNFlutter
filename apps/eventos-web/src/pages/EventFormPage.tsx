import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { EventItem, EventType } from "../types";
import { getEvent, upsertEvent } from "../lib/api";

import {
  Paper,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { format } from "date-fns";

const TYPES: EventType[] = ["Palestra", "Workshop", "Meetup", "Online", "Outro"];

export default function EventFormPage() {
  const nav = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [name, setName] = useState("");
  const [type, setType] = useState<EventType>("Meetup");
  const [date, setDate] = useState<Date | null>(new Date());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const e = await getEvent(id);
      if (e) {
        setName(e.name);
        setType(e.type);
        setDate(new Date(e.date));
      }
    })();
  }, [id]);

  async function save() {
    if (!date) return;
    setLoading(true);
    await upsertEvent({
      id,
      name,
      type,
      date: format(date, "yyyy-MM-dd"),
    });
    setLoading(false);
    nav("/dashboard");
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h5">{id ? "Editar evento" : "Novo evento"}</Typography>

      <Paper sx={{ p: 2, maxWidth: 560 }}>
        <Stack spacing={2}>
          <TextField
            label="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
          <TextField
            select
            label="Tipo"
            value={type}
            onChange={(e) => setType(e.target.value as EventType)}
          >
            {TYPES.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </TextField>
          <DatePicker
            label="Data"
            value={date}
            onChange={(d) => setDate(d)}
            slotProps={{ textField: { required: true } }}
          />

          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button onClick={() => nav(-1)}>Cancelar</Button>
            <Button variant="contained" onClick={save} disabled={loading} disableElevation>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}
