import { create } from "zustand"

import { Marker } from "@/types/marker"

// マーカー一覧
export const useMarkerListStore = create<{
  markerList: Marker[]
  setMarkerList: (_markerListArg: Marker[]) => void
}>((set) => ({
  markerList: [],
  setMarkerList: (markerListArg: Marker[]) =>
    set({ markerList: markerListArg }),
}))
