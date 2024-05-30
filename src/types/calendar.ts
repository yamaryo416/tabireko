import { ZonedDateTime } from "@internationalized/date"
import { Marker } from "./marker"

export type Calendar = {
  date: ZonedDateTime
  markerList: Marker[]
}