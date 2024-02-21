import { getArtcastImage } from '@/lib/actions/getArtcastImage';
import { supabaseClient } from '@/lib/supabase/supabaseClient';

export const runtime = 'edge';

export async function GET(request: Request, { params }: { params: { id: number } }) {
    let castCall = supabaseClient.from('cast_datas').select('*, layer_1_cast:layer_1_cast_id(locked), parent_cast:parent_id(farcaster_id)').eq('id', params.id);
    let countsCall = supabaseClient.from('cast_counts').select('*').eq('id', params.id);
    let [{ data }, { data: td }] = await Promise.all([castCall, countsCall]);

    if (!data || !data.length || !td || !td.length) {
        return Response.json({ error: 'No cast' }, {
            status: 400
        });
    }

    let ans = {
        ...data[0],
        num_derivatives: td[0].number_of_direct_children,
        num_total_derivatives: td[0].number_of_children
    }
    ans.locked = (ans.branch_num == 1 && ans.locked == true) || (ans.branch_num >= 2 && ans.layer_1_cast.locked == true);
    // let lpCall = supabaseClient.from('cast_datas').select('*').eq('parent_id', params.id).order('id', { ascending: false }).limit(10);
    let versionHistory = await supabaseClient.rpc('fetchbranch', { leaf_id: params.id });
    // let [{ data: latest_prompts }, { data: version_history }] = await Promise.all([lpCall, vhCall]);
    // ans['latest_prompts'] = latest_prompts;
    ans['version_history'] = versionHistory;
    // let { data: tree } = await supabaseClient.rpc('fetchtree', { starting_id: version_history[version_history.length - 1].id });
    // ans['tree'] = tree

    const castImage = await getArtcastImage(ans.image_path as string);
    return Response.json({ cast: ans, castImage }, {
        status: 200
    })
}
