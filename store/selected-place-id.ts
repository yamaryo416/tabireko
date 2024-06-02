import { create } from "zustand"

export const useSelectedPlaceIdStore = create<{
  selectedPlaceId: string | null
  setSelectedPlaceId: (_arg: string | null) => void
}>((set) => ({
  selectedPlaceId: null,
  setSelectedPlaceId: (arg: string | null) => set({ selectedPlaceId: arg }),
}))
