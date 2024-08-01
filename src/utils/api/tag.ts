import { supabase } from "../supabase/client"

export const getTagList = async () => {
  const userData = await supabase.auth.getUser()
  if (userData?.data?.user == null) {
    return { error: null, data: null }
  }
  return await supabase
    .from("tag")
    .select(
      `
        id,
        created_at,
        user_id,
        name,
        icon (
          id,
          created_at,
          name,
          url
        )
      `,
    )
    .eq("user_id", userData.data.user.id)
}

export const createTag = async (data: any) => {
  const userData = await supabase.auth.getUser()
  if (userData?.data?.user == null) {
    return { error: null, data: null }
  }
  return await supabase.from("tag").insert([data]).select(`
        id,
        created_at,
        user_id,
        name,
        icon (
          id,
          created_at,
          name,
          url
        )
      `)
}

export const updateTag = async (id: number, data: any) => {
  const userData = await supabase.auth.getUser()
  if (userData?.data?.user == null) {
    return { error: null, data: null }
  }
  return await supabase
    .from("tag")
    .update(data)
    .eq("id", id)
    .select("accss_token")
}
