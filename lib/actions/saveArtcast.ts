// @ts-nocheck
'use server';
import { storeCast } from "../supabase/functions/storeCast";
import { supabaseClient } from "../supabase/supabaseClient";
import { getSupabaseImagePath } from "../utils";
import sharp from 'sharp';

export async function saveArtCast(formData: FormData) {

    let name = formData.get('name');
    let farcaster_id = formData.get('username');
    let image = formData.get('image');

    // Read the contents of the image file
    const imageBuffer = await image.arrayBuffer();

    // Resize the image to 1024x1024 using sharp
    const resizedImageBuffer = await sharp(imageBuffer)
        .resize(1024, 1024)
        .toBuffer();

    let createdArtcastId = await storeCast(name, farcaster_id, null, undefined, 0, undefined, undefined);
    let image_path = getSupabaseImagePath(name, createdArtcastId);
    await supabaseClient.from('cast_datas').update({
        image_path
    }).eq('id', createdArtcastId);

    // Upload the resized image to storage
    await supabaseClient
        .storage
        .from('artcast_images')
        .upload(image_path, resizedImageBuffer, {
            contentType: image.type, // Change the content type as needed
        });

    return createdArtcastId;
};