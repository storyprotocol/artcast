
import { generateImage } from "@/lib/actions/generateImage";
import CreatedFrame from "@/lib/components/frames/CreatedFrame";
import DerivativeFrame from "@/lib/components/frames/DerivativeFrame";
import ErrorFrame from "@/lib/components/frames/ErrorFrame";
import GeneratingFrame from "@/lib/components/frames/GeneratingFrame";
import RootFrame from "@/lib/components/frames/RootFrame";
import StartFrame from "@/lib/components/frames/StartFrame";
import { fetchCast } from "@/lib/supabase/functions/fetchCast";
import { lockLayer } from "@/lib/supabase/functions/lockLayer";
import { storeCast } from "@/lib/supabase/functions/storeCast";
import { supabaseClient } from "@/lib/supabase/supabaseClient";
import { Cast } from "@/lib/types/cast.interface";
import { FrameContainer, FrameImage, FrameReducer, FrameButton, useFramesReducer, getPreviousFrame, NextServerPageProps, FrameInput } from "frames.js/next/server";

type Stage = 'start' | 'view' | 'generate' | 'created' | 'error';

type State = {
    stage: Stage;
    total_button_presses: number;
    input_text: string;
    currentCastId: number;
    error?: string;
};

const reducer: FrameReducer<State> = (state, action) => {
    // start
    if (state.stage == 'start') {
        return {
            stage: 'view',
            total_button_presses: state.total_button_presses + 1,
            input_text: '',
            currentCastId: state.currentCastId
        }
    }

    // generate a new Artcast
    if (state.stage == 'view' && action.postBody?.untrustedData.buttonIndex == 2) {
        if (!action.postBody.untrustedData.inputText) {
            return {
                stage: 'error',
                total_button_presses: state.total_button_presses + 1,
                input_text: '',
                error: 'You need to specify a prompt to continue.',
                currentCastId: state.currentCastId
            }
        }
        return {
            stage: 'generate',
            total_button_presses: state.total_button_presses + 1,
            input_text: action.postBody.untrustedData.inputText,
            currentCastId: state.currentCastId
        }
    }

    if (state.stage == 'created') {
        return {
            stage: 'created',
            total_button_presses: state.total_button_presses + 1,
            input_text: '',
            currentCastId: state.currentCastId
        }
    }

    if (state.stage == 'generate') {
        return {
            stage: 'created',
            total_button_presses: state.total_button_presses + 1,
            input_text: '',
            currentCastId: state.currentCastId
        }
    }

    if (state.stage == 'error') {
        return {
            stage: 'view',
            total_button_presses: state.total_button_presses + 1,
            input_text: '',
            currentCastId: state.currentCastId
        }
    }

    return {
        stage: 'view',
        total_button_presses: state.total_button_presses + 1,
        input_text: '',
        currentCastId: state.currentCastId
    }
}

export default async function Home({ params, searchParams }: NextServerPageProps) {
    const previousFrame = getPreviousFrame<State>(searchParams);

    //@ts-ignore
    let pathname = `/cast/${params.id}`;
    //@ts-ignore
    const [state, dispatch] = useFramesReducer<State>(reducer, { currentCastId: params.id, stage: 'start', total_button_presses: 0, input_text: '' }, previousFrame);

    console.log({ state });
    console.log({ previousFrame });

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
                    <FrameButton onClick={dispatch}>Retry</FrameButton>
                </FrameContainer>
            </div>
        )
    }

    //@ts-ignore
    const cast = await fetchCast(state.currentCastId);
    console.log({ cast })
    if (!cast) {
        throw new Error('Could not find Cast.')
    }
    const { data } = supabaseClient.storage.from('artcast_images').getPublicUrl(cast.image_path as string);

    if (state.stage == 'generate') {
        let newBranchNum = cast.branch_num + 1
        let newCastInfo: Cast = {
            name: cast.name,
            farcaster_id: 'jacobmtucker',
            image_path: null,
            branch_num: newBranchNum,
            num_derivatives: 0,
            num_total_derivatives: 0,
            parent_id: state.currentCastId,
            prompt_input: state.input_text,
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
        generateImage(cast.name, cast.image_path as string, state.input_text, createdArtcastId as number);
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
                    <FrameButton onClick={dispatch}>Refresh</FrameButton>
                </FrameContainer>
            </div>
        )
    }

    if (state.stage == 'start') {
        return (
            <div className="flex min-h-screen flex-col items-center gap-3 p-24">
                <FrameContainer
                    pathname={pathname}
                    postUrl="/frames"
                    state={state}
                    previousFrame={previousFrame}
                >
                    {/* <FrameImage src={data.publicUrl} /> */}
                    <FrameImage>
                        <StartFrame imageSrc={data.publicUrl} castInfo={cast} />
                    </FrameImage>
                    <FrameButton onClick={dispatch}>Join</FrameButton>
                </FrameContainer>
            </div>
        )
    }

    if (state.stage == 'view') {
        return (
            <div className="flex min-h-screen flex-col items-center gap-3 p-24">
                {cast.branch_num == 0 ?
                    <RootFrame imageSrc={data.publicUrl} castInfo={cast} /> :
                    <DerivativeFrame imageSrc={data.publicUrl} castInfo={cast} />}
                <FrameContainer
                    pathname={pathname}
                    postUrl="/frames"
                    state={state}
                    previousFrame={previousFrame}
                >
                    <FrameImage>
                        {cast.branch_num == 0 ?
                            <RootFrame imageSrc={data.publicUrl} castInfo={cast} /> :
                            <DerivativeFrame imageSrc={data.publicUrl} castInfo={cast} />}
                    </FrameImage>
                    {!cast.locked ? <FrameInput text="add a prompt..." /> : null}
                    <FrameButton href={`https://artcast.ai/cast/${cast.id}`}>Stats</FrameButton>
                    {!cast.locked ? <FrameButton onClick={dispatch}>Create</FrameButton> : null}
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
                            <CreatedFrame imageSrc={data.publicUrl} previousCastInfo={cast} castInfo={cast} />
                        </FrameImage>
                        <FrameButton href={`https://artcast.ai/cast/${cast.id}`}>Share as a cast to keep alive.</FrameButton>
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
                        <FrameButton onClick={dispatch}>Refresh</FrameButton>
                    </FrameContainer>
                </div>
            )
        }
    }
}