import type { DisplayMapMode } from "@/types/map"
import { create } from "zustand"

// google mapに画像or吹き出しor何も表示しないを制御する
export const useDisplayMapModeStore = create<{
  displayMapMode: DisplayMapMode
  setDisplayMapMode: (_displayMapModeArg: DisplayMapMode) => void
}>((set) => ({
  displayMapMode: "img",
  setDisplayMapMode: (displayMapModeArg: DisplayMapMode) =>
    set({ displayMapMode: displayMapModeArg }),
}))
