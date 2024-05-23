import { Flash } from "@/types/flash"
import { Marker } from "@/types/marker"
import { MarkerImage } from "@/types/marker_image"
import { deleteMarker } from "@/utils/api/marker"
import {
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
  Button,
} from "@nextui-org/react"
import Image from "next/image"
import { Dispatch, SetStateAction, useState } from "react"
import { MarkerDeleteModal } from "./MarkerDeleteModal"
import { MarkerOfficialImage } from "@/types/marker_official_image"

type PropsType = {
  selectedMarker: Marker | null
  selectedMarkerImgs: MarkerImage[]
  selectedMarkerOfficialImgs: MarkerOfficialImage[]
  isOpenDetailModal: boolean
  setSelectedMarker: Dispatch<SetStateAction<Marker | null>>
  setMarkerList: Dispatch<SetStateAction<Marker[]>>
  setFlash: Dispatch<SetStateAction<Flash | null>>
  onCloseDetailModal: () => void
  onOpenEditMarker: () => void
}

export const MarkerDetailModal = ({
  selectedMarker,
  selectedMarkerImgs,
  selectedMarkerOfficialImgs,
  isOpenDetailModal,
  setSelectedMarker,
  setMarkerList,
  setFlash,
  onCloseDetailModal,
  onOpenEditMarker,
}: PropsType) => {
  const [isOfficialOpen, setIsOfficialOpen] = useState(false)
  // マーカー削除用モーダル関連
  const {
    isOpen: isOpenDeleteMarkerModal,
    onOpen: onOpenDeleteMarkerModal,
    onClose: onCloseDeleteMarkerModal,
  } = useDisclosure()

  const handleDelete = async () => {
    if (!selectedMarker) return
    const id = selectedMarker.id
    const { error } = await deleteMarker(id)
    if (!!error) {
      setFlash({ kind: "failed", message: "記録の削除に失敗しました" })
      return
    }
    setFlash({ kind: "success", message: "記録を削除しました。" })
    setSelectedMarker(null)
    setMarkerList((prevMarkerList) => [
      ...prevMarkerList.filter((marker) => marker.id !== id),
    ])
    onCloseDeleteMarkerModal()
    onCloseDetailModal()
  }

  return (
    <Modal
      placement="center"
      isOpen={isOpenDetailModal}
      onClose={onCloseDetailModal}
      className="mx-10"
    >
      <ModalContent>
        <ModalBody className="overflow-scroll max-h-[60vh]">
          {!!selectedMarker?.official_google_map_url &&
            selectedMarker.official_google_map_url != "" && (
              <a
                href={selectedMarker.official_google_map_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                google mapで確認
              </a>
            )}
          <small className="text-default-500">
            {selectedMarker
              ? selectedMarker.visited_datetime.slice(0, 13).replace("T", " ")
              : ""}
            時
          </small>
          <h4 className="font-bold text-large">
            {selectedMarker?.title || ""}
          </h4>
          <p className="whitespace-pre-wrap">{selectedMarker?.content || ""}</p>
          {!!selectedMarker?.official_title &&
            selectedMarker.official_title !== "" && (
              <>
                {isOfficialOpen ? (
                  <>
                    <small className="text-default-500">
                      {selectedMarker.official_title}
                    </small>
                    {!!selectedMarker?.official_description &&
                      selectedMarker.official_description !== "" && (
                        <small className="text-default-500 whitespace-pre-wrap">
                          {selectedMarker.official_description}
                        </small>
                      )}
                    {!!selectedMarker?.official_web_url &&
                      selectedMarker.official_web_url !== "" && (
                        <a
                          className="text-blue-500"
                          href={selectedMarker.official_web_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {selectedMarker.official_web_url}
                        </a>
                      )}
                    <div className="flex flex-wrap">
                      {selectedMarkerOfficialImgs.map((img) => (
                        <Image
                          alt={`official-img-${img.id}`}
                          key={img.id}
                          src={img.url}
                          height={400}
                          width={400}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <button
                    className="text-blue-500"
                    onClick={() => setIsOfficialOpen(true)}
                  >
                    公式情報
                  </button>
                )}
              </>
            )}
          {selectedMarkerImgs.map((img) => (
            <Image
              key={img.id}
              src={img.url}
              width={400}
              height={400}
              alt="avatar image"
              className="inline"
              priority={false}
            />
          ))}
          <div className="flex justify-center">
            <Button color="success" onClick={onOpenEditMarker}>
              編集
            </Button>
            <Button color="danger" onClick={onOpenDeleteMarkerModal}>
              削除
            </Button>
          </div>
          <MarkerDeleteModal
            isOpen={isOpenDeleteMarkerModal}
            handleDelete={handleDelete}
            onClose={onCloseDeleteMarkerModal}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
