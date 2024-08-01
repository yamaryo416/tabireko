import Image from "next/image"

import { Menu } from "./Menu"
import { ToggleDisplayBtn } from "./ToggleDisplayBtn"
import { useTagStore } from "../../store/tag"

export const Header = () => {
  const { tag } = useTagStore()

  return (
    <div className="grid grid-cols-3">
      <ToggleDisplayBtn />
      <div className="flex justify-center py-2">
        {tag == null ? (
          <Image alt="ロゴ" src="/images/logo.png" width={100} height={25} />
        ) : (
          <h1 className="text-3xl font-bold">{tag.name}.map</h1>
        )}
      </div>
      {tag == null && <Menu />}
    </div>
  )
}
