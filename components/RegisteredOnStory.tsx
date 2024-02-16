import Link from "next/link";
import { Button } from "./ui/button";

export async function RegisteredOnStory({ storyExplorerUrl }: { storyExplorerUrl: string | null }) {
    if (!storyExplorerUrl) {
        return (
            <p className="text-[8px] text-muted-foreground inline-flex gap-1 items-center border py-1 px-2 rounded my-2">Registered on <br /><img src="/story-protocol.png" alt="story protocol logo" className="h-[8px]" /></p>
        )
    }
    return (
        <Button asChild variant={'link'} className="p-0 m-0">
            <Link style={{ height: 0 }} href={storyExplorerUrl} target="_blank">
                <p className="text-[8px] text-muted-foreground inline-flex gap-1 items-center border py-1 px-2 rounded my-2">Registered on <img src="/story-protocol.png" alt="story protocol logo" className="h-[8px]" /></p>
            </Link>
        </Button>
    )
}