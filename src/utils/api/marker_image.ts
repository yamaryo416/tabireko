import { supabase } from "../supabase/client"

export const getEachMarkerImage = async (ids: number[]) => {
  return await supabase.from("marker_img").select("*").in("marker_id", ids)
}

export const getMarkerImage = async (id: number) => {
  return await supabase.from("marker_img").select("*").eq("marker_id", id)
}

export const createMarkerImage = async (imgData: any) => {
  return await supabase.from("marker_img").insert(imgData)
}

export const deleteMakerImage = async (ids: number[]) => {
  return await supabase.from("marker_img").delete().in("id", ids)
}
