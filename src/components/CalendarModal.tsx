import { Calendar } from "@/types/calendar"
import { formatTime } from "@/utils/datetime"
import {
  endOfMonth,
  endOfWeek,
  getDayOfWeek,
  getLocalTimeZone,
  isSameDay,
  isSameMonth,
  now,
  startOfMonth,
  startOfWeek,
} from "@internationalized/date"
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalContent,
  ModalBody,
} from "@nextui-org/react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useModalOpenListStore } from "../../store/modal-open-list"
import { useMarkerListStore } from "../../store/marker-list"
import { useSearch } from "@/hooks/use-search"
import { CALENDAR } from "@/types/page"

const WEEK_DAY = ["日", "月", "火", "水", "木", "金", "土"]

export const CalendarModal = () => {
  const today = now(getLocalTimeZone())
  const { markerList } = useMarkerListStore()
  const [mode, setMode] = useState<"week" | "month">("week")
  const [currentDate, setCurrentDate] = useState(startOfWeek(today, "en-US"))
  const [dateList, setDateList] = useState<Calendar[]>([])
  const { modalOpenList, toggleModalOpenList } = useModalOpenListStore()
  const { onClickSearchLocationFromImg } = useSearch()
  const [targetCalendar, setTargetCalendar] = useState<Calendar | null>(null)

  useEffect(() => {
    let newDateList: Calendar[] = []
    if (mode === "week") {
      for (let i = 0; i < 7; i++) {
        const date = currentDate.add({ days: i })
        const newDate = {
          date,
          markerList: markerList
            .filter((marker) => isSameDay(marker.visited_datetime, date))
            .sort((a, b) =>
              a.visited_datetime.hour < b.visited_datetime.hour ? -1 : 1,
            ),
        }
        newDateList = [...newDateList, newDate]
      }
    } else {
      const startDate = startOfWeek(startOfMonth(currentDate), "en-US")
      const nextLastDate = endOfWeek(endOfMonth(currentDate), "en-US").add({
        days: 1,
      })
      for (
        let date = startDate;
        !isSameDay(date, nextLastDate);
        date = date.add({ days: 1 })
      ) {
        const newDate = {
          date,
          markerList: markerList
            .filter((marker) => isSameDay(marker.visited_datetime, date))
            .sort((a, b) =>
              a.visited_datetime.hour < b.visited_datetime.hour ? -1 : 1,
            ),
        }
        newDateList = [...newDateList, newDate]
      }
    }

    setDateList(newDateList)
  }, [markerList, currentDate, mode])

  return (
    <Modal
      placement="center"
      isOpen={modalOpenList.includes(CALENDAR)}
      onClose={() => toggleModalOpenList(CALENDAR)}
      isDismissable={false}
      className="mx-10"
    >
      <ModalContent>
        <ModalBody className="mb-4">
          <p className="text-center font-bold">
            {currentDate.year}年{currentDate.month}月
          </p>
          <div className="flex justify-between">
            <Dropdown>
              <DropdownTrigger>
                <Button variant="light">
                  {mode === "month" ? "月表示" : "週表示"}
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions" variant="light">
                <DropdownItem key="img" onPress={() => setMode("month")}>
                  月表示
                </DropdownItem>
                <DropdownItem key="img" onPress={() => setMode("week")}>
                  週表示
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() =>
                  setCurrentDate((prevCurrentDate) =>
                    prevCurrentDate.subtract(
                      mode === "week" ? { weeks: 1 } : { months: 1 },
                    ),
                  )
                }
              >
                <Image
                  src="images/left_arrow_icon.svg"
                  alt="左矢印のアイコン"
                  width={20}
                  height={20}
                />
              </button>
              <button
                type="button"
                className="text-[12px]"
                onClick={() => setCurrentDate(startOfWeek(today, "en-US"))}
              >
                今日
              </button>
              <button
                type="button"
                onClick={() =>
                  setCurrentDate((prevCurrentDate) =>
                    prevCurrentDate.add(
                      mode === "week" ? { weeks: 1 } : { months: 1 },
                    ),
                  )
                }
              >
                <Image
                  src="images/right_arrow_icon.svg"
                  alt="右矢印のアイコン"
                  width={20}
                  height={20}
                />
              </button>
            </div>
          </div>
          {mode === "week" ? (
            <div className="max-h-[50vh] overflow-x-auto">
              {dateList.map((item) => (
                <div
                  id={`date-${item.date.year}-${item.date.month}-${item.date.day}`}
                  key={`date-${item.date.year}-${item.date.month}-${item.date.day}`}
                  className={`mx-2 flex justify-between py-2 ${isSameDay(today, item.date) ? "border-b-1 border-amber-700" : "border-b-1"}`}
                >
                  <div
                    className={`w-[20%] whitespace-nowrap ${isSameDay(today, item.date) ? "font-bold text-amber-700" : getDayOfWeek(item.date, "en-US") === 0 ? "text-red-500" : getDayOfWeek(item.date, "en-US") === 6 ? "text-blue-500" : ""}`}
                  >
                    {`${!isSameMonth(currentDate, item.date) ? `${item.date.month}/` : ""}${item.date.day}(${WEEK_DAY[getDayOfWeek(item.date, "en-US")]})`}
                  </div>
                  <div className="flex w-[70%] flex-col gap-1 text-white">
                    {item.markerList.map((marker) => (
                      <button
                        type="button"
                        className="ml-2 flex gap-2 border-l-4 border-amber-900 bg-amber-700 p-1 text-left text-small"
                        key={`calendar-marker-${marker.id}`}
                        onClick={() => onClickSearchLocationFromImg(marker.id)}
                      >
                        <span className="w-[30%] whitespace-nowrap">
                          {formatTime(marker.visited_datetime)}
                        </span>
                        <span className="w-[60%] truncate">{marker.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="max-h-[50vh] overflow-x-auto">
              <div className="grid grid-cols-7 justify-center">
                {WEEK_DAY.map((w, i) => (
                  <div
                    key={`week-${i}`}
                    className={`text-center${i === 0 ? " text-red-500" : ""}${i === 6 ? " text-blue-500" : ""}`}
                  >
                    {w}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 justify-center">
                {dateList.map((item) => (
                  <button
                    type="button"
                    id={`date-${item.date.year}-${item.date.month}-${item.date.day}`}
                    key={`date-${item.date.year}-${item.date.month}-${item.date.day}`}
                    className="flex flex-col items-center gap-1 border py-2"
                    onClick={() => setTargetCalendar(item)}
                  >
                    <div
                      className={`w-[20px] text-center leading-[20px]
                        ${
                          isSameDay(today, item.date)
                            ? "rounded-full bg-amber-700 text-white"
                            : isSameMonth(currentDate, item.date)
                              ? ""
                              : "text-gray-300"
                        }
                      `}
                    >
                      {item.date.day}
                    </div>
                    <div>
                      {item.markerList.length !== 0 && (
                        <div className="h-[10px] w-[10px] rounded-full bg-amber-700" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
              {targetCalendar != null && (
                <div
                  id={`date-${targetCalendar.date.year}-${targetCalendar.date.month}-${targetCalendar.date.day}`}
                  key={`date-${targetCalendar.date.year}-${targetCalendar.date.month}-${targetCalendar.date.day}`}
                  className="mx-2 flex justify-between pt-4"
                >
                  <div className="w-[20%] whitespace-nowrap ">
                    {`${targetCalendar.date.month}/${targetCalendar.date.day}`}
                  </div>
                  <div className="flex w-[70%] flex-col gap-1 text-white">
                    {targetCalendar.markerList.length === 0 && (
                      <p className="text-center text-gray-400">記録なし</p>
                    )}
                    {targetCalendar.markerList.map((marker) => (
                      <button
                        type="button"
                        className="ml-2 flex gap-2 border-l-4 border-amber-900 bg-amber-700 p-1 text-left text-small"
                        key={`calendar-marker-${marker.id}`}
                        onClick={() => onClickSearchLocationFromImg(marker.id)}
                      >
                        <span className="w-[30%] whitespace-nowrap">
                          {formatTime(marker.visited_datetime)}
                        </span>
                        <span className="w-[60%] truncate">{marker.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
