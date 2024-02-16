'use server';
import { handleGenerateImage } from "../functions/handleGenerateImage";
import { storeCast } from "../supabase/functions/storeCast";

export async function saveArtCast(formData: FormData) {

    let name = formData.get('name') as string;
    let farcaster_id = formData.get('username') as string;
    let prompt = formData.get('prompt') as string;

    let createdArtcastId = await storeCast(name, farcaster_id, null, null, 0, prompt, null) as number;
    await handleGenerateImage(name, [prompt], createdArtcastId, farcaster_id);
    return createdArtcastId;
};