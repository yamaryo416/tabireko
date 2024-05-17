import { Modal, ModalContent, ModalBody, Button } from "@nextui-org/react";

type PropsType = {
  isOpen: boolean;
  handleDelete: () => void;
  onClose: () => void;
};

export const MarkerDeleteModal = ({
  isOpen,
  handleDelete,
  onClose,
}: PropsType) => {
  return (
    <Modal placement="center" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalBody>
          <p className="text-large p-10">記録を削除します。よろしいですか？</p>
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
            onClick={onClose}
            color="default"
            variant="light"
          >
            戻る
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
