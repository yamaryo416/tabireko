import { Modal, ModalContent, ModalBody, Button } from "@nextui-org/react"

import { useModalOpenListStore } from "../../store/modal-open-list"
import { useSelectedMarkerStore } from "../../store/selected-marker"
import { useFlashStore } from "../../store/flash"
import { useMarkerListStore } from "../../store/marker-list"
import { deleteMarker } from "@/utils/api/marker"
import { MARKER_DELETE } from "@/types/page"

export const MarkerDeleteModal = () => {
  const { modalOpenList, toggleModalOpenList, setModalOpenList } =
    useModalOpenListStore()
  const { setFlash } = useFlashStore()
  const { markerList, setMarkerList } = useMarkerListStore()
  const { selectedMarker, setSelectedMarker } = useSelectedMarkerStore()

  const handleDelete = async () => {
    if (!selectedMarker) return
    const id = selectedMarker.id
    const { error } = await deleteMarker(id)
    if (error != null) {
      setFlash({ kind: "failed", message: "記録の削除に失敗しました" })
      return
    }
    setFlash({ kind: "success", message: "記録を削除しました。" })
    setSelectedMarker(null)
    setMarkerList([...markerList].filter((marker) => marker.id !== id))
    setModalOpenList([])
  }
  return (
    <Modal
      placement="center"
      isOpen={modalOpenList.includes(MARKER_DELETE)}
      onClose={() => toggleModalOpenList(MARKER_DELETE)}
    >
      <ModalContent>
        <ModalBody>
          <p className="p-10 text-large">記録を削除します。よろしいですか？</p>
          <Button
            type="button"
            onClick={handleDelete}
            color="danger"
            className="text-white"
          >
            削除する
          </Button>
          <Button
            type="button"
            onClick={() => toggleModalOpenList(MARKER_DELETE)}
            color="default"
            variant="light"
          >
            戻る
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
