import { Metadata } from "next"

import { NextUIProvider } from "@nextui-org/react"

import { Header } from "@/components/Header"
import { Map } from "@/components/Map"
import { MapProvider } from "@/provider/MapProvider"

export const metadata: Metadata = {
  title: "旅ろぐ",
}

export default function Home() {
  return (
    <main>
      <Header />
      <MapProvider>
        <NextUIProvider locale="ja">
          <Map />
        </NextUIProvider>
      </MapProvider>
    </main>
  )
}
