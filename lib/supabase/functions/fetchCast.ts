import { Cast } from "@/lib/types/cast.interface";
import { supabaseClient } from "../supabaseClient";
import { latestPrompts } from "./latestPrompts";

export async function fetchCast(castId: number, stage: string): Promise<Cast | null> {
    const { data, error } = await supabaseClient.from('cast_datas').select('*, layer_1_cast:layer_1_cast_id(locked), parent_cast:parent_id(farcaster_id)').eq('id', castId);
    if (!data || !data.length) {
        return null;
    }

    const { data: td } = await supabaseClient.from('cast_counts').select('*').eq('id', castId);

    if (!td || !td.length) {
        return null;
    }


    let ans = {
        ...data[0],
        num_derivatives: td[0].number_of_direct_children,
        num_total_derivatives: td[0].number_of_children
    }
    ans.locked = (ans.branch_num == 1 && ans.locked == true) || (ans.branch_num >= 2 && ans.layer_1_cast.locked == true);
    if (stage === 'start') {
        return ans;
    }

    ans['latest_prompts'] = await latestPrompts(castId);
    const { data: versionHistory } = await supabaseClient.rpc('fetchbranch', { leaf_id: castId })
    ans['version_history'] = versionHistory;

    return ans;
}