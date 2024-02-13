import { supabaseClient } from "@/lib/supabase/supabaseClient";
import { Cast } from "@/lib/types/cast.interface"
import { convertSupabaseDateToHumanReadable } from "@/lib/utils";
import { ShareButton } from "./ShareButton";
import { AuthorLink } from "./AuthorLink";

async function Version({ cast, index }: { cast: Cast, index: number }) {

    async function getPublicUrl(image_path: string) {
        const { data } = supabaseClient.storage.from('artcast_images').getPublicUrl(image_path as string);
        return data.publicUrl;
    }

    let url = await getPublicUrl(cast.image_path as string)
    console.log(index);

    return (
        <li className="mb-10 ms-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-yellow-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-yellow-900 text-sm">
                {cast.branch_num}
            </span>
            <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                {cast.branch_num == 0 ? <span className="">Original Artcast</span> : <span className="italic">"{cast.prompt_input}"</span>}
                {index == 0
                    ? <span className="bg-yellow-100 text-yellow-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300 ms-3">Latest</span>
                    : null
                }
            </h3>
            <time className="block text-sm mb-1 font-normal leading-none text-gray-400 dark:text-gray-500">Created on {convertSupabaseDateToHumanReadable(cast.created_at)}</time>
            <p className="block text-sm mb-4 font-normal leading-none text-gray-400 dark:text-gray-500">by <AuthorLink farcasterId={cast.farcaster_id} /></p>
            <div className="flex items-center gap-5">
                <img className="w-[25%] max-w-[200px] h-auto rounded-full" src={url} alt={`cast ${cast.name}`} />
                {index == 0 ?
                    <ShareButton castId={cast.id}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-3.5 h-3.5 me-2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                        </svg>Share
                    </ShareButton>
                    : null
                }
            </div>
        </li>
    )
}

export function RecentHistory({ versions }: { versions: Cast[] }) {
    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow p-10">
            <div className="flex flex-col space-y-1.5 mb-5">
                <h3 className="font-semibold leading-none tracking-tight">Timeline (this branch)</h3>
                <p className="text-sm text-muted-foreground">Below are all the versions of this Artcast up to this point.</p>
            </div>
            <ol className="relative border-s border-gray-200 dark:border-gray-700">
                {versions.map((version, index) => <Version key={index} index={index} cast={version}></Version>)}
            </ol>
        </div>
    )
}