import { create } from "zustand"

export const useLoadingStore = create<{
  loading: boolean
  setLoading: (_arg: boolean) => void
}>((set) => ({
  loading: false,
  setLoading: (arg: boolean) => set({ loading: arg }),
}))
