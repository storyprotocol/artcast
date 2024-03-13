import { FrameButton, FrameContainer, FrameImage, useFramesReducer, FrameReducer, NextServerPageProps, getPreviousFrame } from "frames.js/next/server";
import HomepageFrame from "@/components/frames/HomepageFrame";
import { HomepageForm } from "@/components/HomepageForm";

const reducer: FrameReducer = (state, action) => {
  return state;
}

export default function Home({ params, searchParams }: NextServerPageProps) {
  const previousFrame = getPreviousFrame(searchParams);
  let pathname = `/`;
  //@ts-ignore
  const [state, dispatch] = useFramesReducer(reducer, {}, previousFrame);

  return (
    <>
      <FrameContainer
        pathname={pathname}
        postUrl="/frames"
        state={state}
        previousFrame={previousFrame}
      >
        {/* <FrameImage src={data.publicUrl} /> */}
        <FrameImage>
          <HomepageFrame />
        </FrameImage>
        <FrameButton action='link' target={process.env.NEXT_PUBLIC_BASE_URL}>Create an Artcast</FrameButton>
      </FrameContainer>
      <HomepageForm />
    </>
  );
}