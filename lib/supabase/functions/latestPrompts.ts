import { Cast } from "@/lib/types/cast.interface";
import { supabaseClient } from "../supabaseClient";

export async function latestPrompts(castId: number): Promise<Cast[] | null> {
    const { data, error } = await supabaseClient.from('cast_datas').select('*').eq('parent_id', castId).order('id', { ascending: false }).limit(10);
    if (!data || !data.length) {
        return [];
    }

    return data;
}