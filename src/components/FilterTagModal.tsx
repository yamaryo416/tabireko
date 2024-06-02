import {
  Button,
  Checkbox,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react"
import Image from "next/image"

import { useModalOpenListStore } from "../../store/modal-open-list"
import { useFilterTagIdsStore } from "../../store/filter-tag-ids"
import { useTagListStore } from "../../store/tag-list"
import { TAG_FILTER } from "@/types/page"

export const FilterTagModal = () => {
  const { modalOpenList, toggleModalOpenList } = useModalOpenListStore()
  const { tagList } = useTagListStore()
  const { filterTagIds, toggleFilterTagIds, reset } = useFilterTagIdsStore()

  return (
    <Modal
      placement="center"
      isOpen={modalOpenList.includes(TAG_FILTER)}
      onClose={() => toggleModalOpenList(TAG_FILTER)}
      isDismissable={false}
      className="mx-10"
    >
      <ModalContent>
        <ModalHeader>タグでの絞り込み</ModalHeader>
        <ModalBody>
          {tagList.map((tag) => (
            <Checkbox
              isSelected={filterTagIds.includes(tag.id)}
              key={tag.id}
              onChange={() => toggleFilterTagIds(tag.id)}
            >
              <span className="flex items-center">
                {tag.icon && (
                  <Image
                    alt="マップのアイコン"
                    src={tag.icon?.url}
                    width={20}
                    height={50}
                  />
                )}
                <span>{tag.name}</span>
              </span>
            </Checkbox>
          ))}
          <Checkbox
            isSelected={filterTagIds.includes(0)}
            onChange={() => toggleFilterTagIds(0)}
          >
            タグなし
          </Checkbox>
          <Link onClick={reset}>チェックを全て外す</Link>
          <Button
            type="button"
            color="primary"
            variant="light"
            onPress={() => toggleModalOpenList(TAG_FILTER)}
          >
            閉じる
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
