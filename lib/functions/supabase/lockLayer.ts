'use server';
import { supabaseClient } from "../../client/supabase/supabaseClient";

export async function lockLayer(
    layer_1_cast_id: number
) {
    // upload to user row
    const { data } = await supabaseClient.from('cast_datas').update({
        locked: true
    }).eq('id', layer_1_cast_id);
}