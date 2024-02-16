import { getArtcastImage } from '@/lib/actions/getArtcastImage';
import { fetchCast } from '@/lib/supabase/functions/fetchCast';

export async function GET(request: Request, { params }: { params: { id: number } }) {
    const cast = await fetchCast(params.id, 'start');
    if (!cast) {
        return Response.json({ error: true })
    }
    const castImage = await getArtcastImage(cast.image_path as string);
    return Response.json({ cast, castImage })
}
