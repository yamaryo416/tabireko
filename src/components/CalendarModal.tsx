import { Calendar } from "@/types/calendar"
import { Marker } from "@/types/marker"
import { endOfMonth, getLocalTimeZone, isSameDay, isSameMonth, now, startOfMonth } from "@internationalized/date"
import {
  Modal,
  ModalContent,
  ModalBody,
} from "@nextui-org/react"
import Image from "next/image"
import { useEffect, useState } from "react"

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
  const [currentDate, setCurrentDate] = useState(now(getLocalTimeZone()))
  const [dateList, setDateList] = useState<Calendar[]>([])

  useEffect(() => {
    const firstDate = startOfMonth(currentDate)
    const lastDay = endOfMonth(currentDate).day
    let newDateList: Calendar[] = []
    for (let i = 0; i < lastDay; i++) {
      const date = firstDate.cycle("day", i)
      const newDate = {
        date,
        markerList: markerList.filter((marker) =>
          isSameDay(marker.visited_datetime, date),
        ),
      }
      newDateList = [...newDateList, newDate]
    }
    setDateList(newDateList)
  }, [markerList, currentDate])

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
          <div className="flex justify-end gap-4">
            <button
              onClick={() =>
                setCurrentDate((prevCurrentDate) =>
                  prevCurrentDate.cycle("month", -1),
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
                  prevCurrentDate.cycle("month", 1),
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
          <div className="overflow-x-auto max-h-[50vh]">
            {dateList.map((item) => (
              <div
                key={`date-${item.date.year}-${item.date.month}-${item.date.day}`}
                className="flex justify-between border-b-1 py-2 mx-2"
              >
                <div className="w-[10%]">{item.date.day}日</div>
                <div className="w-[90%] flex flex-col gap-1 text-white">
                  {item.markerList.map((marker) => (
                    <button
                      type="button"
                      className="bg-amber-700 border-l-4 border-amber-900 w-[100%] ml-2 p-1"
                      key={`calendar-marker-${marker.id}`}
                      onClick={() => onClickSearchLocationFromImg(marker.id)}
                    >
                      {marker.title}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
