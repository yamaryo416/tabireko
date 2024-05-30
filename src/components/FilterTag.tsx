import { Tag } from "@/types/tag"
import {
  Button,
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react"
import Image from "next/image"
import { Dispatch, SetStateAction } from "react"
import { DisplayMode } from "@/types/page"
import { SearchLocationFromImageModal } from "./SearchLocationFromImageModal"
import { MarkerImage } from "@/types/marker_image"

const DISPLAY_MAPPING = {
  img: "画像表示",
  balloon: "吹き出し表示",
  off: "OFF",
}

type PropsType = {
  displayMode: DisplayMode
  tagList: Tag[]
  isOpenFilterTagModal: boolean
  filterTagIds: number[]
  isOpenSearchLocationFromImgModal: boolean
  allImgList: MarkerImage[]
  setDisplayMode: Dispatch<SetStateAction<DisplayMode>>
  setFilterTagIds: Dispatch<SetStateAction<number[]>>
  onOpenFilterTagModal: () => void
  toggleFilterTagIds: (id: number) => void
  onCloseFilterTagModal: () => void
  onClickSearchLocationFromImg: (markerId: number) => void
  onOpenSearchLocationFromImgModal: () => void
  onCloseSearchLocationFromImgModal: () => void
}

export const FilterTag = ({
  displayMode,
  tagList,
  isOpenFilterTagModal,
  filterTagIds,
  isOpenSearchLocationFromImgModal,
  allImgList,
  setDisplayMode,
  setFilterTagIds,
  onOpenFilterTagModal,
  toggleFilterTagIds,
  onCloseFilterTagModal,
  onClickSearchLocationFromImg,
  onOpenSearchLocationFromImgModal,
  onCloseSearchLocationFromImgModal,
}: PropsType) => {
  if (tagList.length === 0) return <></>
  return (
    <>
      <div className="flex justify-between">
        <Dropdown>
          <DropdownTrigger>
            <Button variant="light">{DISPLAY_MAPPING[displayMode]}</Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions" variant="light">
            <DropdownItem key="new" onClick={() => setDisplayMode("img")}>
              画像表示
            </DropdownItem>
            <DropdownItem
              key="balloon"
              onClick={() => setDisplayMode("balloon")}
            >
              吹き出し表示
            </DropdownItem>
            <DropdownItem key="off" onClick={() => setDisplayMode("off")}>
              OFF
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Dropdown
          showArrow
          classNames={{
            base: "before:bg-default-200", // change arrow background
            content:
              "py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black",
          }}
        >
          <DropdownTrigger>
            <Button variant="light">メニュー</Button>
          </DropdownTrigger>
          <DropdownMenu
            variant="faded"
            aria-label="Dropdown menu with description"
          >
            <DropdownSection title="メニュー">
              <DropdownItem
                key="search_location_from_img"
                description="image list"
                startContent={
                  <Image
                    src="images/image_icon.svg"
                    alt="画像のアイコン"
                    width={20}
                    height={20}
                  />
                }
                onClick={onOpenSearchLocationFromImgModal}
              >
                画像一覧
              </DropdownItem>
              <DropdownItem
                key="filter_tag"
                description="filter tag"
                startContent={
                  <Image
                    src="images/filter_icon.svg"
                    alt="絞り込みのアイコン"
                    width={20}
                    height={20}
                  />
                }
                onClick={onOpenFilterTagModal}
              >
                タグで絞り込み
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      </div>
      <Modal
        placement="center"
        isOpen={isOpenFilterTagModal}
        onClose={onCloseFilterTagModal}
        isDismissable={false}
        className="mx-10"
      >
        <ModalContent>
          <ModalHeader>タグでの絞り込み</ModalHeader>
          <ModalBody>
            {tagList.map((tag) => (
              <Checkbox
                isSelected={filterTagIds.includes(tag.id)}
                key={tag.id}
                onClick={() => toggleFilterTagIds(tag.id)}
              >
                <span className="flex items-center">
                  {tag.icon && (
                    <Image
                      alt="マップのアイコン"
                      src={tag.icon?.url}
                      width={20}
                      height={50}
                    />
                  )}
                  <span>{tag.name}</span>
                </span>
              </Checkbox>
            ))}
            <Checkbox
              isSelected={filterTagIds.includes(0)}
              onClick={() => toggleFilterTagIds(0)}
            >
              タグなし
            </Checkbox>
            <Link onClick={() => setFilterTagIds([])}>チェックを全て外す</Link>
            <Button
              type="button"
              color="primary"
              variant="light"
              onPress={onCloseFilterTagModal}
            >
              閉じる
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
      <SearchLocationFromImageModal
        allImgList={allImgList}
        isOpenModal={isOpenSearchLocationFromImgModal}
        onCloseModal={onCloseSearchLocationFromImgModal}
        onClickSearchLocationFromImg={onClickSearchLocationFromImg}
      />
    </>
  )
}
