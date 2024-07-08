"use server";
import { supabaseClient } from "@/lib/client/supabase/supabaseClient";

// Your component or event handler
export async function fetchCast(castId: number) {
  try {
    let castCall = supabaseClient
      .from("cast_datas_v2")
      .select("*")
      .eq("id", castId);
    let countsCall = supabaseClient
      .from("cast_counts_v2")
      .select("*")
      .eq("id", castId);
    let [{ data }, { data: td }] = await Promise.all([castCall, countsCall]);

    console.log(data, td);

    if (!data || !data.length || !td || !td.length) {
      return { error: "No cast" };
    }

    let ans = {
      ...data[0],
      num_derivatives: td[0].number_of_direct_children,
      num_total_derivatives: td[0].number_of_children,
    };

    let lpCall = supabaseClient
      .from("cast_datas_v2")
      .select("*")
      .eq("parent_id", castId)
      .order("id", { ascending: false })
      .limit(10);
    let vhCall = supabaseClient.rpc("fetchbranchv2", {
      leaf_id: castId,
    });
    let [{ data: latest_prompts }, { data: version_history }] =
      await Promise.all([lpCall, vhCall]);

    console.log(latest_prompts, version_history);
    ans["latest_prompts"] = latest_prompts;
    ans["version_history"] = version_history;
    let { data: tree } = await supabaseClient.rpc("fetchtreev2", {
      starting_id: version_history[version_history.length - 1].id,
    });
    ans["tree"] = tree;

    return ans;
  } catch (error) {
    console.error("Error during API call:", error);
  }
}
