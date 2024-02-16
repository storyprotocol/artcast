'use server';
import { supabaseClient } from "../supabase/supabaseClient";

export async function getArtcastImage(imagePath: string): Promise<string> {
    const { data } = supabaseClient.storage.from('artcast_images').getPublicUrl(imagePath);
    return data.publicUrl;
};