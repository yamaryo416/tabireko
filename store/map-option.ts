import type { MapOption } from "@/types/map"
import { create } from "zustand"

// 表示するgoogle mapのズームの倍率と中心位置
export const useMapOptionStore = create<{
  mapOption: MapOption
  setMapOption: (_mapOptionArg: MapOption) => void
}>((set) => ({
  mapOption: {
    center: {
      lat: 35.68124643324741,
      lng: 139.7672516618131,
    },
    zoom: 15,
  },
  setMapOption: (mapOptionArg: MapOption) => set({ mapOption: mapOptionArg }),
}))
