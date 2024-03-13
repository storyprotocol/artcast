import Link from "next/link";
import { Button } from "../ui/button";

export function AuthorLink({ farcasterId }: { farcasterId: string }) {
    return (
        <Button asChild variant={'link'} className="p-0 m-0">
            <Link style={{ height: 0 }} href={`https://warpcast.com/${farcasterId}`} target="_blank">@{farcasterId}</Link>
        </Button>
    )
}