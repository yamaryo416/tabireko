import { Calendar } from "@/types/calendar"
import { Marker } from "@/types/marker"
import { formatTime } from "@/utils/datetime"
import { endOfMonth, endOfWeek, getDayOfWeek, getLocalTimeZone, isSameDay, isSameMonth, now, startOfMonth, startOfWeek, toTime } from "@internationalized/date"
import {
  Button,
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Modal,
  ModalContent,
  ModalBody,
} from "@nextui-org/react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

const WEEK_DAY = [
  "日",
  "月",
  "火",
  "水",
  "木",
  "金",
  "土",
]

type PropsType = {
  markerList: Marker[]
  isOpenModal: boolean
  onCloseModal: () => void
  onClickSearchLocationFromImg: (markerId: number) => void
}

export const CalendarModal = ({
  markerList,
  isOpenModal,
  onCloseModal,
  onClickSearchLocationFromImg,
}: PropsType) => {
  const targetDate = useRef<HTMLDivElement>(null)
  const today = now(getLocalTimeZone())
  const [mode, setMode] = useState<"week" | "month">("week")
  const [currentDate, setCurrentDate] = useState(startOfWeek(today, "en-US"))
  const [dateList, setDateList] = useState<Calendar[]>([])

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
      const startDate = startOfMonth(currentDate)
      const lastDay = endOfMonth(currentDate).day
      for (let i = 0; i <= lastDay; i++) {
        const date = startDate.add({ days: i })
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

  useEffect(() => {
    if (targetDate == null || targetDate.current == null) return
    targetDate.current.scrollIntoView()
  }, [targetDate])

  return (
    <Modal
      placement="center"
      isOpen={isOpenModal}
      onClose={onCloseModal}
      isDismissable={false}
      className="mx-10"
    >
      <ModalContent>
        <ModalBody>
          <p className="text-center font-bold">{currentDate.month}月</p>
          <div className="flex justify-between">
            <Dropdown>
              <DropdownTrigger>
                <Button variant="light">
                  {mode === "month" ? "月表示" : "週表示"}
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions" variant="light">
                <DropdownItem
                  key="img"
                  onPress={() => setMode("month")}
                  onClick={() => setMode("month")}
                >
                  月表示
                </DropdownItem>
                <DropdownItem
                  key="img"
                  onPress={() => setMode("week")}
                  onClick={() => setMode("week")}
                >
                  週表示
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <div className="flex gap-4">
              <button
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
<div className="overflow-x-auto max-h-[50vh]">
            {dateList.map((item) => (
              <div
                ref={isSameDay(today, item.date) ? targetDate : null}
                id={`date-${item.date.year}-${item.date.month}-${item.date.day}`}
                key={`date-${item.date.year}-${item.date.month}-${item.date.day}`}
                className={`flex justify-between py-2 mx-2 ${isSameDay(today, item.date) ? "border-b-1 border-amber-700" : "border-b-1"}`}
              >
                <div
                  className={`w-[20%] whitespace-nowrap ${isSameDay(today, item.date) ? "font-bold text-amber-700" : ""}`}
                >
                  {`${!isSameMonth(currentDate, item.date) ? `${item.date.month}/` : ""}${item.date.day}(${WEEK_DAY[getDayOfWeek(item.date, "en-US")]})`}
                </div>
                <div className="w-[70%] flex flex-col gap-1 text-white">
                  {item.markerList.map((marker) => (
                    <button
                      type="button"
                      className="bg-amber-700 border-l-4 border-amber-900 ml-2 p-1 flex gap-2 text-left text-small"
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
          ) : <p className="text-center my-2">準備中</p>}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
