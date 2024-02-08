import { supabaseClient } from "../supabaseClient";

export async function storeCast(
    name: string,
    farcaster_id: string,
    image_path: string,
    parent_id: number | null,
    branch_num: number,
    prompt_input: string | null
): Promise<number | null> {
    // upload to user row
    const { data } = await supabaseClient.from('cast_datas').insert({
        name,
        farcaster_id,
        image_path,
        parent_id,
        branch_num,
        prompt_input
    }).select();

    if (!data || !data.length) {
        return null;
    }

    return data[0].id;
}