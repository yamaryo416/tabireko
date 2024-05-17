import { v4 as uuidv4 } from "uuid";

import { supabase } from "../supabase/client";

export const uploadImage = async (file: File) => {
  const extName = file.name.split(".")[1];
  const pathName = `marker/${uuidv4()}.${extName}`;
  return await supabase.storage.from("images").upload(pathName, file, {
    cacheControl: "3600",
    upsert: false,
  });
};
