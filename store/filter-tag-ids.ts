import { create } from "zustand"

// 表示しているマーカーのタグでのフィルター用
export const useFilterTagIdsStore = create<{
  filterTagIds: number[]
  setFilterTagIds: (_filterTagIdsArg: number[]) => void
  toggleFilterTagIds: (_num: number) => void
  reset: () => void
}>((set) => ({
  filterTagIds: [],
  setFilterTagIds: (filterTagIdsArg: number[]) =>
    set({ filterTagIds: filterTagIdsArg }),
  toggleFilterTagIds: (num: number) => {
    set((prevTagIds) => {
      if (prevTagIds.filterTagIds.includes(num)) {
        return {
          filterTagIds: prevTagIds.filterTagIds.filter((item) => item !== num),
        }
      } else {
        return { filterTagIds: [...prevTagIds.filterTagIds, num] }
      }
    })
  },
  reset: () => {
    set({ filterTagIds: [] })
  },
}))
