import { create } from "zustand"

import type { MarkerOfficialImage } from "@/types/marker_official_image"

// マーカー詳細の公式画像一覧
export const useSelectedMarkerStoreOfficialImgsStore = create<{
  selectedMarkerOfficialImgs: MarkerOfficialImage[]
  setSelectedMarkerOfficialImgs: (_arg: MarkerOfficialImage[]) => void
}>((set) => ({
  selectedMarkerOfficialImgs: [],
  setSelectedMarkerOfficialImgs: (arg: MarkerOfficialImage[]) =>
    set({ selectedMarkerOfficialImgs: arg }),
}))
