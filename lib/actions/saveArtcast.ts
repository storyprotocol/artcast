'use server';
import { storeCast } from "../supabase/functions/storeCast";
import { supabaseClient } from "../supabase/supabaseClient";
import { getSupabaseImagePath } from "../utils";
import sharp from 'sharp';
import { registerOnStory } from "./registerOnStory";
import { generateImage } from "./generateImage";

export async function saveArtCast(formData: FormData) {

    let name = formData.get('name') as string;
    let farcaster_id = formData.get('username') as string;
    let prompt = formData.get('prompt') as string;

    let createdArtcastId = await storeCast(name, farcaster_id, null, null, 0, prompt, null) as number;
    await generateImage(name, [prompt], createdArtcastId, farcaster_id);

    // let image_path = getSupabaseImagePath(name, createdArtcastId);
    // const { data: publicUrlData } = supabaseClient.storage.from('artcast_images').getPublicUrl(image_path);
    // await registerOnStory(farcaster_id, name, prompt, createdArtcastId, publicUrlData.publicUrl);
    return createdArtcastId;
};