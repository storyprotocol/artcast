import { Cast } from "@/lib/types/cast.interface";
import { supabaseClient } from "../supabaseClient";

export async function fetchCast(castId: number, stage: string): Promise<Cast | null> {
    let castCall = supabaseClient.from('cast_datas').select('*, layer_1_cast:layer_1_cast_id(locked), parent_cast:parent_id(farcaster_id)').eq('id', castId);
    let countsCall = supabaseClient.from('cast_counts').select('*').eq('id', castId);
    let [{ data }, { data: td }] = await Promise.all([castCall, countsCall]);

    if (!data || !data.length || !td || !td.length) {
        return null;
    }


    let ans = {
        ...data[0],
        num_derivatives: td[0].number_of_direct_children,
        num_total_derivatives: td[0].number_of_children
    }
    ans.locked = (ans.branch_num == 1 && ans.locked == true) || (ans.branch_num >= 2 && ans.layer_1_cast.locked == true);
    if (stage !== 'start') {
        return ans;
    }

    let lpCall = supabaseClient.from('cast_datas').select('*').eq('parent_id', castId).order('id', { ascending: false }).limit(10);
    let vhCall = supabaseClient.rpc('fetchbranch', { leaf_id: castId });
    let [{ data: latest_prompts }, { data: version_history }] = await Promise.all([lpCall, vhCall]);
    ans['latest_prompts'] = latest_prompts;
    ans['version_history'] = version_history;

    return ans;
}