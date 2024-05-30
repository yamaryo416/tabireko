import { toCalendarDate, toTime, ZonedDateTime } from "@internationalized/date"

export const formatDatetime = (value: ZonedDateTime): string => {
  return `${value.year}年${value.month}月${value.day}日${toTime(value).hour}時`
}