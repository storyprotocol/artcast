'use server';
import { storeCast } from "../supabase/functions/storeCast";
import { supabaseClient } from "../supabase/supabaseClient";
import { getSupabaseImagePath } from "../utils";
import sharp from 'sharp';
import { registerOnStory } from "./registerOnStory";

export async function saveArtCast(formData: FormData) {

    let name = formData.get('name') as string;
    let farcaster_id = formData.get('username') as string;
    let image = formData.get('image');

    // Read the contents of the image file
    //@ts-ignore
    const imageBuffer = await image.arrayBuffer();

    // Resize the image to 1024x1024 using sharp
    const resizedImageBuffer = await sharp(imageBuffer)
        .resize(1024, 1024)
        .toFormat('jpeg') // You can choose the desired format (jpeg, png, webp, etc.)
        .jpeg({ quality: 10 }) // Adjust the quality value as needed (between 0 and 100)
        .toBuffer();

    let createdArtcastId = await storeCast(name, farcaster_id, null, null, 0, null, null) as number;
    //@ts-ignore
    let image_path = getSupabaseImagePath(name, createdArtcastId);
    await supabaseClient.from('cast_datas').update({
        image_path
    }).eq('id', createdArtcastId);

    // Upload the resized image to storage
    await supabaseClient
        .storage
        .from('artcast_images')
        .upload(image_path, resizedImageBuffer, {
            contentType: 'image/jpeg', // Change the content type as needed
        });

    const { data: publicUrlData } = supabaseClient.storage.from('artcast_images').getPublicUrl(image_path);

    await registerOnStory(farcaster_id, name, null, createdArtcastId, publicUrlData.publicUrl);
    return createdArtcastId;
};