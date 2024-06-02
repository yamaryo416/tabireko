import { create } from "zustand"

// 公式情報
export const useOfficialInfoListStore = create<{
  officialInfoList: google.maps.places.PlaceResult[]
  setOfficialInfoList: (_arg: google.maps.places.PlaceResult[]) => void
}>((set) => ({
  officialInfoList: [],
  setOfficialInfoList: (arg: google.maps.places.PlaceResult[]) =>
    set({ officialInfoList: arg }),
}))
