import { NewMarker } from "@/types/marker"
import { Tag } from "@/types/tag"
import { ZonedDateTime } from "@internationalized/date"
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
  Checkbox,
  Spinner,
} from "@nextui-org/react"
import Image from "next/image"
import { ChangeEvent } from "react"

type PropsType = {
  loading: boolean
  isOpenCreateMarkerModal: boolean
  newMarker: NewMarker
  tagList: Tag[]
  onOpenCreateTagModal: () => void
  onCloseCreateMarkerModal: () => void
  changeNewMarker: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => void
  changeDatetime: (value: ZonedDateTime) => void
  handleUploadImg: (e: ChangeEvent<HTMLInputElement>, isCreate: boolean) => void
  handleCreateMarker: () => void
}

export const MarkerCreateModal = ({
  loading,
  isOpenCreateMarkerModal,
  newMarker,
  tagList,
  onOpenCreateTagModal,
  onCloseCreateMarkerModal,
  changeNewMarker,
  changeDatetime,
  handleUploadImg,
  handleCreateMarker,
}: PropsType) => {
  return (
    <Modal
      placement="center"
      isOpen={isOpenCreateMarkerModal}
      onClose={onCloseCreateMarkerModal}
      isDismissable={false}
      className="mx-10"
    >
      <ModalContent>
        <ModalHeader>旅の記録</ModalHeader>
        <ModalBody className="overflow-scroll max-h-[60vh]">
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
            <Link onClick={onOpenCreateTagModal}>タグを作成する</Link>
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
              value={newMarker.dateTime}
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
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-10 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
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
                  onChange={(e) => handleUploadImg(e, true)}
                />
              </label>
            </div>
            <Button
              type="submit"
              color="primary"
              formAction={handleCreateMarker}
              disabled={loading}
            >
              {loading ? <Spinner color="default" /> : "記録する"}
            </Button>
            <Button
              type="button"
              color="default"
              variant="light"
              onPress={onCloseCreateMarkerModal}
            >
              閉じる
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
