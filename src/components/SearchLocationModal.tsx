import { ChangeEvent, useEffect } from "react"
import {
  Modal,
  ModalContent,
  ModalBody,
  Input,
  ModalHeader,
  Listbox,
  ListboxItem,
} from "@nextui-org/react"
import { useSearchLocationStore } from "../../store/search-location"
import { useDebounce } from "use-debounce"
import { useModalOpenListStore } from "../../store/modal-open-list"
import { useSearch } from "@/hooks/use-search"
import { SEARCH_LOCATION } from "@/types/page"

export const SearchLocationModal = () => {
  const { modalOpenList, toggleModalOpenList } = useModalOpenListStore()
  const { searchLocation, setSearchLocation, reset } = useSearchLocationStore()
  const { onClickSearchLocation } = useSearch()

  const changeSearchLocationKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchLocation({
      keyword: e.target.value,
      suggestionList: searchLocation.suggestionList,
    })
  }

  // 入力が3秒ない場合に、キーワードを代入
  const [confirmedSearchWord] = useDebounce(searchLocation.keyword, 1000)

  // 検索キーワード入力後のGoogle map apiにて候補一覧を取得
  useEffect(() => {
    if (confirmedSearchWord === "") {
      reset()
      return
    }
    const geocoder = new google.maps.Geocoder()
    geocoder.geocode(
      { address: confirmedSearchWord },
      async (results, status) => {
        if (status === "OK" && results) {
          setSearchLocation({
            keyword: searchLocation.keyword,
            suggestionList: results,
          })
        }
      },
    )
  }, [confirmedSearchWord])

  return (
    <Modal
      placement="center"
      isOpen={modalOpenList.includes(SEARCH_LOCATION)}
      onClose={() => toggleModalOpenList(SEARCH_LOCATION)}
      isDismissable={false}
      className="mx-10"
    >
      <ModalContent>
        <ModalHeader>場所検索</ModalHeader>
        <ModalBody>
          <div className="mb-3">
            <Input
              value={searchLocation.keyword}
              onChange={changeSearchLocationKeyword}
              placeholder="日本橋"
            />
            {searchLocation.suggestionList.length !== 0 && (
              <Listbox className="border-b border-l border-r">
                {searchLocation.suggestionList.map((item) => (
                  <ListboxItem
                    key={item.place_id}
                    onClick={() => onClickSearchLocation(item)}
                  >
                    {item.formatted_address}
                  </ListboxItem>
                ))}
              </Listbox>
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
