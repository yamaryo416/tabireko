import { EditMarker, NewMarker } from "@/types/marker"
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
  Spinner,
} from "@nextui-org/react"
import Image from "next/image"
import { ChangeEvent } from "react"

type PropsType = {
  loading: boolean
  isOpen: boolean
  editMarker: EditMarker | null
  tagList: Tag[]
  onOpenCreateTagModal: () => void
  onClose: () => void
  changeEditMarker: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => void
  changeDatetime: (value: ZonedDateTime) => void
  removeImage: (url: string) => void
  handleUploadImg: (e: ChangeEvent<HTMLInputElement>, isCreate: boolean) => void
  handleEdit: () => void
}

export const MarkerEditModal = ({
  loading,
  isOpen,
  editMarker,
  tagList,
  onOpenCreateTagModal,
  onClose,
  changeEditMarker,
  changeDatetime,
  removeImage,
  handleUploadImg,
  handleEdit,
}: PropsType) => {
  if (!editMarker) return <></>

  return (
    <Modal
      placement="center"
      isOpen={isOpen}
      onClose={onClose}
      isDismissable={false}
      className="mx-10"
    >
      <ModalContent>
        <ModalHeader>記録を編集</ModalHeader>
        <ModalBody className="overflow-scroll max-h-[60vh]">
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
            <Link onClick={onOpenCreateTagModal}>タグを作成する</Link>
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
              value={editMarker.dateTime}
              onChange={changeDatetime}
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
                  className="absolute bg-gray-500 text-center w-[20px] leading-[20px] rounded-full right-0 top-[-5px] text-white"
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
                  onChange={(e) => handleUploadImg(e, false)}
                />
              </label>
            </div>
            <Button
              type="submit"
              color="primary"
              formAction={handleEdit}
              disabled={loading}
            >
              {loading ? <Spinner color="default" /> : "編集する"}
            </Button>
            <Button
              type="button"
              color="default"
              variant="light"
              onPress={onClose}
            >
              閉じる
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
