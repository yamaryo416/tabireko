import { Modal, ModalContent, ModalBody, Button } from "@nextui-org/react"
import Image from "next/image"
import { useState } from "react"

import { formatDatetime } from "@/utils/datetime"
import { useSelectedMarkerStore } from "../../store/selected-marker"
import { useSelectedMarkerImgsStore } from "../../store/selected-marker-imgs"
import { useModalOpenListStore } from "../../store/modal-open-list"
import { useSelectedMarkerStoreOfficialImgsStore } from "../../store/selected-marker-official-imgs"
import { MARKER_DELETE, MARKER_DETAIL, MARKER_EDIT } from "@/types/page"
import { useEditMarkerStore } from "../../store/edit-marker"

type PropsType = {
  isPublic: boolean
}

export const MarkerDetailModal = ({ isPublic }: PropsType) => {
  const { selectedMarkerImgs } = useSelectedMarkerImgsStore()
  const { selectedMarkerOfficialImgs } =
    useSelectedMarkerStoreOfficialImgsStore()
  const { selectedMarker } = useSelectedMarkerStore()
  const [isOfficialOpen, setIsOfficialOpen] = useState(false)
  const { modalOpenList, toggleModalOpenList } = useModalOpenListStore()
  const { setEditMarker } = useEditMarkerStore()

  // マーカー詳細からマーカー編集モーダルを開くイベント
  const onOpenEditMarker = () => {
    if (selectedMarker == null) return
    const {
      id,
      visited_datetime,
      lat,
      lng,
      content,
      tag,
      title,
      official_title,
      official_description,
      official_web_url,
      official_google_map_url,
    } = selectedMarker
    setEditMarker({
      id,
      title,
      content: content ?? "",
      lat,
      lng,
      visited_datetime,
      tagId: tag?.id ?? 0,
      images: selectedMarkerImgs,
      official_title: official_title || "",
      official_description: official_description || "",
      official_web_url: official_web_url || "",
      official_google_map_url: official_google_map_url || "",
    })
    toggleModalOpenList(MARKER_EDIT)
  }

  return (
    <Modal
      placement="center"
      isOpen={modalOpenList.includes(MARKER_DETAIL)}
      onClose={() => toggleModalOpenList(MARKER_DETAIL)}
      className="mx-10"
    >
      <ModalContent>
        <ModalBody className="max-h-[60vh] overflow-scroll">
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
              ? formatDatetime(selectedMarker.visited_datetime)
              : ""}
          </small>
          <h4 className="text-large font-bold">
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
                        <small className="whitespace-pre-wrap text-default-500">
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
          {!isPublic && (
            <div className="flex justify-center">
              <Button color="success" onClick={onOpenEditMarker}>
                編集
              </Button>
              <Button
                color="danger"
                onClick={() => toggleModalOpenList(MARKER_DELETE)}
              >
                削除
              </Button>
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
