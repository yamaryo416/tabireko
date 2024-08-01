"use client"

import { NextUIProvider, Spinner } from "@nextui-org/react"

import { MapProvider } from "@/provider/MapProvider"
import { FlashMessage } from "@/components/FlashMessage"
import { Header } from "@/components/Header"
import { CustomMap } from "@/components/CustomMap"
import { MarkerDetailModal } from "@/components/MarkerDetailModal"
import Head from "next/head"
import { PublicLayout } from "@/components/PublicLayout"
import { Suspense } from "react"
import { CalendarModal } from "@/components/CalendarModal"
import { AllImgModal } from "@/components/AllImgModal"
import { SearchMarkerModal } from "@/components/SearchMarkerModal"

export default function PublicPage() {
  return (
    <main>
      <Head>
        <title>旅ろぐ</title>
      </Head>
      <MapProvider>
        <NextUIProvider locale="ja">
          <Suspense fallback={<Spinner />}>
            <PublicLayout>
              <div className="fixed left-0 top-0 w-full">
                <FlashMessage />
                {/* ヘッダー */}
                <Header />
                {/* メインマップ */}
                <CustomMap isPublic />
                {/* マーカー詳細モーダル */}
                <MarkerDetailModal isPublic />
                {/* カレンダーモーダル */}
                <CalendarModal />
                {/* 画像一覧モーダル */}
                <AllImgModal />
                {/* マーカー検索モーダル */}
                <SearchMarkerModal />
                <div id="map_canvas" />
                <div className="mt-[20000px]">&copy;2024 ryo yamaguchi</div>
              </div>
            </PublicLayout>
          </Suspense>
        </NextUIProvider>
      </MapProvider>
    </main>
  )
}
