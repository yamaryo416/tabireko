"use client"

import { NextUIProvider, Spinner } from "@nextui-org/react"

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
import { ConfirmInstanceMarkerCreateModal } from "@/components/ConfirmInstanceMarkerCreateModal"
import { PublicMarkerSettingModal } from "@/components/PublicMarkerSettingModal"
import Head from "next/head"
import { PrivateLayout } from "@/components/PrivateLayout"
import { Suspense } from "react"

export default function Home() {
  useFetch()

  return (
    <main>
      <Head>
        <title>旅ろぐ</title>
      </Head>
      <MapProvider>
        <NextUIProvider locale="ja">
          <Suspense fallback={<Spinner />}>
            <PrivateLayout>
              <div className="fixed left-0 top-0 w-full">
                <FlashMessage />
                {/* ヘッダー */}
                <Header />
                {/* メインマップ */}
                <CustomMap isPublic={false} />
                {/* マーカー作成モーダル */}
                <MarkerCreateModal />
                {/* タグ作成モーダル */}
                <TagCreateModal />
                {/* マーカー詳細モーダル */}
                <MarkerDetailModal isPublic={false} />
                {/* マーカー編集モーダル */}
                <MarkerEditModal />
                {/* マーカー削除モーダル */}
                <MarkerDeleteModal />
                {/* カレンダーモーダル */}
                <CalendarModal />
                {/* タグ絞り込みモーダル */}
                <FilterTagModal />
                {/* 公開マーカー設定のモーダル */}
                <PublicMarkerSettingModal />
                {/* 画像一覧モーダル */}
                <AllImgModal />
                {/* 場所検索モーダル */}
                <SearchLocationModal />
                {/* マーカー検索モーダル */}
                <SearchMarkerModal />
                {/* 現在地から記録を即作成する確認モーダル */}
                <ConfirmInstanceMarkerCreateModal />
                <div id="map_canvas" />
              </div>
            </PrivateLayout>
          </Suspense>
        </NextUIProvider>
      </MapProvider>
    </main>
  )
}
