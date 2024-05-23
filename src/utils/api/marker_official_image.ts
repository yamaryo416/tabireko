import { supabase } from "../supabase/client"

export const getMarkerOfficialImage = async (id: number) => {
  return await supabase
    .from("marker_official_img")
    .select("*")
    .eq("marker_id", id)
}

export const createMarkerOfficialImage = async (imgData: any) => {
  return await supabase.from("marker_official_img").insert(imgData)
}
