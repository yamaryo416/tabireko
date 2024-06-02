import { create } from "zustand"

import { MarkerImage } from "@/types/marker_image"

// 全ての画像一覧用
export const useAllImgListStore = create<{
  allImgList: MarkerImage[]
  setAllImgList: (_allImgListArg: MarkerImage[]) => void
}>((set) => ({
  allImgList: [],
  setAllImgList: (allImgListArg: MarkerImage[]) =>
    set({ allImgList: allImgListArg }),
}))
