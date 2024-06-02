import { DisplayMapMode } from "@/types/map"

export const DISPLAY_BTN_LIST: { key: DisplayMapMode; label: string }[] = [
  { key: "marker", label: "マーカー表示" },
  { key: "img", label: "画像表示" },
  { key: "balloon", label: "吹き出し表示" },
  { key: "off", label: "off" },
]
