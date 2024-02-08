import { Cast } from "@/lib/types/cast.interface";
import { supabaseClient } from "../supabaseClient";

export async function fetchCast(castId: number): Promise<Cast | null> {
    const { data, error } = await supabaseClient.from('cast_datas').select('*, cast_datas(count)').eq('id', castId);
    if (!data || !data.length) {
        return null;
    }

    return {
        ...data[0],
        num_derivatives: data[0].cast_datas[0].count
    };
}