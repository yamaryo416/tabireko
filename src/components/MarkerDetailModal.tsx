import { Flash } from "@/types/flash";
import { Marker } from "@/types/marker";
import { MarkerImage } from "@/types/marker_image";
import { deleteMarker } from "@/utils/api/marker";
import {
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
  Button,
} from "@nextui-org/react";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { MarkerDeleteModal } from "./MarkerDeleteModal";

type PropsType = {
  selectedMarker: Marker | null;
  selectedMarkerImgs: MarkerImage[];
  isOpenDetailModal: boolean;
  setSelectedMarker: Dispatch<SetStateAction<Marker | null>>;
  setMarkerList: Dispatch<SetStateAction<Marker[]>>;
  setFlash: Dispatch<SetStateAction<Flash | null>>;
  onCloseDetailModal: () => void;
  onOpenEditMarker: () => void;
};

export const MarkerDetailModal = ({
  selectedMarker,
  selectedMarkerImgs,
  isOpenDetailModal,
  setSelectedMarker,
  setMarkerList,
  setFlash,
  onCloseDetailModal,
  onOpenEditMarker,
}: PropsType) => {
  // マーカー削除用モーダル関連
  const {
    isOpen: isOpenDeleteMarkerModal,
    onOpen: onOpenDeleteMarkerModal,
    onClose: onCloseDeleteMarkerModal,
  } = useDisclosure();

  const handleDelete = async () => {
    if (!selectedMarker) return;
    const id = selectedMarker.id;
    const { error } = await deleteMarker(id);
    if (!!error) {
      setFlash({ kind: "failed", message: "記録の削除に失敗しました" });
      return;
    }
    setFlash({ kind: "success", message: "記録を削除しました。" });
    setSelectedMarker(null);
    setMarkerList((prevMarkerList) => [
      ...prevMarkerList.filter((marker) => marker.id !== id),
    ]);
    onCloseDeleteMarkerModal();
    onCloseDetailModal();
  };

  return (
    <Modal
      placement="center"
      isOpen={isOpenDetailModal}
      onClose={onCloseDetailModal}
    >
      <ModalContent>
        <ModalBody className="overflow-scroll max-h-[60vh]">
          <small className="text-default-500">
            {selectedMarker
              ? selectedMarker.visited_datetime.slice(0, 13).replace("T", " ")
              : ""}
            時
          </small>
          <h4 className="font-bold text-large">
            {selectedMarker?.title || ""}
          </h4>
          <p>{selectedMarker?.content || ""}</p>
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
  );
};
