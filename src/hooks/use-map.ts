import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react"
import {
  now,
  getLocalTimeZone,
  parseAbsoluteToLocal,
} from "@internationalized/date"

import { Tag } from "@/types/tag"
import { createTag, getTagList } from "@/utils/api/tag"
import { createMarker, getMarkerList, updateMarker } from "@/utils/api/marker"
import {
  EditMarker,
  Marker,
  NewMarker,
  RequestCreateMarker,
} from "@/types/marker"
import { Icon } from "@/types/icon"
import { getIconList } from "@/utils/api/icon"
import { ZonedDateTime } from "@internationalized/date"
import { uploadImage } from "@/utils/api/image"
import { supabase } from "@/utils/supabase/client"
import {
  createMarkerImage,
  deleteMakerImage,
  getMarkerImage,
} from "@/utils/api/marker_image"
import { useDisclosure } from "@nextui-org/react"
import { MarkerImage } from "@/types/marker_image"
import { Flash } from "@/types/flash"
import { useDebounce } from "use-debounce"

const INIT_NEW_MARKER = {
  title: "",
  content: "",
  lat: 0,
  lng: 0,
  dateTime: now(getLocalTimeZone()),
  tagId: 0,
  images: [],
}

type ReturnType = {
  zoom: number
  centerLocation: {
    lat: number
    lng: number
  }
  loading: boolean
  flash: Flash | null
  searchWord: string
  searchSuggestList: google.maps.GeocoderResult[]
  tagList: Tag[]
  isOpenFilterTagModal: boolean
  filterTagIds: number[]
  markerList: Marker[]
  isOpenCreateTagModal: boolean
  isOpenCreateMarkerModal: boolean
  newMarker: NewMarker
  newTag: { name: string; icon_id: number }
  iconList: Icon[]
  isOpenDetailModal: boolean
  selectedMarker: Marker | null
  selectedMarkerImgs: MarkerImage[]
  editMarker: EditMarker | null
  isOpenEditMarkerModal: boolean
  setFlash: Dispatch<SetStateAction<Flash | null>>
  setFilterTagIds: Dispatch<SetStateAction<number[]>>
  setSelectedMarker: Dispatch<SetStateAction<Marker | null>>
  setMarkerList: Dispatch<SetStateAction<Marker[]>>
  onSearchLocation: (e: ChangeEvent<HTMLInputElement>) => void
  onClickSearchLocation: (result: google.maps.GeocoderResult) => void
  onOpenFilterTagModal: () => void
  onCloseFilterTagModal: () => void
  toggleFilterTagIds: (id: number) => void
  openCreateMarkerModal: (e: google.maps.MapMouseEvent) => void
  markerFilter: (marker: Marker) => boolean
  onOpenDetailMarker: (marker: Marker) => void
  onOpenCreateTagModal: () => void
  onCloseCreateTagModal: () => void
  onCloseCreateMarkerModal: () => void
  changeNewMarker: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => void
  changeDatetime: (value: ZonedDateTime) => void
  handleUploadImg: (e: ChangeEvent<HTMLInputElement>, isCreate: boolean) => void
  handleCreateMarker: () => void
  changeNewTag: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  handleCreateTag: () => void
  onCloseDetailModal: () => void
  onOpenEditMarker: () => void
  changeEditMarker: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => void
  changeEditDatetime: (value: ZonedDateTime) => void
  removeImage: (url: string) => void
  handleEditMarker: () => void
  onCloseEditMarkerModal: () => void
}

export const useMap = (): ReturnType => {
  // google mapのズームの倍率(最大20)
  const [zoom, setZoom] = useState(15)
  // 表示するgoogle mapの中心位置
  const [centerLocation, setCenterLocation] = useState({
    lat: 35.68124643324741,
    lng: 139.7672516618131,
  })
  const [loading, setLoading] = useState(false)
  const [flash, setFlash] = useState<Flash | null>(null)
  // 検索キーワード
  const [searchWord, setSearchWord] = useState("")
  // 入力が3秒ない場合に、searchWordを代入
  const [confirmedSearchWord] = useDebounce(searchWord, 1000)

  // 検索語の候補一覧
  const [searchSuggestList, setSearchSuggestList] = useState<
    google.maps.GeocoderResult[]
  >([])
  // タグ一覧
  const [tagList, setTagList] = useState<Tag[]>([])
  // 表示しているマーカーのタグでのフィルター用
  const [filterTagIds, setFilterTagIds] = useState<number[]>([])
  // マーカー一覧
  const [markerList, setMarkerList] = useState<Marker[]>([])
  // タグに設定するアイコン一覧
  const [iconList, setIconList] = useState<Icon[]>([])
  // マーカー作成用
  const [newMarker, setNewMarker] = useState<NewMarker>(INIT_NEW_MARKER)
  // マーカー編集用
  const [editMarker, setEditMarker] = useState<EditMarker | null>(null)
  // マーカー詳細モーダルに表示するマーカー
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null)
  // マーカー詳細の画像一覧
  const [selectedMarkerImgs, setSelectedMarkerImgs] = useState<MarkerImage[]>(
    [],
  )

  // タグ作成用
  const [newTag, setNewTag] = useState({
    name: "",
    icon_id: 0,
  })

  // マーカー作成用モーダル関連
  const {
    isOpen: isOpenCreateMarkerModal,
    onOpen: onOpenCreateMarkerModal,
    onClose: onCloseCreateMarkerModal,
  } = useDisclosure()

  // マーカー詳細用モーダル関連
  const {
    isOpen: isOpenDetailModal,
    onOpen: onOpenDetailModal,
    onClose: onCloseDetailModal,
  } = useDisclosure()

  // マーカー編集用モーダル関連
  const {
    isOpen: isOpenEditMarkerModal,
    onOpen: onOpenEditMarkerModal,
    onClose: onCloseEditMarkerModal,
  } = useDisclosure()

  // タグ作成用モーダル関連
  const {
    isOpen: isOpenCreateTagModal,
    onOpen: onOpenCreateTagModal,
    onClose: onCloseCreateTagModal,
  } = useDisclosure()

  // タグフィルターモーダル関連
  const {
    isOpen: isOpenFilterTagModal,
    onOpen: onOpenFilterTagModal,
    onClose: onCloseFilterTagModal,
  } = useDisclosure()

  // 検索キーワード変更イベント
  const onSearchLocation = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchWord(e.target.value)
  }

  // 候補一覧の一つをクリックして、地図の中心を移動するイベント
  const onClickSearchLocation = (result: google.maps.GeocoderResult) => {
    const lat = result.geometry.location.lat()
    const lng = result.geometry.location.lng()
    const center = {
      lat,
      lng,
    }
    setZoom(20)
    setCenterLocation(center)
    setSearchSuggestList([])
    setSearchWord("")
  }

  // 地図上にてクリックした地点の座標を保存し、マーカー作成モーダルを開くイベント
  const openCreateMarkerModal = (e: google.maps.MapMouseEvent) => {
    setNewMarker((prevNewMarker) => ({
      ...prevNewMarker,
      lat: e.latLng?.lat() || 0,
      lng: e.latLng?.lng() || 0,
    }))
    onOpenCreateMarkerModal()
  }

  // マーカー作成 各カラム編集用イベント
  const changeNewMarker = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setNewMarker((prevNewMarker) => ({ ...prevNewMarker, [name]: value }))
  }

  // マーカー作成 日時編集用イベント
  const changeDatetime = (value: ZonedDateTime) => {
    setNewMarker((prevNewMarker) => ({ ...prevNewMarker, dateTime: value }))
  }

  // マーカー作成 画像投稿用イベント
  const handleUploadImg = async (
    e: ChangeEvent<HTMLInputElement>,
    isCreate: boolean,
  ) => {
    setLoading(true)
    const files = e.target?.files
    if (files == null) return
    const file = files[0]
    const { data, error } = await uploadImage(file)
    if (!!error || data == null) {
      setLoading(false)
      setFlash({ kind: "failed", message: "画像のアップロードに失敗しました" })
      return
    }
    const imgPath = `${process.env.NEXT_PUBLIC_STORAGE_ORIGIN}/images/${data.path}`
    if (isCreate) {
      setNewMarker((prevNewMarker) => ({
        ...prevNewMarker,
        images: [...prevNewMarker.images, imgPath],
      }))
    } else {
      if (!editMarker) return
      const newImages = {
        created_at: "2024-01-01",
        id: 0,
        marker_id: selectedMarker?.id ?? 0,
        url: imgPath,
        user_id: "user_id",
      }
      setEditMarker({
        ...editMarker,
        images: [...editMarker.images, newImages],
      })
    }
    setLoading(false)
  }

  // マーカー作成イベント
  const handleCreateMarker = async () => {
    setLoading(true)
    const { title, content, lat, lng, dateTime, tagId, images } = newMarker
    const userData = await supabase.auth.getUser()
    const userId = userData?.data?.user?.id
    if (userId == null) {
      setFlash({ kind: "failed", message: "記録の作成に失敗しました" })
      setLoading(false)
      return
    }
    const date = new Date(
      dateTime.year,
      dateTime.month - 1,
      dateTime.day,
      dateTime.hour + 9,
    )
    let data: RequestCreateMarker = {
      title,
      content,
      user_id: userId,
      visited_datetime: date,
      lat,
      lng,
    }
    if (tagId !== 0) {
      data = { ...data, tag_id: tagId }
    }
    const { data: resCreateMarkerData, error: resCreateMarkerError } =
      await createMarker(data)
    if (resCreateMarkerError || !resCreateMarkerData) {
      setFlash({ kind: "failed", message: "記録の作成に失敗しました" })
      setLoading(false)
      return
    }
    if (images.length !== 0) {
      const imgData = images.map((img) => ({
        user_id: userId,
        marker_id: resCreateMarkerData[0].id,
        url: img,
      }))
      const { error: resCreateMarkerImgError } =
        await createMarkerImage(imgData)
      if (resCreateMarkerImgError) {
        setFlash({ kind: "failed", message: "記録の作成に失敗しました" })
        setLoading(false)
        return
      }
    }
    setMarkerList((prevMarkerList) => [
      ...prevMarkerList,
      resCreateMarkerData[0],
    ])
    setFlash({ kind: "success", message: "記録の作成に成功しました" })
    setNewMarker(INIT_NEW_MARKER)
    setLoading(false)
    onCloseCreateMarkerModal()
  }

  // タグ作成用 各カラム編集用イベント
  const changeNewTag = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setNewTag((prevNewTag) => ({ ...prevNewTag, [name]: value }))
  }

  // マップに表示するマーカーのタグ絞り込みイベント
  const toggleFilterTagIds = (id: number) => {
    if (filterTagIds.includes(id)) {
      const newFilterTagIds = [...filterTagIds].filter((tagId) => tagId !== id)
      setFilterTagIds(newFilterTagIds)
    } else {
      const newFilterTagIds = [...filterTagIds, id]
      setFilterTagIds(newFilterTagIds)
    }
  }

  // マーカー詳細に紐づく画像一覧を取得
  const getImageUrl = async (id: number) => {
    let { data, error } = await getMarkerImage(id)
    if (!!error || data == null) {
      setFlash({ kind: "failed", message: "画像取得に失敗しました" })
      return
    }
    setSelectedMarkerImgs(data)
  }

  // 対象のマーカー詳細モーダルを開くイベント
  const onOpenDetailMarker = (marker: Marker) => {
    setSelectedMarker(marker)
    onOpenDetailModal()
    getImageUrl(marker.id)
  }

  // マーカー詳細からマーカー編集モーダルを開くイベント
  const onOpenEditMarker = () => {
    if (selectedMarker == null) return
    const { id, visited_datetime, lat, lng, content, tag, title } =
      selectedMarker
    const dateTime = parseAbsoluteToLocal(visited_datetime + "Z")
    setEditMarker({
      id,
      title,
      content: content ?? "",
      lat,
      lng,
      dateTime,
      tagId: tag?.id ?? 0,
      images: selectedMarkerImgs,
    })
    onOpenEditMarkerModal()
  }

  // マーカー編集 各カラム編集用イベント
  const changeEditMarker = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    if (editMarker == null) return
    const { name, value } = e.target
    setEditMarker({ ...editMarker, [name]: value })
  }

  // マーカー編集 日時編集用イベント
  const changeEditDatetime = (value: ZonedDateTime) => {
    if (editMarker == null) return
    setEditMarker({ ...editMarker, dateTime: value })
  }

  // マーカー編集 画像削除用イベント
  const removeImage = (url: string) => {
    if (editMarker == null) return
    setEditMarker({
      ...editMarker,
      images: editMarker.images.filter((img) => img.url !== url),
    })
  }

  // マーカー編集イベント
  const handleEditMarker = async () => {
    if (!editMarker) return
    if (!selectedMarkerImgs) return
    setLoading(true)
    const { id, title, content, lat, lng, dateTime, tagId, images } = editMarker
    const userData = await supabase.auth.getUser()
    const userId = userData?.data?.user?.id
    if (userId == null) {
      setFlash({ kind: "failed", message: "記録の編集に失敗しました" })
      setLoading(false)
      return
    }
    const date = new Date(
      dateTime.year,
      dateTime.month - 1,
      dateTime.day,
      dateTime.hour + 9,
    )
    let data: RequestCreateMarker = {
      title,
      content,
      user_id: userId,
      visited_datetime: date,
      lat,
      lng,
    }
    if (tagId !== 0) {
      data = { ...data, tag_id: tagId }
    }
    const { data: resEditMarkerData, error: resEditMarkerError } =
      await updateMarker(id, data)
    if (!resEditMarkerData || !!resEditMarkerError) {
      setFlash({ kind: "failed", message: "記録の編集に失敗しました" })
      setLoading(false)
      return
    }
    const prevMarkerImgIds = selectedMarkerImgs.map((img) => img.id)
    const newMarkerImgsIds = images.map((img) => img.id)
    const deleteMarkerIds = prevMarkerImgIds.filter(
      (id) => !newMarkerImgsIds.includes(id),
    )
    if (deleteMarkerIds.length !== 0) {
      const { error: resCreateMarkerImgError } =
        await deleteMakerImage(deleteMarkerIds)
      if (!!resCreateMarkerImgError) {
        setFlash({ kind: "failed", message: "記録の編集に失敗しました" })
        setLoading(false)
        return
      }
    }

    if (images.length !== 0) {
      const imgData = images
        .filter((img) => img.id === 0)
        .map((img) => ({
          user_id: userId,
          marker_id: id,
          url: img.url,
        }))
      const { error: resCreateMarkerImgError } =
        await createMarkerImage(imgData)

      if (!!resCreateMarkerImgError) {
        setFlash({ kind: "failed", message: "記録の編集に失敗しました" })
        setLoading(false)
        return
      }
    }
    setMarkerList((prevMarkerList) => [...prevMarkerList, resEditMarkerData[0]])
    setSelectedMarker(resEditMarkerData[0])
    setFlash({ kind: "success", message: "記録の編集に成功しました" })
    setNewMarker(INIT_NEW_MARKER)
    await getImageUrl(id)
    setLoading(false)
    onCloseEditMarkerModal()
  }

  // タグ作成イベント
  const handleCreateTag = async () => {
    const userData = await supabase.auth.getUser()
    const userId = userData?.data?.user?.id
    if (userId == null) return
    const data = {
      ...newTag,
      user_id: userId,
    }
    const { data: resCreateTagData, error: resCreateTagError } =
      await createTag(data)
    if (!!resCreateTagError || !resCreateTagData) return
    setTagList((prevTags) => [...prevTags, resCreateTagData[0]])
    setNewTag({ name: "", icon_id: 0 })
    onCloseCreateTagModal()
  }

  // マーカーをタグでフィルターする関数
  const markerFilter = (marker: Marker): boolean => {
    return (
      (!marker.tag && filterTagIds.includes(0)) ||
      (!!marker.tag && filterTagIds.includes(marker.tag.id))
    )
  }

  // マーカー一覧取得
  const fetchMarkerList = async () => {
    const { data, error } = await getMarkerList()
    if (!!error || data == null) {
      setFlash({ kind: "failed", message: "マーカー一覧取得に失敗しました" })
      return
    }
    setMarkerList(data)
  }

  // タグ一覧取得
  const fetchTagList = async () => {
    const { data, error } = await getTagList()
    if (!!error || data == null) {
      setFlash({ kind: "failed", message: "タグ一覧取得に失敗しました" })
      return
    }
    setTagList(data)
    setFilterTagIds([...data.map((tag) => tag.id), 0])
  }

  // アイコン一覧取得
  const fetchIconList = async () => {
    const { data, error } = await getIconList()
    if (!!error || data == null) {
      setFlash({ kind: "failed", message: "アイコン一覧取得に失敗しました" })
      return
    }
    setIconList(data)
  }

  useEffect(() => {
    fetchMarkerList()
    fetchTagList()
    fetchIconList()
  }, [])

  // 検索キーワード入力後のGoogle map apiにて候補一覧を取得
  useEffect(() => {
    if (confirmedSearchWord === "") return
    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode(
      { address: confirmedSearchWord },
      async (results, status) => {
        if (status === "OK" && results) {
          setSearchSuggestList(results)
        }
      },
    )
  }, [confirmedSearchWord])

  return {
    zoom,
    centerLocation,
    loading,
    flash,
    searchWord,
    searchSuggestList,
    tagList,
    isOpenFilterTagModal,
    filterTagIds,
    markerList,
    isOpenCreateTagModal,
    isOpenCreateMarkerModal,
    newMarker,
    newTag,
    iconList,
    isOpenDetailModal,
    selectedMarker,
    selectedMarkerImgs,
    isOpenEditMarkerModal,
    editMarker,
    setFlash,
    setFilterTagIds,
    setSelectedMarker,
    setMarkerList,
    onSearchLocation,
    onClickSearchLocation,
    onOpenFilterTagModal,
    onCloseFilterTagModal,
    toggleFilterTagIds,
    openCreateMarkerModal,
    markerFilter,
    onOpenDetailMarker,
    onOpenCreateTagModal,
    onCloseCreateTagModal,
    onCloseCreateMarkerModal,
    changeNewMarker,
    changeDatetime,
    handleUploadImg,
    handleCreateMarker,
    changeNewTag,
    handleCreateTag,
    onCloseDetailModal,
    onOpenEditMarker,
    changeEditMarker,
    changeEditDatetime,
    removeImage,
    handleEditMarker,
    onCloseEditMarkerModal,
  }
}
