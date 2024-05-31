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

type PropsType = {
  isOpenModal: boolean
  searchWord: string
  searchSuggestList: google.maps.GeocoderResult[]
  onCloseModal: () => void
  onSearchLocation: (e: ChangeEvent<HTMLInputElement>) => void
  onClickSearchLocation: (result: google.maps.GeocoderResult) => void
}

export const SearchLocationModal = ({
  isOpenModal,
  searchWord,
  searchSuggestList,
  onCloseModal,
  onSearchLocation,
  onClickSearchLocation,
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
        <ModalHeader>場所検索</ModalHeader>
        <ModalBody>
          <div className="mb-3">
            <Input
              value={searchWord}
              onChange={onSearchLocation}
            />
            {searchSuggestList.length !== 0 && (
              <Listbox className="border-l border-r border-b">
                {searchSuggestList.map((item) => (
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
