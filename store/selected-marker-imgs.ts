import { create } from "zustand"

import { MarkerImage } from "@/types/marker_image"

// マーカー詳細モーダルに表示するマーカーの画像一覧
export const useSelectedMarkerImgsStore = create<{
  selectedMarkerImgs: MarkerImage[]
  setSelectedMarkerImgs: (_arg: MarkerImage[]) => void
}>((set) => ({
  selectedMarkerImgs: [],
  setSelectedMarkerImgs: (arg: MarkerImage[]) =>
    set({ selectedMarkerImgs: arg }),
}))
