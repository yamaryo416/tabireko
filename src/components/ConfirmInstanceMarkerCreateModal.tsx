import {
  Modal,
  ModalContent,
  ModalBody,
  Button,
  RadioGroup,
  Radio,
} from "@nextui-org/react"

import { useModalOpenListStore } from "../../store/modal-open-list"
import { INSTANCE_MARKER_CREATE } from "@/types/page"
import { useCreateMarker } from "@/hooks/use-create-marker"
import { useOfficialInfoListStore } from "../../store/official-info-list"
import { useSelectedPlaceIdStore } from "../../store/selected-place-id"
import { useLoadingStore } from "../../store/loading"

export const ConfirmInstanceMarkerCreateModal = () => {
  const { loading } = useLoadingStore()
  const { modalOpenList, toggleModalOpenList } = useModalOpenListStore()
  const { officialInfoList } = useOfficialInfoListStore()
  const { selectedPlaceId, setSelectedPlaceId } = useSelectedPlaceIdStore()
  const { onCreate } = useCreateMarker()

  return (
    <Modal
      placement="center"
      isOpen={modalOpenList.includes(INSTANCE_MARKER_CREATE)}
      onClose={() => toggleModalOpenList(INSTANCE_MARKER_CREATE)}
      isDismissable={false}
      className="mx-10"
    >
      <ModalContent>
        <ModalBody className="max-h-[60vh] overflow-scroll">
          {officialInfoList.length !== 0 && (
            <div>
              <h3>近くの場所と紐付ける</h3>
              <RadioGroup
                label="Select your favorite city"
                value={String(selectedPlaceId)}
                onValueChange={setSelectedPlaceId}
              >
                {officialInfoList.map((item) => (
                  <Radio
                    key={`reference-official-${item.place_id}`}
                    value={item.place_id!}
                  >
                    {item.name}
                  </Radio>
                ))}
              </RadioGroup>
            </div>
          )}
          <p className="p-10 text-large">
            現在地の記録を即作成します。よろしいですか？
          </p>
          <Button
            type="button"
            onClick={onCreate}
            color="primary"
            className="text-white"
            disabled={loading}
          >
            作成する
          </Button>
          <Button
            type="button"
            onClick={() => toggleModalOpenList(INSTANCE_MARKER_CREATE)}
            color="default"
            variant="light"
            disabled={loading}
          >
            戻る
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
