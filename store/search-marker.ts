import { SearchMarker } from "@/types/map"
import { create } from "zustand"

// マーカー検索キーワードと候補一覧
export const useSearchMarkerStore = create<{
  searchMarker: SearchMarker
  setSearchMarker: (_searchMarkerArg: SearchMarker) => void
  reset: () => void
}>((set) => ({
  searchMarker: {
    keyword: "",
    suggestionList: [],
  },
  setSearchMarker: (searchMarkerArg: SearchMarker) =>
    set({ searchMarker: searchMarkerArg }),
  reset: () => set({ searchMarker: { keyword: "", suggestionList: [] } }),
}))
