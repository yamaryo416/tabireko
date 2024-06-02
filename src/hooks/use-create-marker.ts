import { parseAbsoluteToLocal, ZonedDateTime } from "@internationalized/date"
import { ChangeEvent } from "react"

import { INIT_NEW_MARKER, useNewMarkerStore } from "../../store/new-marker"
import { useLoadingStore } from "../../store/loading"
import { useFlashStore } from "../../store/flash"
import { uploadImage } from "@/utils/api/image"
import { useMarkerListStore } from "../../store/marker-list"
import { supabase } from "@/utils/supabase/client"
import type { RequestCreateMarker } from "@/types/marker"
import { createMarker } from "@/utils/api/marker"
import { createMarkerImage } from "@/utils/api/marker_image"
import { createMarkerOfficialImage } from "@/utils/api/marker_official_image"
import { useModalOpenListStore } from "../../store/modal-open-list"
import { useSelectedPlaceIdStore } from "../../store/selected-place-id"
import { OfficialInfo } from "@/types/map"

type ReturnType = {
  changeNewMarker: (
    _e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => void
  changeDatetime: (_value: ZonedDateTime) => void
  handleUploadImg: (_e: ChangeEvent<HTMLInputElement>) => void
  onCreate: () => void
}

export const useCreateMarker = (): ReturnType => {
  const { setFlash } = useFlashStore()
  const { setLoading } = useLoadingStore()
  const { newMarker, setNewMarker } = useNewMarkerStore()
  const { markerList, setMarkerList } = useMarkerListStore()
  const { setModalOpenList } = useModalOpenListStore()
  const { selectedPlaceId, setSelectedPlaceId } = useSelectedPlaceIdStore()

  // マーカー作成 各カラム編集用イベント
  const changeNewMarker = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setNewMarker({ ...newMarker, [name]: value })
  }

  // マーカー作成 日時編集用イベント
  const changeDatetime = (value: ZonedDateTime) => {
    setNewMarker({
      ...newMarker,
      visited_datetime: value,
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
    setNewMarker({
      ...newMarker,
      images: [...newMarker.images, imgPath],
    })
    setLoading(false)
  }

  // マーカーを含む関連レコード作成イベント
  const onCreate = async () => {
    setLoading(true)
    const userData = await supabase.auth.getUser()
    const userId = userData?.data?.user?.id
    if (userId == null) {
      setFlash({ kind: "failed", message: "記録の作成に失敗しました" })
      setLoading(false)
      return
    }
    try {
      // マーカーの作成
      let officialInfo: OfficialInfo | null = null
      if (selectedPlaceId != null) {
        officialInfo = await getOfficialInfo()
      }
      const resMarkerList = await handleCreateMarker(userId, officialInfo)
      const markerId = resMarkerList[0].id
      // マーカーに紐づく画像の作成
      await handleCreateMarkerImg(markerId, userId)

      if (officialInfo != null) {
        // マーカーに紐づく公式画像の作成
        await handleCreateMarkerOfficialImg(markerId, officialInfo)
      }

      const parseDateMarkerList = resMarkerList.map((item) => ({
        ...item,
        visited_datetime: parseAbsoluteToLocal(item.visited_datetime),
      }))

      setMarkerList([...markerList, parseDateMarkerList[0]])
      setFlash({ kind: "success", message: "記録の作成に成功しました" })
      setNewMarker(INIT_NEW_MARKER)
      setLoading(false)
      setModalOpenList([])
      setSelectedPlaceId(null)
    } catch (e) {
      console.error(e)
      setFlash({ kind: "failed", message: "記録の作成に失敗しました" })
      setLoading(false)
    }
  }

  // 公式のマーカーをクリックして、
  const getOfficialInfo = async (): Promise<OfficialInfo> => {
    return await fetch(
      `https://places.googleapis.com/v1/places/${selectedPlaceId}?fields=*&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}`,
    )
      .then((res) => res.json())
      .then((res) => {
        return {
          title: (res.displayName != null
            ? res.displayName.text
            : "") as string,
          description: (res.editorialSummary != null
            ? res.editorialSummary.text
            : "") as string,
          webUrl: (res.websiteUri || "") as string,
          googleMapUrl: (res.googleMapsUri || "") as string,
          photos: res.photos != null ? (res.photos as { name: string }[]) : [],
        }
      })
  }

  // マーカーを作成するハンドラー
  const handleCreateMarker = async (
    userId: string,
    officialInfo: OfficialInfo | null,
  ) => {
    const { title, content, lat, lng, visited_datetime, tagId } = newMarker
    const date = new Date(
      visited_datetime.year,
      visited_datetime.month - 1,
      visited_datetime.day,
      visited_datetime.hour,
    )
    let requestdata: RequestCreateMarker = {
      title,
      content,
      user_id: userId,
      visited_datetime: date,
      lat,
      lng,
      official_title: "",
      official_description: "",
      official_web_url: "",
      official_google_map_url: "",
    }
    if (officialInfo != null) {
      requestdata = {
        ...requestdata,
        official_title: officialInfo.title,
        official_description: officialInfo.description,
        official_web_url: officialInfo.webUrl,
        official_google_map_url: officialInfo.googleMapUrl,
      }
    }
    if (tagId !== 0) {
      requestdata = { ...requestdata, tag_id: tagId }
    }
    const { data, error } = await createMarker(requestdata)
    if (error || data == null) {
      throw new Error("cannot create marker")
    }
    return data
  }

  // マーカーに紐づく画像を作成するハンドラー
  const handleCreateMarkerImg = async (markerId: number, userId: string) => {
    const { images } = newMarker
    if (images.length === 0) return
    const imgData = images.map((img) => ({
      user_id: userId,
      marker_id: markerId,
      url: img,
    }))
    const { error } = await createMarkerImage(imgData)
    if (error != null) {
      throw new Error("cannot create marker img")
    }
  }

  // マーカーに紐づく公式画像を作成するハンドラー
  const handleCreateMarkerOfficialImg = async (
    markerId: number,
    officialInfo: OfficialInfo,
  ) => {
    officialInfo.photos.forEach((photo) => {
      fetch(
        `https://places.googleapis.com/v1/${photo.name}/media?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&maxWidthPx=400`,
      ).then((resPhoto) => {
        const requestData = {
          marker_id: markerId,
          url: resPhoto.url,
        }
        createMarkerOfficialImage([requestData])
      })
    })
  }

  return {
    changeNewMarker,
    changeDatetime,
    handleUploadImg,
    onCreate,
  }
}
