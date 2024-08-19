import { Cast } from "@/lib/types/cast.interface";
import { RegisteredOnStory } from "./atoms/RegisteredOnStory";
import { convertSupabaseDateToHumanReadable } from "@/lib/utils/convertSupabaseDateToHumanReadable";
import { getIpfsImage } from "@/lib/utils/getIpfsImage";

function Version({
  cast,
  latest,
}: {
  cast: Cast;
  index: number;
  latest: boolean;
}) {
  return (
    <li className="mb-10 ms-6">
      <span className="absolute flex items-center justify-center w-6 h-6 bg-yellow-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-yellow-900 text-sm">
        {cast.branch_num}
      </span>
      <a href={`/cast/${cast.id}`}>
        <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
          {cast.branch_num == 0 ? (
            <span className="italic">
              "{cast.prompt_input ? cast.prompt_input : "Original Artcast"}"
            </span>
          ) : (
            <span className="italic">"{cast.prompt_input}"</span>
          )}
          {latest ? (
            <span className="bg-yellow-100 text-yellow-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300 ms-3">
              Current
            </span>
          ) : null}
        </h3>
      </a>
      <p className="block text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
        by {cast.wallet_address}{" "}
        <time className="text-xs font-normal leading-none text-gray-400 dark:text-gray-500">
          on {convertSupabaseDateToHumanReadable(cast.created_at)}
        </time>{" "}
      </p>
      {cast.ip_id ? (
        <RegisteredOnStory
          storyExplorerUrl={`https://explorer.story.foundation/ipa/${cast.ip_id}`}
        />
      ) : null}
      <div className="flex items-center gap-5 mt-2">
        <img
          className="w-[25%] max-w-[200px] h-auto rounded-md"
          src={getIpfsImage(cast.image_path as string)}
          alt={`cast ${cast.name}`}
        />
        {!latest ? (
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
        ) : null}
      </div>
    </li>
  );
}

export function RecentHistory({ versions }: { versions: Cast[] }) {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
      <div className="flex flex-col space-y-1.5 mb-5">
        <h3 className="font-semibold leading-none tracking-tight">
          This Artcast's Storyline
        </h3>
        <p className="text-sm text-muted-foreground">
          Below are all the direct remixes of this Artcast up to this point.
        </p>
      </div>
      <ol className="relative border-s border-gray-200 dark:border-gray-700">
        {versions.map((version, index) => (
          <Version
            key={index}
            index={index}
            cast={version}
            latest={index == versions.length - 1}
          ></Version>
        ))}
      </ol>
    </div>
  );
}
