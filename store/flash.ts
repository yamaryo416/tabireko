import { Flash } from "@/types/flash"
import { create } from "zustand"

export const useFlashStore = create<{
  flash: Flash | null
  setFlash: (_flashArg: Flash) => void
  reset: () => void
}>((set) => ({
  flash: null,
  setFlash: (flashArg: Flash) => set({ flash: flashArg }),
  reset: () => set({ flash: null }),
}))
