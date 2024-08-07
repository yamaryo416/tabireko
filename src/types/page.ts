export const MARKER_CREATE = "marker-create"
export const TAG_CREATE = "tag-create"
export const MARKER_DETAIL = "marker-detail"
export const MARKER_EDIT = "marker-edit"
export const MARKER_DELETE = "marker-delete"
export const CALENDAR = "calendar"
export const TAG_FILTER = "tag-filter"
export const IMG_LIST = "img-list"
export const SEARCH_LOCATION = "search-location"
export const SEARCH_MARKER = "search-marker"
export const INSTANCE_MARKER_CREATE = "instance-marker-create"
export const PUBLIC_MARKER = "public-marker"

export const PUBLIC_MENU_LIST = [
  {
    img: "calendar_icon.svg",
    key: CALENDAR,
    description: "calendar",
    label: "カレンダー",
  },
  {
    img: "image_icon.svg",
    key: IMG_LIST,
    description: "image list",
    label: "画像一覧",
  },
  {
    img: "search_icon.svg",
    key: SEARCH_MARKER,
    description: "search record",
    label: "記録検索",
  },
]

export const MENU_LIST = [
  ...PUBLIC_MENU_LIST,
  {
    img: "filter_icon.svg",
    key: TAG_FILTER,
    description: "filter tag",
    label: "タグで絞り込み",
  },
  {
    img: "search_icon.svg",
    key: SEARCH_LOCATION,
    description: "search location",
    label: "場所検索",
  },
  {
    img: "marker_icon.svg",
    key: PUBLIC_MARKER,
    description: "public marker",
    label: "マーカー公開設定",
  },
]
