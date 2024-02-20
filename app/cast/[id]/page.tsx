//@ts-nocheck
import CastPage from "@/components/CastPage";
import { getArtcastImage } from "@/lib/actions/getArtcastImage";
import ErrorFrame from "@/lib/components/frames/ErrorFrame";
import GeneratingFrame from "@/lib/components/frames/GeneratingFrame";
import RootFrame from "@/lib/components/frames/RootFrame";
import TestFrame from "@/lib/components/frames/TestFrame";
import { handleFetchCast } from "@/lib/functions/handleFetchCast";
import { handleGenerateImage } from "@/lib/functions/handleGenerateImage";
import { fetchCast } from "@/lib/supabase/functions/fetchCast";
import { lockLayer } from "@/lib/supabase/functions/lockLayer";
import { storeCast } from "@/lib/supabase/functions/storeCast";
import { Cast } from "@/lib/types/cast.interface";
import { FrameContainer, FrameImage, FrameReducer, FrameButton, useFramesReducer, getPreviousFrame, FrameInput } from "frames.js/next/server";
import React from "react";

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

export default async function Home({ params, searchParams, children }: any) {
    const previousFrame = getPreviousFrame<State>(searchParams);

    //@ts-ignore
    let pathname = `/cast/${params.id}`;
    //@ts-ignore
    const [state, dispatch] = useFramesReducer<State>(reducer, { currentCastId: params.id, stage: 'start', inputText: '' }, previousFrame);

    console.log(state)
    if (state.stage == 'error') {
        return (
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
        )
    }

    //@ts-ignore
    const { cast, castImage }: { cast: Cast, castImage: string } = await handleFetchCast(params.id);

    // if (state.stage == 'start') {
    return (
        <div>
            <FrameContainer
                pathname={pathname}
                postUrl={'/frames'}
                state={state}
                previousFrame={previousFrame}
            >
                {/* <FrameImage src={data.publicUrl} /> */}
                <FrameImage>
                    {/* <RootFrame imageSrc={castImage} castInfo={cast} type='start' /> */}
                    <TestFrame castId={params.id} castImage={castImage} />
                    {/* <div style={{ display: 'flex' }}>Hello there test. Cast #{params.id}</div> */}
                </FrameImage>
                <FrameButton>Join</FrameButton>
            </FrameContainer>
            {/* <CastPage castId={params.id} /> */}
        </div>
    )
    // }

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
        //@ts
        let pastPrompts: string[] = cast.version_history.map(ele => ele.prompt_input as string).filter(ele => !!ele).concat(state.inputText);
        handleGenerateImage(cast.name, pastPrompts, createdArtcastId as number, farcaster_name);
        state.currentCastId = createdArtcastId as number;
        newCastInfo.id = createdArtcastId as number;
        if (newCastInfo.branch_num == 10) {
            lockLayer(newCastInfo.layer_1_cast_id as number);
        }

        return (
            <FrameContainer
                pathname={pathname}
                postUrl="/frames"
                state={state}
                previousFrame={previousFrame}
            >
                <FrameImage>
                    <GeneratingFrame castId={cast.id} />
                </FrameImage>
                <FrameButton>Refresh</FrameButton>
            </FrameContainer>
        )
    }

    if (state.stage == 'view') {
        return (
            <FrameContainer
                pathname={pathname}
                postUrl="/frames"
                state={state}
                previousFrame={previousFrame}
            >
                <FrameImage>
                    <RootFrame imageSrc={castImage} castInfo={cast} type={cast.branch_num == 0 ? 'root' : 'derivative'} /> :
                </FrameImage>
                {!cast.locked ? <FrameInput text="add an additional prompt..." /> : null}
                <FrameButton action="link" target={`${process.env.NEXT_PUBLIC_BASE_URL}/cast/${cast.id}`}>Stats</FrameButton>
                {!cast.locked ? <FrameButton>Create</FrameButton> : null}
            </FrameContainer>
        )
    }

    if (state.stage === 'created') {
        if (cast.image_path) {
            return (
                <FrameContainer
                    pathname={`/cast/${cast.id}`}
                    postUrl="/frames"
                    state={state}
                    previousFrame={previousFrame}
                >
                    <FrameImage>
                        <RootFrame imageSrc={castImage} castInfo={cast} type='created' />
                    </FrameImage>
                    <FrameButton action="link" target={`${process.env.NEXT_PUBLIC_BASE_URL}/cast/${cast.id}`}>Share as a cast to continue the story.</FrameButton>
                </FrameContainer>
            )
        } else {
            return (
                <FrameContainer
                    pathname={pathname}
                    postUrl="/frames"
                    state={state}
                    previousFrame={previousFrame}
                >
                    <FrameImage>
                        <GeneratingFrame castId={cast.parent_id as number} />
                    </FrameImage>
                    <FrameButton>Refresh</FrameButton>
                </FrameContainer>
            )
        }
    }
}