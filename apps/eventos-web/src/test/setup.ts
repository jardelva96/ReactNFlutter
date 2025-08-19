// src/test/setup.ts
import '@testing-library/jest-dom/vitest';

// Corrige o bug do esbuild com TextEncoder/Uint8Array em JSDOM
import { TextEncoder, TextDecoder } from 'node:util';
(Object.assign as any)(globalThis, { TextEncoder, TextDecoder });
// Garante que o instanceof use o mesmo "realm"
(globalThis as any).Uint8Array = Uint8Array;

// Polyfills úteis pro MUI em JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    media: query,
    matches: false,
    onchange: null,
    addListener: () => {},           // deprecated
    removeListener: () => {},        // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(globalThis as any).ResizeObserver = ResizeObserver;
