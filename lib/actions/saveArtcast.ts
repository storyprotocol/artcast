// @ts-nocheck
'use server';
import { storeCast } from "../supabase/functions/storeCast";
import { supabaseClient } from "../supabase/supabaseClient";
import { getSupabaseImagePath } from "../utils";

export async function saveArtCast(formData: FormData) {

    let name = formData.get('name');
    let farcaster_id = formData.get('username');
    let image = formData.get('image')

    let createdArtcastId = await storeCast(name, farcaster_id, null, undefined, 0, undefined, undefined);
    let image_path = getSupabaseImagePath(name, createdArtcastId);
    await supabaseClient.from('cast_datas').update({
        image_path
    }).eq('id', createdArtcastId);

    // upload the image to storage
    const { data } = await supabaseClient
        .storage
        .from('artcast_images')
        .upload(image_path, image);

    return createdArtcastId;
};