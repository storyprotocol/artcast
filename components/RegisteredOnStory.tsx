import Link from "next/link";
import { Button } from "./ui/button";

export async function RegisteredOnStory({ storyExplorerUrl }: { storyExplorerUrl: string | null }) {
    if (!storyExplorerUrl) {
        return (
            <p className="text-sm text-muted-foreground flex gap-1 items-center">Registered on <img src="/story-protocol.png" alt="story protocol logo" className="h-[10px]" /></p>
        )
    }
    return (
        <Button asChild variant={'link'} className="p-0 m-0">
            <Link style={{ height: 0 }} href={storyExplorerUrl} target="_blank">
                <p className="block text-sm mb-4 font-normal leading-none text-gray-400 dark:text-gray-500 flex gap-1 items-center">Registered on <img src="/story-protocol.png" alt="story protocol logo" className="h-[10px]" /></p>
            </Link>
        </Button>
    )
}