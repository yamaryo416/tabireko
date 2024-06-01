import { create } from "zustand"

import { EachMarkerImage } from "@/types/marker_image"

// 各マーカーに紐づく画像1つ
export const useEachImgListStore = create<{
  eachImgList: EachMarkerImage
  setEachImgList: (_arg: EachMarkerImage) => void
}>((set) => ({
  eachImgList: {},
  setEachImgList: (arg: EachMarkerImage) => set({ eachImgList: arg }),
}))
