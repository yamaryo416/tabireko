import Image from "next/image"

import { Menu } from "./Menu"
import { ToggleDisplayBtn } from "./ToggleDisplayBtn"

export const Header = () => {
  return (
    <div className="grid grid-cols-3">
      <ToggleDisplayBtn />
      <div className="flex justify-center">
        <Image alt="ロゴ" src="/images/logo.png" width={100} height={25} />
      </div>
      <Menu />
    </div>
  )
}
