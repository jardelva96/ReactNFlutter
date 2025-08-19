import { Routes, Route, Link as RouterLink } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import EventFormPage from "./pages/EventFormPage";
import PrivateRoute from "./routes/PrivateRoute";
import { useAuth } from "./contexts/AuthContext";

import {
  AppBar,
  Toolbar,
  Button,
  Container,
  Stack,
  Typography,
} from "@mui/material";

export default function App() {
  const { user, logout } = useAuth();

  return (
    <>
      <AppBar position="sticky" elevation={1} color="inherit">
        <Toolbar sx={{ gap: 1 }}>
          <Typography variant="h6" sx={{ mr: 2 }}>
            Gestão de Eventos
          </Typography>

          <Stack direction="row" spacing={1}>
            <Button component={RouterLink} to="/" color="primary">
              Home
            </Button>
            <Button component={RouterLink} to="/dashboard" color="primary">
              Dashboard
            </Button>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ ml: "auto" }}>
            {!user ? (
              <Button
                variant="contained"
                component={RouterLink}
                to="/login"
                disableElevation
              >
                Login
              </Button>
            ) : (
              <Button variant="outlined" onClick={logout}>
                Sair
              </Button>
            )}
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Rotas protegidas */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/novo" element={<EventFormPage />} />
            <Route path="/dashboard/:id/editar" element={<EventFormPage />} />
          </Route>

          <Route path="*" element={<div>Página não encontrada</div>} />
        </Routes>
      </Container>
    </>
  );
}
