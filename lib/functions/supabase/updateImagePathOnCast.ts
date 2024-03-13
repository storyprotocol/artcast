import { supabaseClient } from "@/lib/client/supabase/supabaseClient";

export async function updateImagePathOnCast(imagePath: string, castId: number) {
    await supabaseClient.from('cast_datas').update({
        image_path: imagePath
    }).eq('id', castId)
}