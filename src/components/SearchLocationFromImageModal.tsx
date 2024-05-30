import { MarkerImage } from "@/types/marker_image"
import {
  Modal,
  ModalContent,
  ModalBody,
  Button,
  ModalHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react"
import Image from "next/image"
import { useState } from "react"

type PropsType = {
  allImgList: MarkerImage[]
  isOpenModal: boolean
  onCloseModal: () => void
  onClickSearchLocationFromImg: (markerId: number) => void
}

export const SearchLocationFromImageModal = ({
  allImgList,
  isOpenModal,
  onCloseModal,
  onClickSearchLocationFromImg,
}: PropsType) => {
  const [rowCount, setRowCount] = useState(4)
  return (
    <Modal
      placement="center"
      isOpen={isOpenModal}
      onClose={onCloseModal}
      className="mx-5"
    >
      <ModalContent>
        <ModalHeader>画像一覧</ModalHeader>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="light">表示列</Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions" variant="light">
            {[...Array(2)].map((_, i) => (
              <DropdownItem
                key={i * 2 + 2}
                onClick={() => setRowCount(i * 2 + 2)}
                onPress={() => setRowCount(i * 2 + 2)}
              >
                {i * 2 + 2}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        <ModalBody
          className={`overflow-x-auto max-h-[60vh] grid grid-cols-${rowCount}`}
        >
          {allImgList.map((img) => (
            <button
              key={img.id}
              onClick={() => {
                if (img.marker_id == null) return
                onClickSearchLocationFromImg(img.marker_id)
              }}
              className="block"
            >
              <Image
                src={img.url}
                width={200}
                height={200}
                alt="画像"
                priority={false}
              />
            </button>
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
