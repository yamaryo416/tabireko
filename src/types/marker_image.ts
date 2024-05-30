export type MarkerImage = {
  created_at: string
  id: number
  marker_id: number | null
  url: string
  user_id: string | null
}

export type EachMarkerImage = { [key: number]: string }
