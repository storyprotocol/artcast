import { publicSupabaseClient } from "../../client/supabase/publicSupabaseClient";

export function getArtcastImage(imagePath: string): string {
    const { data } = publicSupabaseClient.storage.from('artcast_images').getPublicUrl(imagePath);
    return data.publicUrl;
};