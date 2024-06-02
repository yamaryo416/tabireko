import { create } from "zustand"

type CurrentPosition = {
  lat: number
  lng: number
}

// 公式情報
export const useCurrentPositionStore = create<{
  currentPosition: CurrentPosition | null
  setCurrentPosition: (_arg: CurrentPosition) => void
}>((set) => ({
  currentPosition: null,
  setCurrentPosition: (arg: CurrentPosition) => set({ currentPosition: arg }),
}))
