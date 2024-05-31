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
import { ChangeEvent, Dispatch, SetStateAction } from "react"
import { DisplayMode } from "@/types/page"
import { SearchLocationFromImageModal } from "./SearchLocationFromImageModal"
import { MarkerImage } from "@/types/marker_image"
import { Marker } from "@/types/marker"
import { CalendarModal } from "./CalendarModal"
import { SearchLocationModal } from "./SearchLocationModal"
import { SearchMarkerModal } from "./SearchMarkerModal"

const DISPLAY_MAPPING = {
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

type PropsType = {
  displayMode: DisplayMode
  tagList: Tag[]
  isOpenFilterTagModal: boolean
  filterTagIds: number[]
  isOpenSearchLocationFromImgModal: boolean
  allImgList: MarkerImage[]
  markerList: Marker[]
  isOpenCalendarModal: boolean
  onOpenCalendarModal: () => void
  onCloseCalendarModal: () => void
  setDisplayMode: Dispatch<SetStateAction<DisplayMode>>
  setFilterTagIds: Dispatch<SetStateAction<number[]>>
  onOpenFilterTagModal: () => void
  toggleFilterTagIds: (id: number) => void
  onCloseFilterTagModal: () => void
  onClickSearchLocationFromImg: (markerId: number) => void
  onOpenSearchLocationFromImgModal: () => void
  onCloseSearchLocationFromImgModal: () => void
  isOpenSearchLocationModal: boolean
  searchWord: string
  searchSuggestList: google.maps.GeocoderResult[]
  onOpenSearchLocationModal: () => void
  onCloseSearchLocationModal: () => void
  onSearchLocation: (e: ChangeEvent<HTMLInputElement>) => void
  onClickSearchLocation: (result: google.maps.GeocoderResult) => void
  isOpenSearchMarkerModal: boolean
  searchMarkerWord: string
  searchSuggestMarkerList: Marker[]
  onSearchMarker: (e: ChangeEvent<HTMLInputElement>) => void
  onOpenSearchMarkerModal: () => void
  onCloseSearchMarkerModal: () => void
}

export const FilterTag = ({
  displayMode,
  tagList,
  isOpenFilterTagModal,
  filterTagIds,
  isOpenSearchLocationFromImgModal,
  allImgList,
  markerList,
  isOpenCalendarModal,
  onOpenCalendarModal,
  onCloseCalendarModal,
  setDisplayMode,
  setFilterTagIds,
  onOpenFilterTagModal,
  toggleFilterTagIds,
  onCloseFilterTagModal,
  onClickSearchLocationFromImg,
  onOpenSearchLocationFromImgModal,
  onCloseSearchLocationFromImgModal,
  isOpenSearchLocationModal,
  searchWord,
  searchSuggestList,
  onOpenSearchLocationModal,
  onCloseSearchLocationModal,
  onSearchLocation,
  onClickSearchLocation,
  isOpenSearchMarkerModal,
  searchMarkerWord,
  searchSuggestMarkerList,
  onSearchMarker,
  onOpenSearchMarkerModal,
  onCloseSearchMarkerModal,
}: PropsType) => {
  if (tagList.length === 0) return <></>
  return (
    <>
      <div className="grid grid-cols-3 items-center py-2">
        <div className="flex pl-3">
          <Dropdown>
            <DropdownTrigger>
              <button className="text-[12px]">
                {DISPLAY_MAPPING[displayMode]}
              </button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions" variant="light">
              <DropdownItem
                key="img"
                onPress={() => setDisplayMode("img")}
                onClick={() => setDisplayMode("img")}
              >
                画像表示
              </DropdownItem>
              <DropdownItem
                key="balloon"
                onPress={() => setDisplayMode("balloon")}
                onClick={() => setDisplayMode("balloon")}
              >
                吹き出し表示
              </DropdownItem>
              <DropdownItem
                key="off"
                onPress={() => setDisplayMode("off")}
                onClick={() => setDisplayMode("off")}
              >
                OFF
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <Image alt="ロゴ" src="/images/logo.png" width={100} height={25} />
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
              <button>
                <Image
                  alt="メニューのアイコン"
                  src="images/burger_menu_icon.svg"
                  width={20}
                  height={20}
                />
              </button>
            </DropdownTrigger>
            <DropdownMenu
              variant="faded"
              aria-label="Dropdown menu with description"
            >
              <DropdownSection title="メニュー">
                <DropdownItem
                  key="calendar"
                  description="calendar"
                  startContent={
                    <Image
                      src="images/calendar_icon.svg"
                      alt="カレンダーのアイコン"
                      width={20}
                      height={20}
                    />
                  }
                  onClick={onOpenCalendarModal}
                  onPress={onOpenCalendarModal}
                >
                  カレンダー
                </DropdownItem>
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
                  onPress={onOpenSearchLocationFromImgModal}
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
                  onPress={onOpenFilterTagModal}
                >
                  タグで絞り込み
                </DropdownItem>
                <DropdownItem
                  key="filter_tag"
                  description="filter tag"
                  startContent={
                    <Image
                      src="images/search_icon.svg"
                      alt="虫眼鏡のアイコン"
                      width={20}
                      height={20}
                    />
                  }
                  onClick={onOpenSearchLocationModal}
                  onPress={onOpenSearchLocationModal}
                >
                  場所検索
                </DropdownItem>
                <DropdownItem
                  key="filter_tag"
                  description="filter tag"
                  startContent={
                    <Image
                      src="images/search_icon.svg"
                      alt="虫眼鏡のアイコン"
                      width={20}
                      height={20}
                    />
                  }
                  onClick={onOpenSearchMarkerModal}
                  onPress={onOpenSearchMarkerModal}
                >
                  記録検索
                </DropdownItem>
              </DropdownSection>
            </DropdownMenu>
          </Dropdown>
        </div>
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
      <CalendarModal
        markerList={markerList}
        isOpenModal={isOpenCalendarModal}
        onCloseModal={onCloseCalendarModal}
        onClickSearchLocationFromImg={onClickSearchLocationFromImg}
      />
      <SearchLocationModal
        isOpenModal={isOpenSearchLocationModal}
        searchWord={searchWord}
        searchSuggestList={searchSuggestList}
        onClickSearchLocation={onClickSearchLocation}
        onCloseModal={onCloseSearchLocationModal}
        onSearchLocation={onSearchLocation}
      />
      <SearchMarkerModal
        isOpenModal={isOpenSearchMarkerModal}
        searchWord={searchMarkerWord}
        searchSuggestMarkerList={searchSuggestMarkerList}
        onCloseModal={onCloseSearchMarkerModal}
        onSearchMarker={onSearchMarker}
        onSelectMarker={onClickSearchLocationFromImg}
      />
    </>
  )
}
