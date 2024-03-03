import { registerDerivativeIP } from "@/lib/story-beta/functions/registerDeriviativeIP";
import { supabaseClient } from "@/lib/supabase/supabaseClient";

export const revalidate = 0
export const maxDuration = 120;

export async function GET() {
    console.log('initiating cron job')
    const { data, error } = await supabaseClient.from('cast_datas')
        .select('*')
        .not('nft_token_id', 'is', null)
        .not('license_id', 'is', null)
        .is('ip_id', null)
        .not('parent_id', 'is', null)
        .eq('version', 'beta');

    if (!data || !data.length) {
        return Response.json({})
    }

    for (let i = 0; i < data.length; i++) {
        try {
            const derivativeIpId = await registerDerivativeIP(data[i].nft_token_id, data[i].license_id);
            const { error } = await supabaseClient.from('cast_datas').update({
                ip_id: derivativeIpId
            }).eq('id', data[i].id)
            console.log('Error updating a derivative with its ipId:', error)
            // only 1 at a time so far
            break;
        } catch (e) {
            console.log(e);
        }
    }

    return Response.json({});
}