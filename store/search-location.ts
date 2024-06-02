import { SearchLocation } from "@/types/map"
import { create } from "zustand"

// 場所検索キーワードと候補一覧
export const useSearchLocationStore = create<{
  searchLocation: SearchLocation
  setSearchLocation: (_searchLocationArg: SearchLocation) => void
  reset: () => void
}>((set) => ({
  searchLocation: {
    keyword: "",
    suggestionList: [],
  },
  setSearchLocation: (searchLocationArg: SearchLocation) =>
    set({ searchLocation: searchLocationArg }),
  reset: () => set({ searchLocation: { keyword: "", suggestionList: [] } }),
}))
