/* src/pages/Home.test.tsx */
// @vitest-environment jsdom
import { it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// ---- stubs necessários só para o teste (MUI usa matchMedia em jsdom)
if (!(window as any).matchMedia) {
  (window as any).matchMedia = vi.fn().mockImplementation(() => ({
    matches: false,
    media: "",
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

// ---- “finge” o AuthContext para o Home não quebrar (sem tocar no app)
vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({ user: null, signIn: vi.fn(), signOut: vi.fn() }),
  AuthProvider: ({ children }: any) => children,
}));
// cobre também o alias "@/..." caso o Home importe assim
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ user: null, signIn: vi.fn(), signOut: vi.fn() }),
  AuthProvider: ({ children }: any) => children,
}));

import Home from "./Home";

function renderUI() {
  return render(
    <ThemeProvider theme={createTheme()}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MemoryRouter initialEntries={["/"]}>
          <Home />
        </MemoryRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

// smoke: se render() não lançar erro, o teste passa
it("smoke: Home renderiza sem crash", () => {
  const { container } = renderUI();
  expect(container.firstChild).toBeTruthy();
});
