import { Marker } from "@/types/marker"
import { create } from "zustand"

// マーカー詳細モーダルに表示するマーカー
export const useSelectedMarkerStore = create<{
  selectedMarker: Marker | null
  setSelectedMarker: (_arg: Marker | null) => void
}>((set) => ({
  selectedMarker: null,
  setSelectedMarker: (arg: Marker | null) => set({ selectedMarker: arg }),
}))
