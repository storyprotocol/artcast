import { Cast } from "@/lib/types/cast.interface";
import { supabaseClient } from "../supabaseClient";

export async function fetchCast(castId: number): Promise<Cast | null> {
    const { data, error } = await supabaseClient.from('cast_datas').select('*, layer_1_cast:layer_1_cast_id(locked)').eq('id', castId);
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

    return ans;
}