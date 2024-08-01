import { create } from "zustand"

import type { Tag } from "@/types/tag"

// タグ
export const useTagStore = create<{
  tag: Tag | null
  setTag: (_tagArg: Tag | null) => void
}>((set) => ({
  tag: null,
  setTag: (tagArg: Tag | null) => set({ tag: tagArg }),
}))
