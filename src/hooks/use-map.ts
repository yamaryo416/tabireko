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
  getEachMarkerImage,
  getMarkerImage,
} from "@/utils/api/marker_image"
import { useDisclosure } from "@nextui-org/react"
import { EachMarkerImage, MarkerImage } from "@/types/marker_image"
import { Flash } from "@/types/flash"
import { useDebounce } from "use-debounce"
import {
  createMarkerOfficialImage,
  getMarkerOfficialImage,
} from "@/utils/api/marker_official_image"
import { MarkerOfficialImage } from "@/types/marker_official_image"
import { DisplayMode } from "@/types/page"

const INIT_NEW_MARKER = {
  title: "",
  content: "",
  lat: 0,
  lng: 0,
  visited_datetime: now(getLocalTimeZone()),
  tagId: 0,
  images: [],
}

type OfficialInfo = {
  title: string
  description: string
  webUrl: string
  googleMapUrl: string
  photos: string[]
}

type ReturnType = {
  displayMode: DisplayMode
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
  allImgList: MarkerImage[]
  eachImgList: EachMarkerImage
  isOpenCreateTagModal: boolean
  isOpenCreateMarkerModal: boolean
  isOpenSearchLocationFromImgModal: boolean
  newMarker: NewMarker
  newTag: { name: string; icon_id: number }
  iconList: Icon[]
  isOpenDetailModal: boolean
  selectedMarker: Marker | null
  selectedMarkerImgs: MarkerImage[]
  selectedMarkerOfficialImgs: MarkerOfficialImage[]
  editMarker: EditMarker | null
  isOpenEditMarkerModal: boolean
  isOpenCalendarModal: boolean
  onOpenCalendarModal: () => void
  onCloseCalendarModal: () => void
  setDisplayMode: Dispatch<SetStateAction<DisplayMode>>
  setFlash: Dispatch<SetStateAction<Flash | null>>
  setFilterTagIds: Dispatch<SetStateAction<number[]>>
  setSelectedMarker: Dispatch<SetStateAction<Marker | null>>
  setMarkerList: Dispatch<SetStateAction<Marker[]>>
  onClickCurrentLoaction: () => void
  onSearchLocation: (e: ChangeEvent<HTMLInputElement>) => void
  onClickSearchLocation: (result: google.maps.GeocoderResult) => void
  onClickSearchLocationFromImg: (markerId: number) => void
  onOpenFilterTagModal: () => void
  onCloseFilterTagModal: () => void
  toggleFilterTagIds: (id: number) => void
  openCreateMarkerModal: (e: google.maps.MapMouseEvent) => void
  markerFilter: (marker: Marker) => boolean
  onOpenDetailMarker: (marker: Marker) => void
  onOpenCreateTagModal: () => void
  onOpenSearchLocationFromImgModal: () => void
  onCloseCreateTagModal: () => void
  onCloseCreateMarkerModal: () => void
  onCloseSearchLocationFromImgModal: () => void
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
  // 一覧表示の際に、画像or吹き出しor何も表示しないを制御する
  const [displayMode, setDisplayMode] = useState<DisplayMode>("balloon")
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
  const [allImgList, setAllImgList] = useState<MarkerImage[]>([])
  // マーカー一覧に紐づく画像一覧
  const [eachImgList, setEachImgList] = useState<EachMarkerImage>({})
  // タグに設定するアイコン一覧
  const [iconList, setIconList] = useState<Icon[]>([])
  // Google Mapに登録されている名称、画像一覧
  const [officialInfo, setOfficialInfo] = useState<OfficialInfo>({
    title: "",
    description: "",
    webUrl: "",
    googleMapUrl: "",
    photos: [],
  })
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
  // マーカー詳細の公式画像一覧
  const [selectedMarkerOfficialImgs, setSelectedMarkerOfficialImgs] = useState<
    MarkerOfficialImage[]
  >([])

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

  // 画像検索モーダル関連
  const {
    isOpen: isOpenSearchLocationFromImgModal,
    onOpen: onOpenSearchLocationFromImgModal,
    onClose: onCloseSearchLocationFromImgModal,
  } = useDisclosure()

  // カレンダーモーダル関連
  const {
    isOpen: isOpenCalendarModal,
    onOpen: onOpenCalendarModal,
    onClose: onCloseCalendarModal,
  } = useDisclosure()

  // 現在地を取得するイベント
  const onClickCurrentLoaction = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCenterLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setZoom(13)
      },
      (err) => {
        console.log(err)
      },
    )
  }

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

  // 画像をクリックした際に、対応するマーカーを中心に持ってくるイベント
  const onClickSearchLocationFromImg = (markerId: number) => {
    const targetMarker = markerList.find((marker) => marker.id === markerId)
    if (targetMarker == null) return
    setCenterLocation({
      lat: targetMarker.lat,
      lng: targetMarker.lng,
    })
    setZoom(15)
    onOpenDetailMarker(targetMarker)
    onCloseSearchLocationFromImgModal()
    onCloseCalendarModal()
  }

  // 地図上にてクリックした地点の座標を保存し、マーカー作成モーダルを開くイベント
  const openCreateMarkerModal = (e: google.maps.MapMouseEvent) => {
    console.log(e)
    // @ts-ignore
    setNewMarker((prevNewMarker) => ({
      ...prevNewMarker,
      lat: e.latLng?.lat() || 0,
      lng: e.latLng?.lng() || 0,
    }))
    onOpenCreateMarkerModal()
    // @ts-ignore
    const { placeId } = e
    if (placeId == null) return
    fetch(
      `https://places.googleapis.com/v1/places/${placeId}?fields=*&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}`,
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.photos != null) {
          // @ts-ignore
          res.photos.slice(0, 3).map((photo) => {
            fetch(
              `https://places.googleapis.com/v1/${photo.name}/media?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&maxWidthPx=400`,
            )
              .then((res) => {
                setOfficialInfo((prevOfficialInfo) => ({
                  ...prevOfficialInfo,
                  photos: [...prevOfficialInfo.photos, res.url],
                }))
              })
              .catch((err) => console.log(err))
          })
        }
        setOfficialInfo((prevOfficialInfo) => ({
          ...prevOfficialInfo,
          title: res.displayName ? res.displayName.text : "",
          description: res.editorialSummary ? res.editorialSummary.text : "",
          webUrl: res.websiteUri || "",
          googleMapUrl: res.googleMapsUri || "",
        }))
      })
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
    setNewMarker((prevNewMarker) => ({
      ...prevNewMarker,
      visited_datetime: value,
    }))
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
    const { title, content, lat, lng, visited_datetime, tagId, images } =
      newMarker
    const userData = await supabase.auth.getUser()
    const userId = userData?.data?.user?.id
    if (userId == null) {
      setFlash({ kind: "failed", message: "記録の作成に失敗しました" })
      setLoading(false)
      return
    }
    const date = new Date(
      visited_datetime.year,
      visited_datetime.month - 1,
      visited_datetime.day,
      visited_datetime.hour,
    )
    let data: RequestCreateMarker = {
      title,
      content,
      user_id: userId,
      visited_datetime: date,
      lat,
      lng,
      official_title: officialInfo.title,
      official_description: officialInfo.description,
      official_web_url: officialInfo.webUrl,
      official_google_map_url: officialInfo.googleMapUrl,
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
    const officialImgData = officialInfo.photos.map((photo) => {
      return {
        marker_id: resCreateMarkerData[0].id,
        url: photo,
      }
    })
    if (officialImgData.length !== 0) {
      const { error: resCreateMarkerOfficialImgError } =
        await createMarkerOfficialImage(officialImgData)
      if (resCreateMarkerOfficialImgError) {
        setFlash({ kind: "failed", message: "記録の作成に失敗しました" })
        setLoading(false)
        return
      }
    }

    const parseDateMarkerList = resCreateMarkerData.map((item) => ({
      ...item,
      visited_datetime: parseAbsoluteToLocal(item.visited_datetime),
    }))

    setMarkerList((prevMarkerList) => [
      ...prevMarkerList,
      parseDateMarkerList[0],
    ])
    setFlash({ kind: "success", message: "記録の作成に成功しました" })
    setOfficialInfo({
      title: "",
      description: "",
      webUrl: "",
      googleMapUrl: "",
      photos: [],
    })
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

  // マーカー詳細に紐づく公式画像一覧を取得
  const getOfficialImageUrl = async (id: number) => {
    let { data, error } = await getMarkerOfficialImage(id)
    if (!!error || data == null) {
      setFlash({ kind: "failed", message: "画像取得に失敗しました" })
      return
    }
    setSelectedMarkerOfficialImgs(data)
  }

  // 対象のマーカー詳細モーダルを開くイベント
  const onOpenDetailMarker = (marker: Marker) => {
    setSelectedMarker(marker)
    onOpenDetailModal()
    getImageUrl(marker.id)
    getOfficialImageUrl(marker.id)
  }

  // マーカー詳細からマーカー編集モーダルを開くイベント
  const onOpenEditMarker = () => {
    if (selectedMarker == null) return
    const {
      id,
      visited_datetime,
      lat,
      lng,
      content,
      tag,
      title,
      official_title,
      official_description,
      official_web_url,
      official_google_map_url,
    } = selectedMarker
    setEditMarker({
      id,
      title,
      content: content ?? "",
      lat,
      lng,
      visited_datetime,
      tagId: tag?.id ?? 0,
      images: selectedMarkerImgs,
      official_title: official_title || "",
      official_description: official_description || "",
      official_web_url: official_web_url || "",
      official_google_map_url: official_google_map_url || "",
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
    setEditMarker({ ...editMarker, visited_datetime: value })
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
    const {
      id,
      title,
      content,
      lat,
      lng,
      visited_datetime,
      tagId,
      images,
      official_title,
      official_description,
      official_web_url,
      official_google_map_url,
    } = editMarker
    const userData = await supabase.auth.getUser()
    const userId = userData?.data?.user?.id
    if (userId == null) {
      setFlash({ kind: "failed", message: "記録の編集に失敗しました" })
      setLoading(false)
      return
    }
    const date = new Date(
      visited_datetime.year,
      visited_datetime.month - 1,
      visited_datetime.day,
      visited_datetime.hour,
    )
    let data: RequestCreateMarker = {
      title,
      content,
      user_id: userId,
      visited_datetime: date,
      lat,
      lng,
      official_title,
      official_description,
      official_web_url,
      official_google_map_url,
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

    const parseDateMarkerList = resEditMarkerData.map((item) => ({
      ...item,
      visited_datetime: parseAbsoluteToLocal(item.visited_datetime),
    }))

    setMarkerList((prevMarkerList) => [
      ...prevMarkerList,
      parseDateMarkerList[0],
    ])
    setSelectedMarker(parseDateMarkerList[0])
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

    const parseDateMarkerList = data.map((item) => ({
      ...item,
      visited_datetime: parseAbsoluteToLocal(item.visited_datetime),
    }))
    const ids = parseDateMarkerList.map((item) => item.id)
    getEachMarkerImageAndSetImage(ids)
    setMarkerList(parseDateMarkerList)
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

  // マーカーに紐づく画像一覧を取得
  const getEachMarkerImageAndSetImage = async (ids: number[]) => {
    let { data, error } = await getEachMarkerImage(ids)
    if (!!error || data == null) {
      setFlash({ kind: "failed", message: "画像取得に失敗しました" })
      return
    }
    setAllImgList(data)
    let newImageList: EachMarkerImage = {}
    data.forEach((item) => {
      if (item.marker_id != null && newImageList[item.marker_id] == null) {
        newImageList[item.marker_id] = item.url
      }
    })
    setEachImgList(newImageList)
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

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCenterLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (err) => {
        console.log(err)
      },
    )
  }, [])

  return {
    displayMode,
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
    allImgList,
    eachImgList,
    isOpenCreateTagModal,
    isOpenCreateMarkerModal,
    isOpenSearchLocationFromImgModal,
    newMarker,
    newTag,
    iconList,
    isOpenDetailModal,
    selectedMarker,
    selectedMarkerImgs,
    selectedMarkerOfficialImgs,
    isOpenEditMarkerModal,
    editMarker,
    isOpenCalendarModal,
    onOpenCalendarModal,
    onCloseCalendarModal,
    setDisplayMode,
    setFlash,
    setFilterTagIds,
    setSelectedMarker,
    setMarkerList,
    onClickCurrentLoaction,
    onSearchLocation,
    onClickSearchLocation,
    onClickSearchLocationFromImg,
    onOpenFilterTagModal,
    onOpenSearchLocationFromImgModal,
    onCloseFilterTagModal,
    onCloseSearchLocationFromImgModal,
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
