import { useMapOptionStore } from "../../store/map-option"
import { useNewMarkerStore } from "../../store/new-marker"
import { useModalOpenListStore } from "../../store/modal-open-list"
import { useOfficialInfoStore } from "../../store/official-info"
import { getMarkerImage } from "@/utils/api/marker_image"
import { useFlashStore } from "../../store/flash"
import { useSelectedMarkerStore } from "../../store/selected-marker"
import { useSelectedMarkerImgsStore } from "../../store/selected-marker-imgs"
import { useSelectedMarkerStoreOfficialImgsStore } from "../../store/selected-marker-official-imgs"
import type { Marker } from "@/types/marker"
import { useFilterTagIdsStore } from "../../store/filter-tag-ids"
import { getMarkerOfficialImage } from "@/utils/api/marker_official_image"
import { MARKER_CREATE, MARKER_DETAIL } from "@/types/page"
import { useCurrentPositionStore } from "../../store/current-position"

type ReturnType = {
  onClickCurrentLoaction: () => void
  openCreateMarkerModal: (_e: google.maps.MapMouseEvent) => void
  onOpenDetailMarker: (_marker: Marker) => void
  markerFilter: (_marker: Marker) => boolean
}

export const useMapController = (): ReturnType => {
  const { setMapOption } = useMapOptionStore()
  const { newMarker, setNewMarker } = useNewMarkerStore()
  const { officialInfo, setOfficialInfo } = useOfficialInfoStore()
  const { toggleModalOpenList } = useModalOpenListStore()
  const { setFlash } = useFlashStore()
  const { setSelectedMarker } = useSelectedMarkerStore()
  const { setSelectedMarkerImgs } = useSelectedMarkerImgsStore()
  const { setSelectedMarkerOfficialImgs } =
    useSelectedMarkerStoreOfficialImgsStore()
  const { filterTagIds } = useFilterTagIdsStore()
  const { setCurrentPosition } = useCurrentPositionStore()

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
    fetch(
      `https://places.googleapis.com/v1/places/${placeId}?fields=*&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}`,
    )
      .then((res) => res.json())
      .then((resPlace) => {
        if (resPlace.photos != null) {
          // @ts-ignore
          resPlace.photos.slice(0, 3).map((photo) => {
            fetch(
              `https://places.googleapis.com/v1/${photo.name}/media?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&maxWidthPx=400`,
            )
              .then((resPhoto) => {
                setOfficialInfo({
                  title: resPlace.displayName ? resPlace.displayName.text : "",
                  description: resPlace.editorialSummary
                    ? resPlace.editorialSummary.text
                    : "",
                  webUrl: resPlace.websiteUri || "",
                  googleMapUrl: resPlace.googleMapsUri || "",
                  photos: [...officialInfo.photos, resPhoto.url],
                })
              })
              .catch((err) => console.log(err))
          })
        }
      })
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

  return {
    onClickCurrentLoaction,
    openCreateMarkerModal,
    onOpenDetailMarker,
    markerFilter,
  }
}
