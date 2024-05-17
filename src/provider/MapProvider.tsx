"use client"

import { Libraries, useJsApiLoader } from "@react-google-maps/api"
import { ReactNode } from "react"

const libraries = ["places", "drawing", "geometry"]

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const { isLoaded: scriptLoaded, loadError } = useJsApiLoader({
    language: "ja",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string,
    libraries: libraries as Libraries,
  })

  if (loadError) return <p className="pt-[57px]">Map生成に失敗しました</p>

  if (!scriptLoaded) return <p className="pt-[57px]">Mapを生成中...</p>

  return children
}
