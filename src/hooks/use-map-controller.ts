import { useMapOptionStore } from "../../store/map-option"
import { useNewMarkerStore } from "../../store/new-marker"
import { useModalOpenListStore } from "../../store/modal-open-list"
import { getMarkerImage } from "@/utils/api/marker_image"
import { useFlashStore } from "../../store/flash"
import { useSelectedMarkerStore } from "../../store/selected-marker"
import { useSelectedMarkerImgsStore } from "../../store/selected-marker-imgs"
import { useSelectedMarkerStoreOfficialImgsStore } from "../../store/selected-marker-official-imgs"
import type { Marker } from "@/types/marker"
import { useFilterTagIdsStore } from "../../store/filter-tag-ids"
import { getMarkerOfficialImage } from "@/utils/api/marker_official_image"
import {
  INSTANCE_MARKER_CREATE,
  MARKER_CREATE,
  MARKER_DETAIL,
} from "@/types/page"
import { useCurrentPositionStore } from "../../store/current-position"
import { useOfficialInfoListStore } from "../../store/official-info-list"
import { useSelectedPlaceIdStore } from "../../store/selected-place-id"

type ReturnType = {
  onClickCurrentLoaction: () => void
  openCreateMarkerModal: (_e: google.maps.MapMouseEvent) => void
  onOpenDetailMarker: (_marker: Marker) => void
  markerFilter: (_marker: Marker) => boolean
  onOpenInstantCreateModal: () => void
}

export const useMapController = (): ReturnType => {
  const { setMapOption } = useMapOptionStore()
  const { newMarker, setNewMarker } = useNewMarkerStore()
  const { toggleModalOpenList } = useModalOpenListStore()
  const { setFlash } = useFlashStore()
  const { setSelectedMarker } = useSelectedMarkerStore()
  const { setSelectedMarkerImgs } = useSelectedMarkerImgsStore()
  const { setSelectedMarkerOfficialImgs } =
    useSelectedMarkerStoreOfficialImgsStore()
  const { filterTagIds } = useFilterTagIdsStore()
  const { setCurrentPosition } = useCurrentPositionStore()
  const { setOfficialInfoList } = useOfficialInfoListStore()
  const { setSelectedPlaceId } = useSelectedPlaceIdStore()

  // 現在地を取得するイベント
  const onClickCurrentLoaction = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMapOption({
          zoom: 20,
          center: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        })
        setCurrentPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (err) => {
        console.log(err)
      },
    )
  }

  // 地図上にてクリックした地点の座標を保存し、マーカー作成モーダルを開くイベント
  const openCreateMarkerModal = (e: google.maps.MapMouseEvent) => {
    setNewMarker({
      ...newMarker,
      lat: e.latLng?.lat() || 0,
      lng: e.latLng?.lng() || 0,
    })
    toggleModalOpenList(MARKER_CREATE)
    // @ts-ignore
    const { placeId } = e
    if (placeId == null) return
    setSelectedPlaceId(placeId)
  }

  // マーカー詳細に紐づく画像一覧を取得
  const getImageUrl = async (id: number) => {
    const { data, error } = await getMarkerImage(id)
    if (!!error || data == null) {
      setFlash({ kind: "failed", message: "画像取得に失敗しました" })
      return
    }
    setSelectedMarkerImgs(data)
  }

  // マーカー詳細に紐づく公式画像一覧を取得
  const getOfficialImageUrl = async (id: number) => {
    const { data, error } = await getMarkerOfficialImage(id)
    if (!!error || data == null) {
      setFlash({ kind: "failed", message: "画像取得に失敗しました" })
      return
    }
    setSelectedMarkerOfficialImgs(data)
  }

  // 対象のマーカー詳細モーダルを開くイベント
  const onOpenDetailMarker = (marker: Marker) => {
    setSelectedMarker(marker)
    toggleModalOpenList(MARKER_DETAIL)
    getImageUrl(marker.id)
    getOfficialImageUrl(marker.id)
  }

  // マーカーをタグでフィルターする関数
  const markerFilter = (marker: Marker): boolean => {
    return (
      (!marker.tag && filterTagIds.includes(0)) ||
      (!!marker.tag && filterTagIds.includes(marker.tag.id))
    )
  }

  const onOpenInstantCreateModal = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setNewMarker({
          ...newMarker,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        const initPos = new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude,
        )
        const myOptions = {
          zoom: 15,
          center: initPos,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
        }
        const mapEl = document.getElementById("map_canvas") as HTMLDivElement
        const myMap = new google.maps.Map(mapEl, myOptions)
        const request = {
          location: initPos,
          radius: 200,
        }
        const service = new google.maps.places.PlacesService(myMap)
        service.nearbySearch(request, (results, status) => {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            const result = results
              ?.filter((res) => res.user_ratings_total != null)
              .sort((a, b) => {
                return a.user_ratings_total! < b.user_ratings_total! ? 1 : -1
              })
            if (result != null) setOfficialInfoList(result)
            toggleModalOpenList(INSTANCE_MARKER_CREATE)
          }
        })
      },
      (err) => {
        console.log(err)
      },
    )
  }

  return {
    onClickCurrentLoaction,
    openCreateMarkerModal,
    onOpenDetailMarker,
    markerFilter,
    onOpenInstantCreateModal,
  }
}
