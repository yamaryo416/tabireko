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
import { useNewMarkerStore } from "../../store/new-marker"
import { useLoadingStore } from "../../store/loading"
import { MARKER_CREATE, TAG_CREATE } from "@/types/page"
import { useCreateMarker } from "@/hooks/use-create-marker"

export const MarkerCreateModal = () => {
  const { modalOpenList, toggleModalOpenList } = useModalOpenListStore()
  const { loading } = useLoadingStore()
  const { tagList } = useTagListStore()
  const { newMarker } = useNewMarkerStore()

  const { changeNewMarker, changeDatetime, handleUploadImg, onCreate } =
    useCreateMarker()

  return (
    <Modal
      placement="center"
      isOpen={modalOpenList.includes(MARKER_CREATE)}
      onClose={() => toggleModalOpenList(MARKER_CREATE)}
      isDismissable={false}
      className="mx-10"
    >
      <ModalContent>
        <ModalHeader>旅の記録</ModalHeader>
        <ModalBody className="max-h-[60vh] overflow-scroll">
          <form className="flex flex-col gap-2">
            <Select
              name="tagId"
              label="タグ"
              className="max-w-xs"
              onChange={changeNewMarker}
              value={newMarker.tagId}
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
              value={newMarker.title}
              onChange={changeNewMarker}
            />
            <DatePicker
              name="datetime"
              className="max-w-md"
              granularity="hour"
              label="日時"
              labelPlacement="outside"
              value={newMarker.visited_datetime}
              onChange={changeDatetime}
            />
            <Textarea
              name="content"
              label="内容"
              labelPlacement="outside"
              placeholder="今日は兼六園に行きました！日本三大庭園の..."
              className="max-w-xs"
              value={newMarker.content}
              onChange={changeNewMarker}
            />
            {newMarker.images.map((url) => (
              <div key={url}>
                <Image
                  src={url}
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
              formAction={onCreate}
              disabled={loading}
            >
              {loading ? <Spinner color="default" /> : "記録する"}
            </Button>
            <Button
              type="button"
              color="default"
              variant="light"
              onPress={() => toggleModalOpenList(MARKER_CREATE)}
            >
              閉じる
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
