import { useEffect } from "react"
import { parseAbsoluteToLocal } from "@internationalized/date"

import { getTagList } from "@/utils/api/tag"
import { getMarkerList } from "@/utils/api/marker"
import { getIconList } from "@/utils/api/icon"
import { getEachMarkerImage } from "@/utils/api/marker_image"
import { EachMarkerImage } from "@/types/marker_image"
import { useMapOptionStore } from "../../store/map-option"
import { useFlashStore } from "../../store/flash"
import { useMarkerListStore } from "../../store/marker-list"
import { useTagListStore } from "../../store/tag-list"
import { useAllImgListStore } from "../../store/all-img-list"
import { useFilterTagIdsStore } from "../../store/filter-tag-ids"
import { useIconListStore } from "../../store/icon-list"
import { useEachImgListStore } from "../../store/each-img-list"

export const useFetch = () => {
  const { setMapOption } = useMapOptionStore()
  const { setFlash } = useFlashStore()
  const { setMarkerList } = useMarkerListStore()
  const { setTagList } = useTagListStore()
  const { setAllImgList } = useAllImgListStore()
  const { setFilterTagIds } = useFilterTagIdsStore()
  const { setIconList } = useIconListStore()
  const { setEachImgList } = useEachImgListStore()

  // マーカー一覧取得
  const fetchMarkerList = async () => {
    const { data, error } = await getMarkerList()
    if (!!error || data == null) {
      setFlash({ kind: "failed", message: "マーカー一覧取得に失敗しました" })
      return
    }

    const parseDateMarkerList = data.map((item) => ({
      ...item,
      visited_datetime: parseAbsoluteToLocal(item.visited_datetime),
    }))
    const ids = parseDateMarkerList.map((item) => item.id)
    getEachMarkerImageAndSetImage(ids)
    setMarkerList(parseDateMarkerList)
  }

  // タグ一覧取得
  const fetchTagList = async () => {
    const { data, error } = await getTagList()
    if (!!error || data == null) {
      setFlash({ kind: "failed", message: "タグ一覧取得に失敗しました" })
      return
    }
    setTagList(data)
    setFilterTagIds([...data.map((tag) => tag.id), 0])
  }

  // アイコン一覧取得
  const fetchIconList = async () => {
    const { data, error } = await getIconList()
    if (!!error || data == null) {
      setFlash({ kind: "failed", message: "アイコン一覧取得に失敗しました" })
      return
    }
    setIconList(data)
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
    fetchMarkerList()
    fetchTagList()
    fetchIconList()
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
