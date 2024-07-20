"use server";

import { supabaseClient } from "@/lib/client/supabase/supabaseClient";

export async function updateCastWithNftId(
  ipId: string,
  tokenId: string,
  castId: number
) {
  const { data, error } = await supabaseClient
    .from("cast_datas_v2")
    .update({
      ip_id: ipId,
      nft_token_id: tokenId,
    })
    .eq("id", castId);
}
