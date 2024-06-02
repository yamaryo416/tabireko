"use client"

import { NextUIProvider } from "@nextui-org/react"

import { MapProvider } from "@/provider/MapProvider"
import { FlashMessage } from "@/components/FlashMessage"
import { Header } from "@/components/Header"
import { CustomMap } from "@/components/CustomMap"
import { MarkerCreateModal } from "@/components/MarkerCreateModal"
import { MarkerDetailModal } from "@/components/MarkerDetailModal"
import { MarkerEditModal } from "@/components/MarkerEditModal"
import { TagCreateModal } from "@/components/TagCreateModal"
import { SearchMarkerModal } from "@/components/SearchMarkerModal"
import { CalendarModal } from "@/components/CalendarModal"
import { SearchLocationModal } from "@/components/SearchLocationModal"
import { FilterTagModal } from "@/components/FilterTagModal"
import { AllImgModal } from "@/components/AllImgModal"
import { useFetch } from "@/hooks/use-fetch"
import { MarkerDeleteModal } from "@/components/MarkerDeleteModal"

export default function Home() {
  useFetch()
  return (
    <main>
      {/* <Header /> */}
      <MapProvider>
        <NextUIProvider locale="ja">
          <div className="fixed left-0 top-0 w-full">
            <FlashMessage />
            {/* ヘッダー */}
            <Header />
            {/* メインマップ */}
            <CustomMap />
            {/* マーカー作成モーダル */}
            <MarkerCreateModal />
            {/* タグ作成モーダル */}
            <TagCreateModal />
            {/* マーカー詳細モーダル */}
            <MarkerDetailModal />
            {/* マーカー編集モーダル */}
            <MarkerEditModal />
            {/* マーカー削除モーダル */}
            <MarkerDeleteModal />
            {/* カレンダーモーダル */}
            <CalendarModal />
            {/* タグ絞り込みモーダル */}
            <FilterTagModal />
            {/* 画像一覧モーダル */}
            <AllImgModal />
            {/* 場所検索モーダル */}
            <SearchLocationModal />
            {/* マーカー検索モーダル */}
            <SearchMarkerModal />
          </div>
        </NextUIProvider>
      </MapProvider>
    </main>
  )
}
