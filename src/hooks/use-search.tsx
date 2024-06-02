import type { ChangeEvent } from "react"
import { useSearchLocationStore } from "../../store/search-location"
import { useMarkerListStore } from "../../store/marker-list"
import { useMapOptionStore } from "../../store/map-option"
import { useModalOpenListStore } from "../../store/modal-open-list"
import { useSearchMarkerStore } from "../../store/search-marker"
import { MARKER_DETAIL, SEARCH_LOCATION } from "@/types/page"
import { useSelectedMarkerStore } from "../../store/selected-marker"

type ReturnType = {
  onSearchMarker: (_e: ChangeEvent<HTMLInputElement>) => void
  onClickSearchLocation: (_result: google.maps.GeocoderResult) => void
  onClickSearchLocationFromImg: (_markerId: number) => void
}

export const useSearch = (): ReturnType => {
  const { setMapOption } = useMapOptionStore()
  const { markerList } = useMarkerListStore()
  const { reset: resetSearchLocation } = useSearchLocationStore()
  const { toggleModalOpenList, setModalOpenList } = useModalOpenListStore()
  const { setSearchMarker } = useSearchMarkerStore()
  const { setSelectedMarker } = useSelectedMarkerStore()

  // マーカー検索キーワード変更イベント
  const onSearchMarker = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    const newSuggestMarkerList = markerList.filter(
      (marker) =>
        marker.content?.includes(value) || marker.title?.includes(value),
    )
    setSearchMarker({ keyword: value, suggestionList: newSuggestMarkerList })
  }

  // 候補一覧の一つをクリックして、地図の中心を移動するイベント
  const onClickSearchLocation = (result: google.maps.GeocoderResult) => {
    const lat = result.geometry.location.lat()
    const lng = result.geometry.location.lng()
    const center = {
      lat,
      lng,
    }
    setMapOption({
      zoom: 20,
      center,
    })
    resetSearchLocation()
    toggleModalOpenList(SEARCH_LOCATION)
  }

  // 画像をクリックした際に、対応するマーカーを中心に持ってくるイベント
  const onClickSearchLocationFromImg = (markerId: number) => {
    const targetMarker = markerList.find((marker) => marker.id === markerId)
    if (targetMarker == null) return
    setMapOption({
      zoom: 15,
      center: {
        lat: targetMarker.lat,
        lng: targetMarker.lng,
      },
    })
    setSelectedMarker(targetMarker)
    setModalOpenList([MARKER_DETAIL])
  }

  return {
    onSearchMarker,
    onClickSearchLocation,
    onClickSearchLocationFromImg,
  }
}
