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
}

export type RequestCreateMarker = {
  user_id: string
  visited_datetime: Date
  lat: number
  lng: number
  content: string
  tag_id?: number
  title: string
}
