import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react"
import Image from "next/image"
import { v4 } from "uuid"

import { useModalOpenListStore } from "../../store/modal-open-list"
import { useTagListStore } from "../../store/tag-list"
import { PUBLIC_MARKER } from "@/types/page"
import { updateTag } from "@/utils/api/tag"
import { useFlashStore } from "../../store/flash"

export const PublicMarkerSettingModal = () => {
  const { modalOpenList, toggleModalOpenList } = useModalOpenListStore()
  const { tagList, setTagList } = useTagListStore()
  const { setFlash } = useFlashStore()

  const onToggleMarkerPublic = async (id: number, isChangePublic: boolean) => {
    const requestData = {
      access_token: isChangePublic ? v4() : null,
    }

    const { data, error } = await updateTag(id, requestData)

    if (error != null || data == null) {
      console.log(error)
      setFlash({
        kind: "failed",
        message: "タグの公開設定変更に失敗しました",
      })
      return
    }

    const newTagList = [...tagList]
    const index = newTagList.findIndex((item) => item.id === id)
    newTagList[index].access_token = data[0].access_token
    setTagList(newTagList)
  }

  return (
    <Modal
      placement="center"
      isOpen={modalOpenList.includes(PUBLIC_MARKER)}
      onClose={() => toggleModalOpenList(PUBLIC_MARKER)}
      isDismissable={false}
      className="mx-10"
    >
      <ModalContent>
        <ModalHeader>公開するタグを選択</ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-10">
            {tagList.map((tag) => (
              <div
                key={`public-tag-item-${tag.id}`}
                className="flex flex-col gap-4"
              >
                <div className="flex items-center">
                  {tag.icon && (
                    <Image
                      alt="マップのアイコン"
                      src={tag.icon?.url}
                      width={20}
                      height={50}
                    />
                  )}
                  <span>{tag.name}</span>
                </div>
                {tag.access_token == null ? (
                  <>
                    <div>非公開</div>
                    <Button
                      color="default"
                      variant="bordered"
                      onClick={() => onToggleMarkerPublic(tag.id, true)}
                    >
                      公開する
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex">
                      <p className="mr-2 whitespace-nowrap">公開中:</p>
                      <a
                        href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/public?token=${tag.access_token}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-500"
                      >{`${process.env.NEXT_PUBLIC_FRONTEND_URL}/public?token=${tag.access_token}`}</a>
                    </div>
                    <Button
                      color="default"
                      variant="bordered"
                      onClick={() => onToggleMarkerPublic(tag.id, false)}
                    >
                      公開を停止する
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>

          <Button
            type="button"
            color="primary"
            variant="light"
            onPress={() => toggleModalOpenList(PUBLIC_MARKER)}
          >
            閉じる
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
