import { useState } from "react"
import type { ChangeEvent } from "react"
import { useTagListStore } from "../../store/tag-list"
import { supabase } from "@/utils/supabase/client"
import { createTag } from "@/utils/api/tag"
import { useModalOpenListStore } from "../../store/modal-open-list"
import { TAG_CREATE } from "@/types/page"

type ReturnType = {
  newTag: { name: string; icon_id: number }
  changeNewTag: (_e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  handleCreateTag: () => void
}

export const useCreateTag = (): ReturnType => {
  const { tagList, setTagList } = useTagListStore()
  // タグ作成用
  const [newTag, setNewTag] = useState({
    name: "",
    icon_id: 0,
  })
  const { toggleModalOpenList } = useModalOpenListStore()

  // タグ作成用 各カラム編集用イベント
  const changeNewTag = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setNewTag((prevNewTag) => ({ ...prevNewTag, [name]: value }))
  }

  // タグ作成イベント
  const handleCreateTag = async () => {
    const userData = await supabase.auth.getUser()
    const userId = userData?.data?.user?.id
    if (userId == null) return
    const requestData = {
      ...newTag,
      user_id: userId,
    }
    const { data, error } = await createTag(requestData)
    if (error != null || data == null) return
    setTagList([...tagList, data[0]])
    setNewTag({ name: "", icon_id: 0 })
    toggleModalOpenList(TAG_CREATE)
  }

  return {
    newTag,
    changeNewTag,
    handleCreateTag,
  }
}
