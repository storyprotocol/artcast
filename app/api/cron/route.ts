import { registerDerivativeIP } from "@/lib/story-beta/functions/registerDeriviativeIP";
import { supabaseClient } from "@/lib/supabase/supabaseClient";

export const revalidate = 0

export async function GET() {
    console.log('initiating cron job')
    const { data, error } = await supabaseClient.from('cast_datas')
        .select('*')
        .neq('nft_token_id', null)
        .neq('license_id', null)
        .eq('ip_id', null)
        .not('parent_id', 'is', null)
        .eq('version', 'beta');

    console.log('after fetch...')

    console.log({ error, data })

    if (!data || !data.length) {
        return Response.json({})
    }

    for (let i = 0; i < data.length; i++) {
        const derivativeIpId = await registerDerivativeIP(data[i].nft_token_id, data[i].license_id);
        const { error } = await supabaseClient.from('cast_datas').update({
            ip_id: derivativeIpId
        }).eq('id', data[i].id)
        console.log('Error updating a derivative with its ipId:', error)
    }

    return Response.json({});
}