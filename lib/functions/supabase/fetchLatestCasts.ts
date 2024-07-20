"use server";
import { Cast } from "@/lib/types/cast.interface";
import { supabaseClient } from "../../client/supabase/supabaseClient";

export async function fetchLatestCasts(): Promise<Cast[] | null> {
  const { data, error } = await supabaseClient
    .from("cast_datas_v2")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);
  if (!data || !data.length) {
    return [];
  }

  return data;
}
