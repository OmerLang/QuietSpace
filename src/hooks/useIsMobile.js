'use client'
import { create } from "zustand";







export const useIsMobile = create((set) => ({
  isMobie: null,
  setIsMobile: (value) => set({ isMobile: value }),
}));





