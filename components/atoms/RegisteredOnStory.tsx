import Link from "next/link";
import { Button } from "../ui/button";

export function RegisteredOnStory({
  storyExplorerUrl,
}: {
  storyExplorerUrl: string;
}) {
  return (
    <Button asChild variant={"link"} className="p-0 m-0">
      <Link
        className="p-0 m-0"
        style={{ lineHeight: "inherit", textDecoration: "none" }}
        href={storyExplorerUrl}
        target="_blank"
      >
        <p className="text-[10px] text-muted-foreground inline-flex gap-1 items-center border py-1 px-2 rounded">
          Registered on{" "}
          <img src="/story.svg" alt="story protocol logo" className="h-[8px]" />
        </p>
      </Link>
    </Button>
  );
}
