import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react"
import Image from "next/image"
import { useDisplayMapModeStore } from "../../store/map-display-mode"
import { DISPLAY_BTN_LIST } from "../../constants/page"

const DISPLAY_MAPPING = {
  marker: (
    <Image
      alt="マーカーのアイコン"
      src="https://maps.google.com/mapfiles/kml/paddle/O.png"
      width={20}
      height={20}
    />
  ),
  img: (
    <Image
      alt="画像のアイコン"
      src="images/image_icon.svg"
      width={20}
      height={20}
    />
  ),
  balloon: (
    <Image
      alt="吹き出しのアイコン"
      src="images/speech_bubble_icon.svg"
      width={20}
      height={20}
    />
  ),
  off: "OFF",
}

export const ToggleDisplayBtn = () => {
  const { displayMapMode, setDisplayMapMode } = useDisplayMapModeStore()

  return (
    <div className="flex pl-3">
      <Dropdown>
        <DropdownTrigger>
          <button type="button" className="text-[12px]">
            {DISPLAY_MAPPING[displayMapMode]}
          </button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions" variant="light">
          {DISPLAY_BTN_LIST.map((item) => (
            <DropdownItem
              key={item.key}
              onPress={() => setDisplayMapMode(item.key)}
            >
              {item.label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}
