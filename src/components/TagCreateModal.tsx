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

import { useModalOpenListStore } from "../../store/modal-open-list"
import { useIconListStore } from "../../store/icon-list"
import { TAG_CREATE } from "@/types/page"
import { useCreateTag } from "@/hooks/use-create-tag"

export const TagCreateModal = () => {
  const { modalOpenList, toggleModalOpenList } = useModalOpenListStore()
  const { iconList } = useIconListStore()

  const { newTag, changeNewTag, handleCreateTag } = useCreateTag()

  return (
    <Modal
      placement="center"
      isOpen={modalOpenList.includes(TAG_CREATE)}
      onClose={() => toggleModalOpenList(TAG_CREATE)}
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
              onPress={() => toggleModalOpenList(TAG_CREATE)}
            >
              閉じる
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
