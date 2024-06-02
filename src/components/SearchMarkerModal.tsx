import {
  Modal,
  ModalContent,
  ModalBody,
  Input,
  ModalHeader,
  Listbox,
  ListboxItem,
} from "@nextui-org/react"

import { useSearchMarkerStore } from "../../store/search-marker"
import { useModalOpenListStore } from "../../store/modal-open-list"
import { useSearch } from "@/hooks/use-search"
import { SEARCH_MARKER } from "@/types/page"

export const SearchMarkerModal = () => {
  const { searchMarker } = useSearchMarkerStore()
  const { modalOpenList, toggleModalOpenList } = useModalOpenListStore()
  const { onSearchMarker, onClickSearchLocationFromImg } = useSearch()

  return (
    <Modal
      placement="center"
      isOpen={modalOpenList.includes(SEARCH_MARKER)}
      onClose={() => toggleModalOpenList(SEARCH_MARKER)}
      isDismissable={false}
      className="mx-10"
    >
      <ModalContent>
        <ModalHeader>記録検索</ModalHeader>
        <ModalBody>
          <div className="mb-3">
            <Input
              value={searchMarker.keyword}
              onChange={onSearchMarker}
              placeholder="パスタが美味しいお店"
            />
            {searchMarker.suggestionList.length !== 0 && (
              <Listbox className="border-b border-l border-r">
                {searchMarker.suggestionList.map((marker) => (
                  <ListboxItem
                    key={`suggest-marker-${marker.id}`}
                    onClick={() => onClickSearchLocationFromImg(marker.id)}
                  >
                    {marker.title}
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
