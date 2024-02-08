// @ts-nocheck
'use server';
import { supabaseClient } from "../supabase/supabaseClient";

export async function saveArtCast(formData: FormData) {

    const rawFormData = {
        name: formData.get('name'),
        farcasterId: formData.get('farcaster_id'),
        image: formData.get('image')
    }

    const imagePath = "id" + Math.random().toString(16).slice(2) + '/' + rawFormData.image.name;

    // upload the image to storage
    const { data: imgUploadData } = await supabaseClient
        .storage
        .from('artcast_images')
        .upload(imagePath, rawFormData.image);

    // upload to user row
    const { data: artcastUploadData } = await supabaseClient.from('cast_datas').insert({
        name: rawFormData.name,
        farcaster_id: rawFormData.farcasterId,
        image_path: imagePath,
    }).select();

    return artcastUploadData[0].id;
};