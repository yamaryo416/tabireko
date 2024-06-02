import { toTime } from "@internationalized/date"
import type { ZonedDateTime } from "@internationalized/date"

export const formatDatetime = (value: ZonedDateTime): string => {
  return `${value.year}年${value.month}月${value.day}日${toTime(value).hour}時`
}

export const formatTime = (value: ZonedDateTime): string => {
  return `${toTime(value).hour}時`
}
