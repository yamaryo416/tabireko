import { NewMarker } from "@/types/marker"
import { getLocalTimeZone, now } from "@internationalized/date"
import { create } from "zustand"

export const INIT_NEW_MARKER = {
  title: "",
  content: "",
  lat: 0,
  lng: 0,
  visited_datetime: now(getLocalTimeZone()),
  tagId: 0,
  images: [],
}

// マーカー作成用
export const useNewMarkerStore = create<{
  newMarker: NewMarker
  setNewMarker: (_newMarkerArg: NewMarker) => void
}>((set) => ({
  newMarker: INIT_NEW_MARKER,
  setNewMarker: (newMarkerArg: NewMarker) => set({ newMarker: newMarkerArg }),
}))
