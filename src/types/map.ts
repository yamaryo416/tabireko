import { Marker } from "./marker"

export type MapOption = {
  center: {
    lat: number
    lng: number
  }
  zoom: number
}

export type DisplayMapMode = "marker" | "img" | "balloon" | "off"

export type SearchLocation = {
  keyword: string
  suggestionList: google.maps.GeocoderResult[]
}

export type SearchMarker = {
  keyword: string
  suggestionList: Marker[]
}

export type OfficialInfo = {
  title: string
  description: string
  webUrl: string
  googleMapUrl: string
  photos: { name: string }[]
}
