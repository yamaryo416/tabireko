import Image from "next/image"
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/react"

import { MENU_LIST, PUBLIC_MENU_LIST } from "@/types/page"
import { useModalOpenListStore } from "../../store/modal-open-list"
import { useTagStore } from "../../store/tag"

export const Menu = () => {
  const { toggleModalOpenList } = useModalOpenListStore()
  const { tag } = useTagStore()

  const menuList = tag === null ? MENU_LIST : PUBLIC_MENU_LIST

  return (
    <div className="flex justify-end pr-3">
      <Dropdown
        showArrow
        classNames={{
          base: "before:bg-default-200", // change arrow background
          content:
            "py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black",
        }}
      >
        <DropdownTrigger>
          <button type="button">
            <Image
              alt="メニューのアイコン"
              src="images/burger_menu_icon.svg"
              width={20}
              height={20}
            />
          </button>
        </DropdownTrigger>
        <DropdownMenu variant="faded" aria-label="メニュー">
          <DropdownSection title="メニュー">
            {menuList.map((item) => (
              <DropdownItem
                key={item.key}
                description={item.description}
                startContent={
                  <Image
                    src={`images/${item.img}`}
                    alt={`${item.label}のアイコン`}
                    width={20}
                    height={20}
                  />
                }
                onPress={() => toggleModalOpenList(item.key)}
              >
                {item.label}
              </DropdownItem>
            ))}
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}
