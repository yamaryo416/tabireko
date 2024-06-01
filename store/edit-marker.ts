import { EditMarker } from "@/types/marker"
import { create } from "zustand"

// マーカー編集用
export const useEditMarkerStore = create<{
  editMarker: EditMarker | null
  setEditMarker: (_arg: EditMarker) => void
}>((set) => ({
  editMarker: null,
  setEditMarker: (arg: EditMarker) => set({ editMarker: arg }),
}))
