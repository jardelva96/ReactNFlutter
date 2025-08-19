import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { listEvents, removeEvent, EventFilters } from "../lib/api";
import { EventItem, EventType } from "../types";

import {
  Paper,
  Stack,
  Typography,
  Button,
  Divider,
  TextField,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { format } from "date-fns";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const TYPES: (EventType | "Todos")[] = [
  "Todos",
  "Palestra",
  "Workshop",
  "Meetup",
  "Online",
  "Outro",
];

export default function Dashboard() {
  const nav = useNavigate();
  const [items, setItems] = useState<EventItem[]>([]);
  const [filters, setFilters] = useState<EventFilters>({ type: "Todos" });

  async function refresh() {
    const data = await listEvents(filters);
    setItems(data);
  }
  useEffect(() => { refresh(); }, [filters]);

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5">Dashboard</Typography>
        <Button variant="contained" onClick={() => nav("/dashboard/novo")} disableElevation>
          Novo evento
        </Button>
      </Stack>

      <Paper sx={{ p: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
          divider={<Divider flexItem orientation="vertical" />}
        >
          <TextField
            select
            label="Tipo"
            value={filters.type ?? "Todos"}
            onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
            sx={{ minWidth: 160 }}
          >
            {TYPES.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </TextField>

          <DatePicker
            label="De"
            value={filters.from ? new Date(filters.from) : null}
            onChange={(d) =>
              setFilters((f) => ({ ...f, from: d ? format(d, "yyyy-MM-dd") : undefined }))
            }
            slotProps={{ textField: { sx: { minWidth: 170 } } }}
          />
          <DatePicker
            label="Até"
            value={filters.to ? new Date(filters.to) : null}
            onChange={(d) =>
              setFilters((f) => ({ ...f, to: d ? format(d, "yyyy-MM-dd") : undefined }))
            }
            slotProps={{ textField: { sx: { minWidth: 170 } } }}
          />

          <Button onClick={() => setFilters({ type: "Todos" })}>Limpar</Button>
        </Stack>
      </Paper>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((e) => (
                <TableRow key={e.id} hover>
                  <TableCell>{e.name}</TableCell>
                  <TableCell>{format(new Date(e.date), "dd/MM/yyyy")}</TableCell>
                  <TableCell>{e.type}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Editar">
                      <IconButton onClick={() => nav(`/dashboard/${e.id}/editar`)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton
                        onClick={async () => {
                          await removeEvent(e.id);
                          refresh();
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>Nenhum evento encontrado.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Stack>
  );
}
