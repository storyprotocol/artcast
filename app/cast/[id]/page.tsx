
import CreatedFrame from "@/lib/components/frames/CreatedFrame";
import DerivativeFrame from "@/lib/components/frames/DerivativeFrame";
import RootFrame from "@/lib/components/frames/RootFrame";
import { fetchCast } from "@/lib/supabase/functions/fetchCast";
import { storeCast } from "@/lib/supabase/functions/storeCast";
import { supabaseClient } from "@/lib/supabase/supabaseClient";
import { Cast } from "@/lib/types/cast.interface";
import { FrameContainer, FrameImage, FrameReducer, FrameButton, useFramesReducer, getPreviousFrame, NextServerPageProps, FrameInput } from "frames.js/next/server";

type Stage = 'view' | 'create'

type State = {
    cast_id: number;
    stage: Stage;
    total_button_presses: number;
    input_text: string;
};

const reducer: FrameReducer<State> = (state, action) => {
    // create a new Artcast
    if (state.stage == 'view' && action.postBody?.untrustedData.buttonIndex == 3) {
        return {
            cast_id: state.cast_id,
            stage: 'create',
            total_button_presses: state.total_button_presses + 1,
            input_text: action.postBody.untrustedData.inputText as string
        }
    }

    return {
        cast_id: state.cast_id,
        stage: 'view',
        total_button_presses: state.total_button_presses + 1,
        input_text: ''
    }
}

export default async function Home({ params, searchParams }: NextServerPageProps) {
    const previousFrame = getPreviousFrame<State>(searchParams);
    //@ts-ignore
    const [state, dispatch] = useFramesReducer<State>(reducer, { cast_id: params.id, stage: 'view', total_button_presses: 0 }, previousFrame);

    console.log({ state });
    console.log({ previousFrame });

    //@ts-ignore
    const cast = await fetchCast(state.cast_id);
    if (!cast) {
        throw new Error('Could not find Cast.')
    }
    const { data } = supabaseClient.storage.from('artcast_images').getPublicUrl(cast.image_path);

    if (state.stage == 'view') {
        if (cast.branch_num == 0) {
            return (
                <div className="p-4">
                    Here is the cast:
                    {/* <RootFrame imageSrc={data.publicUrl} castInfo={cast} /> */}
                    <FrameContainer
                        pathname={`/cast/${cast.id}`}
                        postUrl="/frames"
                        state={state}
                        previousFrame={previousFrame}
                    >
                        {/* <FrameImage src={data.publicUrl} /> */}
                        <FrameImage>
                            <RootFrame imageSrc={data.publicUrl} castInfo={cast} />
                        </FrameImage>
                        <FrameInput text="add a prompt..." />
                        <FrameButton href={`https://www.google.com`}>Refresh</FrameButton>
                        <FrameButton href={`https://artcast.ai/cast/${cast.id}`}>Stats</FrameButton>
                        <FrameButton onClick={dispatch}>Create</FrameButton>
                    </FrameContainer>
                </div>
            )
        }
        return (
            <div className="p-4">
                Here is the cast:
                {/* <RootFrame imageSrc={data.publicUrl} castInfo={cast} /> */}
                <FrameContainer
                    pathname={`/cast/${cast.id}`}
                    postUrl="/frames"
                    state={state}
                    previousFrame={previousFrame}
                >
                    {/* <FrameImage src={data.publicUrl} /> */}
                    <FrameImage>
                        <DerivativeFrame imageSrc={data.publicUrl} castInfo={cast} />
                    </FrameImage>
                    <FrameInput text="add a prompt..." />
                    <FrameButton href={`https://www.google.com`}>Refresh</FrameButton>
                    <FrameButton href={`https://artcast.ai/cast/${cast.id}`}>Stats</FrameButton>
                    <FrameButton onClick={dispatch}>Create</FrameButton>
                </FrameContainer>
            </div>
        )
    }

    if (state.stage === 'create') {
        let newCastInfo: Cast = {
            name: 'Test Derivative',
            farcaster_id: 'jacobmtucker',
            image_path: 'ided58695a9c7c6/rover_pic.png',
            branch_num: cast.branch_num + 1,
            num_derivatives: 0,
            parent_id: cast.id,
            prompt_input: state.input_text,
            // will get replaced
            id: 0
        }
        const createdArtcastId = await storeCast(
            newCastInfo.name,
            newCastInfo.farcaster_id,
            newCastInfo.image_path,
            newCastInfo.parent_id,
            newCastInfo.branch_num,
            newCastInfo.prompt_input
        );
        newCastInfo.id = createdArtcastId as number;
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
                        <CreatedFrame imageSrc={data.publicUrl} previousCastInfo={cast} castInfo={newCastInfo} />
                    </FrameImage>
                    <FrameButton href={`https://artcast.ai/cast/${cast.id}`}>Share as a cast to keep alive.</FrameButton>
                </FrameContainer>
            </div>
        )
    }
}