import { supabaseClient } from "@/lib/supabase/supabaseClient";
import { Cast } from "@/lib/types/cast.interface"
import { convertSupabaseDateToHumanReadable } from "@/lib/utils";
import { ShareButton } from "./ShareButton";
import { AuthorLink } from "./AuthorLink";
import { RegisteredOnStory } from "./RegisteredOnStory";

async function Version({ cast, index, latest }: { cast: Cast, index: number, latest: boolean }) {

    async function getPublicUrl(image_path: string) {
        const { data } = supabaseClient.storage.from('artcast_images').getPublicUrl(image_path as string);
        return data.publicUrl;
    }

    let url = await getPublicUrl(cast.image_path as string)

    return (
        <li className="mb-10 ms-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-yellow-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-yellow-900 text-sm">
                {cast.branch_num}
            </span>
            <a href={`/cast/${cast.id}`}><h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                {cast.branch_num == 0 ? <span className="">{cast.prompt_input ? cast.prompt_input : "Original Artcast"}</span> : <span className="italic">"{cast.prompt_input}"</span>}
                {latest
                    ? <span className="bg-yellow-100 text-yellow-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300 ms-3">Current</span>
                    : null
                }
            </h3></a>
            <p className="block text-sm font-normal leading-none text-gray-400 dark:text-gray-500">by <AuthorLink farcasterId={cast.farcaster_id} /> <time className="text-xs font-normal leading-none text-gray-400 dark:text-gray-500">on {convertSupabaseDateToHumanReadable(cast.created_at)}</time> </p>
            <RegisteredOnStory storyExplorerUrl={cast.story_explorer_url} />
            <div className="flex items-center gap-5">
                <img className="w-[25%] max-w-[200px] h-auto rounded-md" src={url} alt={`cast ${cast.name}`} />
                {
                    <ShareButton castId={cast.id}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3.5 h-3.5 me-2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                        </svg>Continue from here
                    </ShareButton>
                }
            </div>
        </li>
    )
}

export function RecentHistory({ versions }: { versions: Cast[] }) {
    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
            <div className="flex flex-col space-y-1.5 mb-5">
                <h3 className="font-semibold leading-none tracking-tight">This Artcast's Storyline</h3>
                <p className="text-sm text-muted-foreground">Below are all the direct remixes of this Artcast up to this point.</p>
            </div>
            <ol className="relative border-s border-gray-200 dark:border-gray-700">
                {versions.reverse().map((version, index) => <Version key={index} index={index} cast={version} latest={index == versions.length - 1}></Version>)}
            </ol>
        </div>
    )
}