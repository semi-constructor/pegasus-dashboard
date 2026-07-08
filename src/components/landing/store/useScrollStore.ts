import { create } from 'zustand';

interface ScrollState {
  progress: number;
  activeSection: number;
  setProgress: (progress: number) => void;
  setActiveSection: (section: number) => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  progress: 0,
  activeSection: 0,
  setProgress: (progress) => set({ progress }),
  setActiveSection: (activeSection) => set({ activeSection }),
}));
