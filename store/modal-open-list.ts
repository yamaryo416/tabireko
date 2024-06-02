import { create } from "zustand"

export const MARKER_CREATE = "marker-create"
export const MARKER_DETAIL = "marker-detail"
export const MARKER_EDIT = "marker-edit"
export const MARKER_DELETE = "marker-delete"
export const CALENDAR = "calendar"

// 開いているモーダル一覧
export const useModalOpenListStore = create<{
  modalOpenList: string[]
  setModalOpenList: (_modalOpenListArg: string[]) => void
  toggleModalOpenList: (_arg: string) => void
}>((set) => ({
  modalOpenList: [],
  setModalOpenList: (modalOpenListArg: string[]) =>
    set({ modalOpenList: modalOpenListArg }),
  toggleModalOpenList: (arg: string) => {
    set((prevModalOpenList) => {
      if (prevModalOpenList.modalOpenList.includes(arg)) {
        return {
          modalOpenList: prevModalOpenList.modalOpenList.filter(
            (item) => item !== arg,
          ),
        }
      } else {
        return { modalOpenList: [...prevModalOpenList.modalOpenList, arg] }
      }
    })
  },
}))
