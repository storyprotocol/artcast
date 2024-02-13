// @ts-nocheck
'use server';
import { storeCast } from "../supabase/functions/storeCast";
import { supabaseClient } from "../supabase/supabaseClient";

export async function saveArtCast(formData: FormData) {

    let name = formData.get('name');
    let farcaster_id = formData.get('username');
    let image = formData.get('image')

    let image_path = "id" + Math.random().toString(16).slice(2) + '/' + image.name;

    // upload the image to storage
    const { data } = await supabaseClient
        .storage
        .from('artcast_images')
        .upload(image_path, image);

    return storeCast(name, farcaster_id, image_path, undefined, 0, undefined, undefined);
};