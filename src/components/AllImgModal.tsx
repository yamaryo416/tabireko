import { Modal, ModalContent, ModalBody, ModalHeader } from "@nextui-org/react"
import Image from "next/image"

import { useAllImgListStore } from "../../store/all-img-list"
import { useModalOpenListStore } from "../../store/modal-open-list"
import { useSearch } from "@/hooks/use-search"
import { IMG_LIST } from "@/types/page"

export const AllImgModal = () => {
  const { allImgList } = useAllImgListStore()
  const { modalOpenList, toggleModalOpenList } = useModalOpenListStore()
  const { onClickSearchLocationFromImg } = useSearch()

  return (
    <Modal
      placement="center"
      isOpen={modalOpenList.includes(IMG_LIST)}
      onClose={() => toggleModalOpenList(IMG_LIST)}
      className="mx-5"
    >
      <ModalContent>
        <ModalHeader>画像一覧</ModalHeader>
        <ModalBody className={`grid max-h-[60vh] grid-cols-4 overflow-x-auto`}>
          {allImgList.map((img) => (
            <div key={`all-img-${img.id}`} className="aspect-square w-[100%]">
              <button
                key={`all-img-${img.id}`}
                onClick={() => {
                  if (img.marker_id == null) return
                  onClickSearchLocationFromImg(img.marker_id)
                }}
                className="relative h-[100%] w-[100%]"
              >
                <Image
                  src={img.url}
                  fill
                  sizes="100vw"
                  alt="画像"
                  priority={false}
                  className="object-cover"
                />
              </button>
            </div>
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
