import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Textarea,
  DatePicker,
  Input,
  Link,
  Select,
  SelectItem,
  Spinner,
} from "@nextui-org/react"
import Image from "next/image"

import { useTagListStore } from "../../store/tag-list"
import { useModalOpenListStore } from "../../store/modal-open-list"
import { useEditMarkerStore } from "../../store/edit-marker"
import { useLoadingStore } from "../../store/loading"
import { MARKER_EDIT, TAG_CREATE } from "@/types/page"
import { useEditMarker } from "@/hooks/use-edit-marker"

export const MarkerEditModal = () => {
  const { tagList } = useTagListStore()
  const { modalOpenList, toggleModalOpenList } = useModalOpenListStore()
  const { editMarker } = useEditMarkerStore()
  const { loading } = useLoadingStore()
  const {
    changeEditMarker,
    changeEditDatetime,
    removeImage,
    handleUploadImg,
    onEdit,
  } = useEditMarker()

  if (editMarker == null) return <></>

  return (
    <Modal
      placement="center"
      isOpen={modalOpenList.includes(MARKER_EDIT)}
      onClose={() => toggleModalOpenList(MARKER_EDIT)}
      isDismissable={false}
      className="mx-10"
    >
      <ModalContent>
        <ModalHeader>記録を編集</ModalHeader>
        <ModalBody className="max-h-[60vh] overflow-scroll">
          <form className="flex flex-col gap-2">
            <Select
              name="tagId"
              label="タグ"
              className="max-w-xs"
              onChange={changeEditMarker}
              value={editMarker.tagId}
              defaultSelectedKeys={[String(editMarker.tagId)]}
            >
              {tagList.map((tag) => (
                <SelectItem key={tag.id} value={tag.id}>
                  {tag.name}
                </SelectItem>
              ))}
            </Select>
            <Link onClick={() => toggleModalOpenList(TAG_CREATE)}>
              タグを作成する
            </Link>
            <Input
              label="タイトル"
              labelPlacement="outside"
              name="title"
              type="text"
              value={editMarker.title}
              onChange={changeEditMarker}
            />
            <DatePicker
              name="datetime"
              className="max-w-md"
              granularity="hour"
              label="日時"
              labelPlacement="outside"
              value={editMarker.visited_datetime}
              onChange={changeEditDatetime}
            />
            <Textarea
              name="content"
              label="内容"
              labelPlacement="outside"
              placeholder="今日は兼六園に行きました！日本三大庭園の..."
              className="max-w-xs"
              value={editMarker.content}
              onChange={changeEditMarker}
            />
            {editMarker.images.map((img) => (
              <div key={img.url} className="relative">
                <button
                  className="absolute right-0 top-[-5px] w-[20px] rounded-full bg-gray-500 text-center leading-[20px] text-white"
                  onClick={() => removeImage(img.url)}
                >
                  X
                </button>
                <Image
                  src={img.url}
                  width={400}
                  height={400}
                  alt="投稿画像"
                  className="inline"
                />
              </div>
            ))}
            <div className="flex w-full items-center justify-center">
              <label
                htmlFor="dropzone-file"
                className="dark:hover:bg-bray-800 flex h-10 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {loading ? <Spinner color="default" /> : "画像アップロード"}
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  disabled={loading}
                  onChange={handleUploadImg}
                />
              </label>
            </div>
            <Button
              type="submit"
              color="primary"
              formAction={onEdit}
              disabled={loading}
            >
              {loading ? <Spinner color="default" /> : "編集する"}
            </Button>
            <Button
              type="button"
              color="default"
              variant="light"
              onPress={() => toggleModalOpenList(MARKER_EDIT)}
            >
              閉じる
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
