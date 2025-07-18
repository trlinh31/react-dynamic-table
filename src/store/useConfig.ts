import { create } from "zustand";

type ConfigState = {
  fontSize: number;
  fontFamily: string;
  setFontSize: (fontSize: number) => void;
  setFontFamily: (fontFamily: string) => void;
};

export const useConfigStore = create<ConfigState>((set) => ({
  fontSize: 16,
  fontFamily: "SF Pro Display",
  setFontSize: (fontSize: number) => set({ fontSize: fontSize }),
  setFontFamily: (fontFamily: string) => set({ fontFamily: fontFamily }),
}));
