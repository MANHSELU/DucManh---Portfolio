import { create } from "zustand";
import { prefersReducedMotion } from "../hooks/useReducedMotion.js";

const PANEL_FALLBACK = 9000;
let panelTimer = 0;

export const useRoomStore = create((set, get) => ({
  focus: null,
  panel: null,
  hovered: null,
  setHovered: (id) => set({ hovered: id }),
  open: (id) => {
    clearTimeout(panelTimer);
    if (prefersReducedMotion()) {
      set({ focus: id, panel: id, hovered: null });
      return;
    }
    set({ focus: id, panel: null, hovered: null });
    panelTimer = setTimeout(() => get().arrived(id), PANEL_FALLBACK);
  },
  arrived: (id) => {
    if (get().focus !== id) return;
    clearTimeout(panelTimer);
    set({ panel: id });
  },
  close: () => {
    clearTimeout(panelTimer);
    set({ focus: null, panel: null });
  },
}));
