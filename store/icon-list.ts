import { create } from "zustand"

import type { Icon } from "@/types/icon"

// タグに設定するアイコン一覧
export const useIconListStore = create<{
  iconList: Icon[]
  setIconList: (_arg: Icon[]) => void
}>((set) => ({
  iconList: [],
  setIconList: (arg: Icon[]) => set({ iconList: arg }),
}))
