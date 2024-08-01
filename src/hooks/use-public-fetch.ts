import { useEffect } from "react"
import { parseAbsoluteToLocal } from "@internationalized/date"

import { getTagByToken } from "@/utils/api/tag"
import { getMarkerListByTagId } from "@/utils/api/marker"
import { useMapOptionStore } from "../../store/map-option"
import { useFlashStore } from "../../store/flash"
import { useMarkerListStore } from "../../store/marker-list"
import { useSearchParams } from "next/navigation"
import { useTagStore } from "../../store/tag"
import { getEachMarkerImage } from "@/utils/api/marker_image"
import { EachMarkerImage } from "@/types/marker_image"
import { useEachImgListStore } from "../../store/each-img-list"
import { useAllImgListStore } from "../../store/all-img-list"

export const usePublicFetch = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const { setMapOption } = useMapOptionStore()
  const { setFlash } = useFlashStore()
  const { setAllImgList } = useAllImgListStore()
  const { setMarkerList } = useMarkerListStore()
  const { setTag } = useTagStore()
  const { setEachImgList } = useEachImgListStore()

  // タグを取得
  const fetchTagAndMarkerList = async () => {
    const { data: tagData, error: tagError } = await getTagByToken(token ?? "")
    if (tagError != null || tagData == null) {
      setFlash({ kind: "failed", message: "タグ取得に失敗しました" })
      return
    }
    setTag(tagData[0])
    const { data: markerData, error: markerError } = await getMarkerListByTagId(
      tagData[0].id,
    )
    if (markerError != null || markerData == null) {
      setFlash({ kind: "failed", message: "タグ取得に失敗しました" })
      return
    }
    const parseDateMarkerList = markerData.map((item) => ({
      ...item,
      visited_datetime: parseAbsoluteToLocal(item.visited_datetime),
    }))
    const ids = parseDateMarkerList.map((item) => item.id)
    getEachMarkerImageAndSetImage(ids)
    setMarkerList(parseDateMarkerList)
  }

  // マーカーに紐づく画像一覧を取得
  const getEachMarkerImageAndSetImage = async (ids: number[]) => {
    let { data, error } = await getEachMarkerImage(ids)
    if (!!error || data == null) {
      setFlash({ kind: "failed", message: "画像取得に失敗しました" })
      return
    }
    setAllImgList(data)
    let newImageList: EachMarkerImage = {}
    data.forEach((item) => {
      if (item.marker_id != null && newImageList[item.marker_id] == null) {
        newImageList[item.marker_id] = item.url
      }
    })
    setEachImgList(newImageList)
  }

  useEffect(() => {
    fetchTagAndMarkerList()
  }, [])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMapOption({
          zoom: 15,
          center: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        })
      },
      (err) => {
        console.log(err)
      },
    )
  }, [])
}
