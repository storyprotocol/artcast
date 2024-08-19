import { fetchLatestCasts } from "@/lib/functions/supabase/fetchLatestCasts";
import { getIpfsImage } from "@/lib/utils/getIpfsImage";
import { TypographyH2, TypographyH3 } from "./ui/typography";
import { convertSupabaseDateToShortHumanReadable } from "@/lib/utils/convertSupabaseDateToHumanReadable";
import { RegisteredOnStory } from "./atoms/RegisteredOnStory";
import { useEffect, useState } from "react";
import { Cast } from "@/lib/types/cast.interface";
import { Skeleton } from "./ui/skeleton";

export default function HomepageList() {
  const [loading, setLoading] = useState(true);
  const [casts, setCasts] = useState<Cast[]>([]);

  async function getLatestCasts() {
    setLoading(true);
    let x = ((await fetchLatestCasts()) || []).filter((y) => !!y.image_path);
    setCasts(x);
    setLoading(false);
  }

  useEffect(() => {
    getLatestCasts();
  }, []);

  return (
    <div>
      <div className="m-[25px]">
        <TypographyH2>Recent Casts</TypographyH2>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 m-[25px]">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-4">
              <Skeleton className="h-16 w-16" />
              <div className="space-y-2">
                <Skeleton className="h-10 w-[450px]" />
                <Skeleton className="h-10 w-[400px]" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 m-[25px]">
          {casts?.map((cast) => (
            <div key={cast.id} className="flex gap-8 items-center mb-[25px]">
              <img
                className="w-[25%] max-w-[300px] h-auto rounded-md"
                src={getIpfsImage(cast.image_path as string)}
                alt="cast"
              />
              <div>
                <div className="flex items-center gap-[10px]">
                  <TypographyH3>{cast.name}</TypographyH3>
                  <span className="flex items-center justify-center w-6 h-6 bg-yellow-100 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-yellow-900 text-sm">
                    {cast.branch_num}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Artcast #{cast.id}
                  <span className="hidden md:block">
                    {" "}
                    by {cast.wallet_address}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Created on{" "}
                  {convertSupabaseDateToShortHumanReadable(cast.created_at)}
                </p>
                {cast.using_ai ? (
                  <p className="text-sm text-muted-foreground">
                    Generated using{" "}
                    <span className="text-[#988cfc]">Stability AI</span>.
                  </p>
                ) : null}
                {cast.ip_id ? (
                  <RegisteredOnStory
                    storyExplorerUrl={`https://explorer.story.foundation/ipa/${cast.ip_id}`}
                  />
                ) : null}

                <br />

                <a
                  target="_blank"
                  href={`/cast/${cast.id}`}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-200 focus:text-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-3.5 h-3.5 me-2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                    />
                  </svg>
                  Continue from here
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
