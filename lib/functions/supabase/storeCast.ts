"use server";
import { supabaseClient } from "../../client/supabase/supabaseClient";

export async function storeCast(
  name: string,
  image_path: string | null,
  parent_id: number | null,
  branch_num: number,
  prompt_input: string | null,
  wallet_address: string,
  using_ai: boolean
): Promise<number | null> {
  // upload to user row
  console.log("STORING CAST");
  const { data, error } = await supabaseClient
    .from("cast_datas_v2")
    .insert({
      name,
      image_path,
      parent_id,
      branch_num,
      prompt_input,
      wallet_address,
      using_ai,
    })
    .select();

  if (!data || !data.length) {
    return null;
  }

  let createdCastId = data[0].id;
  return createdCastId;
}
