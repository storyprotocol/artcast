import { supabaseClient } from "../supabaseClient";

export async function storeCast(
    name: string,
    farcaster_id: string,
    image_path: string | null,
    parent_id: number | null,
    branch_num: number,
    prompt_input: string | null,
    layer_1_cast_id: number | null
): Promise<number | null> {
    // upload to user row
    const { data } = await supabaseClient.from('cast_datas').insert({
        name,
        farcaster_id,
        image_path,
        parent_id,
        branch_num,
        prompt_input,
        layer_1_cast_id
    }).select();

    if (!data || !data.length) {
        return null;
    }

    let createdCastId = data[0].id;
    return createdCastId;
}