
import RootFrame from "@/lib/components/frames/RootFrame";
import { fetchCast } from "@/lib/supabase/functions/fetchCast";
import { supabaseClient } from "@/lib/supabase/supabaseClient";
import { FrameContainer, FrameImage, FrameReducer, FrameButton, useFramesReducer, getPreviousFrame, NextServerPageProps, FrameInput } from "frames.js/next/server";

type State = {
    stage: number;
    total_button_presses: number;
};

const reducer: FrameReducer<State> = (state, action) => {
    console.log({ state })
    return {
        stage: state.stage + 1,
        total_button_presses: state.total_button_presses + 1
    }
}

export default async function Home({ params, searchParams }: NextServerPageProps) {
    const previousFrame = getPreviousFrame<State>(searchParams);
    const [state, dispatch] = useFramesReducer<State>(reducer, { stage: 0, total_button_presses: 0 }, previousFrame);

    //@ts-ignore
    const cast = await fetchCast(params.id);
    const { data } = await supabaseClient.storage.from('artcast_images').getPublicUrl(cast.image_path)

    console.log(state)

    if (state.stage == 0) {
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
    } else {
        return (
            <div className="p-4">
                :D YAAAAY
                {/* <RootFrame imageSrc={data.publicUrl} castInfo={cast} /> */}
                <FrameContainer
                    postUrl="/frames"
                    state={state}
                    previousFrame={previousFrame}
                >
                    {/* <FrameImage src={data.publicUrl} /> */}
                    <FrameImage>
                        <RootFrame imageSrc={data.publicUrl} castInfo={cast} />
                    </FrameImage>
                    <FrameButton href={`https://artcast.ai/cast/${cast.id}`}>Stats</FrameButton>
                </FrameContainer>
            </div>
        )
    }
}