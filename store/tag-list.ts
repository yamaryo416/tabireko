import { create } from "zustand"

import type { Tag } from "@/types/tag"

// タグ一覧
export const useTagListStore = create<{
  tagList: Tag[]
  setTagList: (_tagListArg: Tag[]) => void
}>((set) => ({
  tagList: [],
  setTagList: (tagListArg: Tag[]) => set({ tagList: tagListArg }),
}))
