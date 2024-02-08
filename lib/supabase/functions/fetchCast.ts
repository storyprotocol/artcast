import { supabaseClient } from "../supabaseClient";

export async function fetchCast(castId: number) {
    const { data, error } = await supabaseClient.from('cast_datas').select().eq('id', castId);
    if (!data || !data.length) {
        return {}
    }

    return data[0];
}