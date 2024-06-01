import { OfficialInfo } from "@/types/map"
import { create } from "zustand"

export const INIT_OFFICIAL_INFO: OfficialInfo = {
  title: "",
  description: "",
  webUrl: "",
  googleMapUrl: "",
  photos: [],
}

// 公式情報
export const useOfficialInfoStore = create<{
  officialInfo: OfficialInfo
  setOfficialInfo: (_arg: OfficialInfo) => void
}>((set) => ({
  officialInfo: INIT_OFFICIAL_INFO,
  setOfficialInfo: (arg: OfficialInfo) => set({ officialInfo: arg }),
}))
