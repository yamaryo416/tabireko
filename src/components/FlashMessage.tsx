"use client"

import { useEffect } from "react"

import { useFlashStore } from "../../store/flash"

export const FLASH_COLOR_MAPPING: { [key: string]: string } = {
  success: "#f39f5a",
  failed: "#ff5555",
}

export const FlashMessage = () => {
  const { flash, reset } = useFlashStore()
  useEffect(() => {
    if (flash) {
      setTimeout(() => {
        reset()
      }, 4000)
    }
  }, [flash])

  if (!flash) return <></>

  return (
    <div
      data-testid="flashMessage"
      className="fixed bottom-10 right-0 z-[100000] whitespace-pre-wrap rounded-l-md p-5 text-center text-white transition-[right] duration-500 ease-in"
      style={{
        backgroundColor: FLASH_COLOR_MAPPING[flash.kind],
      }}
    >
      {flash.message}
    </div>
  )
}
