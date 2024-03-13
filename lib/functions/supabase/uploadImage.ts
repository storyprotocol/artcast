import { supabaseClient } from "@/lib/client/supabase/supabaseClient";

export async function uploadImage(imagePath: string, blob: Blob) {
    console.log('uploading generated image to supabase')
    await supabaseClient
        .storage
        .from('artcast_images')
        .upload(imagePath, blob);
}