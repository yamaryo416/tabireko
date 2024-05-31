import { ChangeEvent } from "react"
import {
  Modal,
  ModalContent,
  ModalBody,
  Input,
  ModalHeader,
  Listbox,
  ListboxItem,
} from "@nextui-org/react"
import { Marker } from "@/types/marker"

type PropsType = {
  isOpenModal: boolean
  searchWord: string
  searchSuggestMarkerList: Marker[]
  onCloseModal: () => void
  onSearchMarker: (e: ChangeEvent<HTMLInputElement>) => void
  onSelectMarker: (markerId: number) => void
}

export const SearchMarkerModal = ({
  isOpenModal,
  searchWord,
  searchSuggestMarkerList,
  onCloseModal,
  onSearchMarker,
  onSelectMarker,
}: PropsType) => {
  return (
    <Modal
      placement="center"
      isOpen={isOpenModal}
      onClose={onCloseModal}
      isDismissable={false}
      className="mx-10"
    >
      <ModalContent>
        <ModalHeader>記録検索</ModalHeader>
        <ModalBody>
          <div className="mb-3">
            <Input value={searchWord} onChange={onSearchMarker} />
            {searchSuggestMarkerList.length !== 0 && (
              <Listbox className="border-l border-r border-b">
                {searchSuggestMarkerList.map((marker) => (
                  <ListboxItem
                    key={`suggest-marker-${marker.id}`}
                    onClick={() => onSelectMarker(marker.id)}
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
