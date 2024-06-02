import { ChangeEvent } from "react"
import { useEditMarkerStore } from "../../store/edit-marker"
import type { RequestCreateMarker } from "@/types/marker"
import { updateMarker } from "@/utils/api/marker"
import { useSelectedMarkerImgsStore } from "../../store/selected-marker-imgs"
import { createMarkerImage, deleteMakerImage } from "@/utils/api/marker_image"
import { supabase } from "@/utils/supabase/client"
import { useFlashStore } from "../../store/flash"
import { useLoadingStore } from "../../store/loading"
import { uploadImage } from "@/utils/api/image"
import type { ZonedDateTime } from "@internationalized/date"
import { useModalOpenListStore } from "../../store/modal-open-list"
import { MARKER_EDIT } from "@/types/page"

type ReturnType = {
  changeEditMarker: (
    _e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => void
  changeEditDatetime: (_value: ZonedDateTime) => void
  removeImage: (_url: string) => void
  handleUploadImg: (_e: ChangeEvent<HTMLInputElement>) => void
  onEdit: () => void
}

export const useEditMarker = (): ReturnType => {
  const { setLoading } = useLoadingStore()
  const { setFlash } = useFlashStore()
  const { editMarker, setEditMarker } = useEditMarkerStore()
  const { selectedMarkerImgs } = useSelectedMarkerImgsStore()
  const { toggleModalOpenList } = useModalOpenListStore()

  // マーカー編集 各カラム編集用イベント
  const changeEditMarker = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    if (editMarker == null) return
    const { name, value } = e.target
    setEditMarker({ ...editMarker, [name]: value })
  }

  // マーカー編集 日時編集用イベント
  const changeEditDatetime = (value: ZonedDateTime) => {
    if (editMarker == null) return
    setEditMarker({ ...editMarker, visited_datetime: value })
  }

  // マーカー編集 画像削除用イベント
  const removeImage = (url: string) => {
    if (editMarker == null) return
    setEditMarker({
      ...editMarker,
      images: editMarker.images.filter((img) => img.url !== url),
    })
  }

  // マーカー作成 画像投稿用イベント
  const handleUploadImg = async (e: ChangeEvent<HTMLInputElement>) => {
    setLoading(true)
    const files = e.target?.files
    if (files == null) return
    const file = files[0]
    const { data, error } = await uploadImage(file)
    if (!!error || data == null) {
      setLoading(false)
      setFlash({ kind: "failed", message: "画像のアップロードに失敗しました" })
      return
    }
    const imgPath = `${process.env.NEXT_PUBLIC_STORAGE_ORIGIN}/images/${data.path}`

    if (editMarker == null) return
    const newImages = {
      created_at: "2024-01-01",
      id: 0,
      marker_id: editMarker.id ?? 0,
      url: imgPath,
      user_id: "user_id",
    }
    setEditMarker({
      ...editMarker,
      images: [...editMarker.images, newImages],
    })
    setLoading(false)
  }

  const onEdit = async () => {
    setLoading(true)
    const userData = await supabase.auth.getUser()
    const userId = userData?.data?.user?.id
    if (userId == null) {
      setFlash({ kind: "failed", message: "記録の編集に失敗しました" })
      setLoading(false)
      return
    }
    try {
      await handleEditMarker(userId)
      await handleDeleteAndCreateMarkerImg(userId)
      toggleModalOpenList(MARKER_EDIT)
      setFlash({ kind: "success", message: "記録を編集しました" })
      setLoading(false)
    } catch (e) {
      console.error(e)
      setFlash({ kind: "failed", message: "記録の編集に失敗しました" })
      setLoading(false)
    }
  }

  // マーカーを編集するハンドラー
  const handleEditMarker = async (userId: string) => {
    if (editMarker == null) {
      throw new Error("cannot edit marker")
    }
    const {
      id,
      title,
      content,
      lat,
      lng,
      visited_datetime,
      tagId,
      official_title,
      official_description,
      official_web_url,
      official_google_map_url,
    } = editMarker

    const date = new Date(
      visited_datetime.year,
      visited_datetime.month - 1,
      visited_datetime.day,
      visited_datetime.hour,
    )

    let requestData: RequestCreateMarker = {
      title,
      content,
      user_id: userId,
      visited_datetime: date,
      lat,
      lng,
      official_title,
      official_description,
      official_web_url,
      official_google_map_url,
    }
    if (tagId !== 0) {
      requestData = { ...requestData, tag_id: tagId }
    }

    const { data, error } = await updateMarker(id, requestData)

    if (error || data == null) {
      throw new Error("cannot edit marker")
    }
  }

  // マーカーに紐づく画像を作成・削除するハンドラー
  const handleDeleteAndCreateMarkerImg = async (userId: string) => {
    if (editMarker == null) {
      throw new Error("cannot delete and create marker img")
    }
    const prevMarkerImgIds = selectedMarkerImgs.map((img) => img.id)
    const newMarkerImgsIds = editMarker.images.map((img) => img.id)
    const deleteMarkerIds = prevMarkerImgIds.filter(
      (id) => !newMarkerImgsIds.includes(id),
    )
    if (deleteMarkerIds.length !== 0) {
      const { error: resCreateMarkerImgError } =
        await deleteMakerImage(deleteMarkerIds)
      if (resCreateMarkerImgError != null) {
        throw new Error("cannot delete and create marker img")
      }
    }

    if (editMarker.images.length !== 0) {
      const imgData = editMarker.images
        .filter((img) => img.id === 0)
        .map((img) => ({
          user_id: userId,
          marker_id: editMarker.id,
          url: img.url,
        }))
      const { error: resCreateMarkerImgError } =
        await createMarkerImage(imgData)

      if (resCreateMarkerImgError) {
        throw new Error("cannot delete and create marker img")
      }
    }
  }

  return {
    changeEditMarker,
    changeEditDatetime,
    removeImage,
    handleUploadImg,
    onEdit,
  }
}
