import { supabase } from "../supabase/client";

export const getIconList = async () => {
  return await supabase.from("icon").select("*");
};
