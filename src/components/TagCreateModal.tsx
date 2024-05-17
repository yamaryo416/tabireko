import { Icon } from "@/types/icon"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react"
import { ChangeEvent } from "react"

type PropsType = {
  newTag: { name: string; icon_id: number }
  isOpenCreateTagModal: boolean
  iconList: Icon[]
  onCloseCreateTagModal: () => void
  handleCreateTag: () => void
  changeNewTag: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

export const TagCreateModal = ({
  newTag,
  isOpenCreateTagModal,
  iconList,
  onCloseCreateTagModal,
  handleCreateTag,
  changeNewTag,
}: PropsType) => {
  return (
    <Modal
      placement="center"
      isOpen={isOpenCreateTagModal}
      onClose={onCloseCreateTagModal}
      isDismissable={false}
      className="mx-10"
    >
      <ModalContent>
        <ModalHeader>タグの作成</ModalHeader>
        <ModalBody>
          <form className="flex flex-col gap-2">
            <Input
              label="タグ名"
              labelPlacement="outside"
              name="name"
              type="text"
              value={newTag.name}
              onChange={changeNewTag}
            />
            <Select
              name="icon_id"
              label="色"
              className="max-w-xs"
              onChange={changeNewTag}
              value={newTag.icon_id}
            >
              {iconList.map((icon) => (
                <SelectItem key={icon.id} value={icon.id}>
                  {icon.name}
                </SelectItem>
              ))}
            </Select>
            <Button type="submit" color="primary" formAction={handleCreateTag}>
              作成
            </Button>
            <Button
              type="button"
              color="danger"
              variant="light"
              onPress={onCloseCreateTagModal}
            >
              閉じる
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
