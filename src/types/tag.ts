import { Icon } from "./icon"

export type Tag = {
  id: number
  created_at: string
  user_id: string
  name: string
  icon: Icon | null
}
