import { AuthorLink } from "@/components/AuthorLink";
import { LatestPrompts } from "@/components/LatestPrompts";
import { RecentHistory } from "@/components/RecentHistory";
import { RemixBox } from "@/components/RemixBox";
import { TypographyH2, TypographyH3 } from "@/components/ui/typography";
import { generateImage } from "@/lib/actions/generateImage";
import ErrorFrame from "@/lib/components/frames/ErrorFrame";
import GeneratingFrame from "@/lib/components/frames/GeneratingFrame";
import RootFrame from "@/lib/components/frames/RootFrame";
import { fetchCast } from "@/lib/supabase/functions/fetchCast";
import { lockLayer } from "@/lib/supabase/functions/lockLayer";
import { storeCast } from "@/lib/supabase/functions/storeCast";
import { supabaseClient } from "@/lib/supabase/supabaseClient";
import { Cast } from "@/lib/types/cast.interface";
import { convertSupabaseDateToHumanReadable } from "@/lib/utils";
import { FrameContainer, FrameImage, FrameReducer, FrameButton, useFramesReducer, getPreviousFrame, NextServerPageProps, FrameInput } from "frames.js/next/server";

type Stage = 'start' | 'view' | 'generate' | 'created' | 'error';

type State = {
    stage: Stage;
    inputText: string;
    currentCastId: number;
    error?: string;
    userFid?: number;
};

const reducer: FrameReducer<State> = (state, action) => {
    // start
    if (state.stage == 'start') {
        return {
            stage: 'view',
            inputText: '',
            currentCastId: state.currentCastId
        }
    }

    // generate a new Artcast
    if (state.stage == 'view' && action.postBody?.untrustedData.buttonIndex == 2) {
        if (!action.postBody.untrustedData.inputText) {
            return {
                stage: 'error',
                inputText: '',
                error: 'You need to specify a prompt to continue.',
                currentCastId: state.currentCastId
            }
        }
        return {
            stage: 'generate',
            inputText: action.postBody.untrustedData.inputText,
            currentCastId: state.currentCastId,
            userFid: action.postBody.untrustedData.fid
        }
    }

    if (state.stage == 'created') {
        return {
            stage: 'created',
            inputText: '',
            currentCastId: state.currentCastId
        }
    }

    if (state.stage == 'generate') {
        return {
            stage: 'created',
            inputText: '',
            currentCastId: state.currentCastId
        }
    }

    if (state.stage == 'error') {
        return {
            stage: 'view',
            inputText: '',
            currentCastId: state.currentCastId
        }
    }

    return {
        stage: 'view',
        inputText: '',
        currentCastId: state.currentCastId
    }
}

export default async function Home({ params, searchParams }: NextServerPageProps) {
    const previousFrame = getPreviousFrame<State>(searchParams);

    //@ts-ignore
    let pathname = `/cast/${params.id}`;
    //@ts-ignore
    const [state, dispatch] = useFramesReducer<State>(reducer, { currentCastId: params.id, stage: 'start', inputText: '' }, previousFrame);

    if (state.stage == 'error') {
        return (
            <div className="p-4">
                :D YAAAAY
                {/* <RootFrame imageSrc={data.publicUrl} castInfo={cast} /> */}
                <FrameContainer
                    pathname={pathname}
                    postUrl="/frames"
                    state={state}
                    previousFrame={previousFrame}
                >
                    <FrameImage>
                        <ErrorFrame error={state.error as string} />
                    </FrameImage>
                    <FrameButton>Retry</FrameButton>
                </FrameContainer>
            </div>
        )
    }

    //@ts-ignore
    const cast = await fetchCast(state.currentCastId, state.stage);
    if (!cast) {
        throw new Error('Could not find Cast.')
    }
    const { data } = supabaseClient.storage.from('artcast_images').getPublicUrl(cast.image_path as string);

    if (state.stage == 'generate') {
        const response = await fetch(`https://fnames.farcaster.xyz/transfers?fid=${state.userFid}`);
        const result = await response.json();
        const farcaster_name = result.transfers[0].username;
        let newBranchNum = cast.branch_num + 1
        //@ts-ignore
        let newCastInfo: Cast = {
            name: cast.name,
            farcaster_id: farcaster_name,
            image_path: null,
            branch_num: newBranchNum,
            num_derivatives: 0,
            num_total_derivatives: 0,
            parent_id: state.currentCastId,
            prompt_input: state.inputText,
            // will get replaced
            id: 0,
            layer_1_cast_id: newBranchNum == 2 ? cast.id : newBranchNum > 2 ? cast.layer_1_cast_id : null,
            layer_1_cast: { locked: false },
            locked: false
        }
        const createdArtcastId = await storeCast(
            newCastInfo.name,
            newCastInfo.farcaster_id,
            newCastInfo.image_path,
            newCastInfo.parent_id,
            newCastInfo.branch_num,
            newCastInfo.prompt_input,
            newCastInfo.layer_1_cast_id
        );
        generateImage(cast.name, cast.image_path as string, state.inputText, createdArtcastId as number);
        state.currentCastId = createdArtcastId as number;
        newCastInfo.id = createdArtcastId as number;
        if (newCastInfo.branch_num == 10) {
            lockLayer(newCastInfo.layer_1_cast_id as number);
        }

        return (
            <div className="p-4">
                generating
                {/* <RootFrame imageSrc={data.publicUrl} castInfo={cast} /> */}
                <FrameContainer
                    pathname={pathname}
                    postUrl="/frames"
                    state={state}
                    previousFrame={previousFrame}
                >
                    {/* <FrameImage src={data.publicUrl} /> */}
                    <FrameImage>
                        <GeneratingFrame />
                    </FrameImage>
                    <FrameButton>Refresh</FrameButton>
                </FrameContainer>
            </div>
        )
    }

    if (state.stage == 'view') {
        return (
            <div className="flex min-h-screen flex-col items-center gap-3 p-24">
                <RootFrame imageSrc={data.publicUrl} castInfo={cast} type={cast.branch_num == 0 ? 'root' : 'derivative'} /> :
                <FrameContainer
                    pathname={pathname}
                    postUrl="/frames"
                    state={state}
                    previousFrame={previousFrame}
                >
                    <FrameImage>
                        <RootFrame imageSrc={data.publicUrl} castInfo={cast} type={cast.branch_num == 0 ? 'root' : 'derivative'} /> :
                    </FrameImage>
                    {!cast.locked ? <FrameInput text="add a prompt..." /> : null}
                    <FrameButton action="link" target={`${process.env.NEXT_PUBLIC_BASE_URL}/cast/${cast.id}`}>Stats</FrameButton>
                    {!cast.locked ? <FrameButton>Create</FrameButton> : null}
                </FrameContainer>
            </div>
        )
    }

    if (state.stage === 'created') {
        if (cast.image_path) {
            return (
                <div className="p-4">
                    :D YAAAAY
                    {/* <RootFrame imageSrc={data.publicUrl} castInfo={cast} /> */}
                    <FrameContainer
                        pathname={`/cast/${cast.id}`}
                        postUrl="/frames"
                        state={state}
                        previousFrame={previousFrame}
                    >
                        {/* <FrameImage src={data.publicUrl} /> */}
                        <FrameImage>
                            <RootFrame imageSrc={data.publicUrl} castInfo={cast} type='created' />
                        </FrameImage>
                        <FrameButton action="link" target={`${process.env.NEXT_PUBLIC_BASE_URL}/cast/${cast.id}`}>Share as a cast to keep alive.</FrameButton>
                    </FrameContainer>
                </div>
            )
        } else {
            return (
                <div className="p-4">
                    generating
                    {/* <RootFrame imageSrc={data.publicUrl} castInfo={cast} /> */}
                    <FrameContainer
                        pathname={pathname}
                        postUrl="/frames"
                        state={state}
                        previousFrame={previousFrame}
                    >
                        {/* <FrameImage src={data.publicUrl} /> */}
                        <FrameImage>
                            <GeneratingFrame />
                        </FrameImage>
                        <FrameButton>Refresh</FrameButton>
                    </FrameContainer>
                </div>
            )
        }
    }

    if (state.stage == 'start') {
        return (
            <div className="p-4">
                <div className="p-8 pt-6 flex-1">
                    <TypographyH2>Dashboard</TypographyH2>
                    <div className="mt-6">
                        <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 space-y-4">
                            <div className="flex gap-8 items-center">
                                <img className="w-[25%] max-w-[300px] h-auto rounded-md" src={data.publicUrl} alt="cast" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Artcast #{cast.id} by <AuthorLink farcasterId={cast.farcaster_id} /></p>
                                    <TypographyH3>{cast.name}</TypographyH3>
                                    <p className="text-sm text-muted-foreground">Created on {convertSupabaseDateToHumanReadable(cast.created_at)}</p>
                                    <p className="text-sm text-muted-foreground flex gap-1 items-center">Registered on <img src="/story-protocol.png" alt="story protocol logo" className="h-[10px]" /></p>
                                </div>
                            </div>
                            <div className="grid gap-4 md:grd-cols-2 lg:grid-cols-4">
                                <div className="rounded-xl border bg-card text-card-foreground shadow">
                                    <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                                        <h3 className="tracking-tight text-sm font-medium">Latest Prompt</h3>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-4 w-4 text-muted-foreground">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                        </svg>
                                    </div>
                                    <div className="p-6 pt-0">
                                        <div className="text-2xl font-bold">{cast.latest_prompts.length ? cast.latest_prompts[0].prompt_input : 'None!'}</div>
                                    </div>
                                </div>
                                <div className="rounded-xl border bg-card text-card-foreground shadow">
                                    <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                                        <h3 className="tracking-tight text-sm font-medium">Total Remixes</h3>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-4 w-4 text-muted-foreground">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
                                        </svg>
                                    </div>
                                    <div className="p-6 pt-0">
                                        <div className="text-2xl font-bold">{cast.num_total_derivatives}</div>
                                    </div>
                                </div>
                                <div className="rounded-xl border bg-card text-card-foreground shadow">
                                    <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                                        <h3 className="tracking-tight text-sm font-medium">Direct Remixes</h3>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-4 w-4 text-muted-foreground">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                        </svg>
                                    </div>
                                    <div className="p-6 pt-0">
                                        <div className="text-2xl font-bold">{cast.num_derivatives}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                                <RecentHistory versions={cast.version_history}></RecentHistory>
                                <LatestPrompts versions={cast.latest_prompts}></LatestPrompts>
                            </div>
                            <RemixBox cast={cast} />
                        </div>
                    </div>
                </div>
                <FrameContainer
                    pathname={pathname}
                    postUrl="/frames"
                    state={state}
                    previousFrame={previousFrame}
                >
                    {/* <FrameImage src={data.publicUrl} /> */}
                    <FrameImage>
                        <RootFrame imageSrc={data.publicUrl} castInfo={cast} type='start' />
                    </FrameImage>
                    <FrameButton>Join</FrameButton>
                </FrameContainer>
            </div>
        )
    }
}