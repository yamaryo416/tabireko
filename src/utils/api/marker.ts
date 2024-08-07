import { supabase } from "../supabase/client"

export const getMarkerList = async () => {
  const userData = await supabase.auth.getUser()
  if (userData?.data?.user == null) {
    return { error: null, data: null }
  }
  return await supabase
    .from("marker")
    .select(
      `
      id,
      created_at,
      user_id,
      visited_datetime,
      lat,
      lng,
      content,
      title,
      official_title,
      official_description,
      official_web_url,
      official_google_map_url,
      tag (
        id,
        created_at,
        user_id,
        name,
        access_token,
        icon (
          id,
          created_at,
          name,
          url
        )
      )
    `,
    )
    .eq("user_id", userData.data.user.id)
}

export const getMarkerListByTagId = async (tagId: number) => {
  return await supabase
    .from("marker")
    .select(
      `
      id,
      created_at,
      user_id,
      visited_datetime,
      lat,
      lng,
      content,
      title,
      official_title,
      official_description,
      official_web_url,
      official_google_map_url,
      tag (
        id,
        created_at,
        user_id,
        name,
        access_token,
        icon (
          id,
          created_at,
          name,
          url
        )
      )
    `,
    )
    .eq("tag_id", tagId)
}

export const createMarker = async (data: any) => {
  return await supabase.from("marker").insert([data]).select(`
      id,
      created_at,
      user_id,
      visited_datetime,
      lat,
      lng,
      content,
      title,
      official_title,
      official_description,
      official_web_url,
      official_google_map_url,
      tag (
        id,
        created_at,
        user_id,
        name,
        access_token,
        icon (
          id,
          created_at,
          name,
          url
        )
      )
  `)
}

export const updateMarker = async (id: number, data: any) => {
  return await supabase.from("marker").update(data).eq("id", id).select(`
      id,
      created_at,
      user_id,
      visited_datetime,
      lat,
      lng,
      content,
      title,
      official_title,
      official_description,
      official_web_url,
      official_google_map_url,
      tag (
        id,
        created_at,
        user_id,
        name,
        access_token,
        icon (
          id,
          created_at,
          name,
          url
        )
      )
  `)
}

export const deleteMarker = async (id: number) => {
  return await supabase.from("marker").delete().eq("id", id)
}
