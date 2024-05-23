import { ZonedDateTime } from "@internationalized/date"

import { Tag } from "./tag"
import { MarkerImage } from "./marker_image"

export type Marker = {
  id: number
  created_at: string
  user_id: string
  visited_datetime: string
  lat: number
  lng: number
  content: string | null
  tag: Tag | null
  title: string
  official_title: string | null
  official_description: string | null
  official_web_url: string | null
  official_google_map_url: string | null
}

export type NewMarker = {
  title: string
  content: string
  lat: number
  lng: number
  dateTime: ZonedDateTime
  tagId: number
  images: string[]
}

export type EditMarker = {
  id: number
  title: string
  content: string
  lat: number
  lng: number
  dateTime: ZonedDateTime
  tagId: number
  images: MarkerImage[]
  official_title: string
  official_description: string
  official_web_url: string
  official_google_map_url: string
}

export type RequestCreateMarker = {
  user_id: string
  visited_datetime: Date
  lat: number
  lng: number
  content: string
  tag_id?: number
  title: string
  official_title: string
  official_description: string
  official_web_url: string
  official_google_map_url: string
}
