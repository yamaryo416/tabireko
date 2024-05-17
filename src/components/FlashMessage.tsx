"use client"

import { Dispatch, SetStateAction, useEffect } from "react"

import { Flash } from "@/types/flash"

export const FLASH_COLOR_MAPPING: { [key: string]: string } = {
  success: "#f39f5a",
  failed: "#ff5555",
}

type PropsType = {
  flash: Flash | null
  setFlash: Dispatch<SetStateAction<Flash | null>>
}

export const FlashMessage = ({ flash, setFlash }: PropsType) => {
  useEffect(() => {
    if (flash) {
      setTimeout(() => {
        setFlash(null)
      }, 4000)
    }
  }, [flash])

  if (!flash) return <></>

  return (
    <div
      data-testid="flashMessage"
      className="fixed bottom-10 right-0 p-5 text-center transition-[right] duration-500 ease-in text-white rounded-l-md z-[100000] whitespace-pre-wrap"
      style={{
        backgroundColor: FLASH_COLOR_MAPPING[flash.kind],
      }}
    >
      {flash.message}
    </div>
  )
}
