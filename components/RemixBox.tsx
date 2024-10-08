"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { CheckIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Cast } from "@/lib/types/cast.interface";
import { storeCast } from "@/lib/functions/supabase/storeCast";
import { useRouter } from "next/navigation";
import { Address } from "viem";
import { updateCastWithNftId } from "@/lib/functions/supabase/updateCastWithNftId";
import { handleModifyImage } from "@/lib/functions/api/handleModifyImage";
import { Slider } from "./ui/slider";
import { useApp } from "./AppContext";
import { generateIpMetadata } from "@/lib/functions/generateIpMetadata";
import { useWalletClient } from "wagmi";

export function RemixBox({ cast }: { cast: Cast }) {
  const router = useRouter();
  const [createdStatus, setCreatedStatus] = useState("not started");
  const [message, setMessage] = useState("");
  const { client } = useApp();
  const { data: wallet } = useWalletClient();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client) {
      return;
    }

    setCreatedStatus("pending");
    setMessage("Storing your Artcast information...");
    const formData = new FormData(event.currentTarget);
    let prompt = formData.get("prompt") as string;
    let strength = formData.get("strength") as string;
    let createdArtcastId = (await storeCast(
      cast.name,
      null,
      cast.id,
      cast.branch_num + 1,
      prompt,
      wallet?.account.address as Address,
      true
    )) as number;
    setMessage("Modifying the image...");
    const imageIpfsHash = await handleModifyImage(
      cast.image_path!.replace("https://", "") as string,
      prompt,
      createdArtcastId,
      Number(strength)
    );
    const ipMetadata = await generateIpMetadata(
      client,
      imageIpfsHash,
      cast.name,
      prompt
    );
    setMessage("Registering your Artcast on Story Protocol...");
    const registeredIpAsset =
      await client.ipAsset.mintAndRegisterIpAndMakeDerivative({
        nftContract: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as Address,
        derivData: {
          parentIpIds: [cast.ip_id as Address],
          licenseTermsIds: ["1"],
        },
        ipMetadata,
        txOptions: { waitForTransaction: true },
      });
    console.log(
      `Completed at transaction hash ${registeredIpAsset.txHash}, IPA ID: ${registeredIpAsset.childIpId}`
    );
    await updateCastWithNftId(
      registeredIpAsset.childIpId as Address,
      "0",
      createdArtcastId
    );
    setCreatedStatus("finished");
    router.push(`/cast/${createdArtcastId}`);
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-xl border bg-card text-card-foreground shadow p-10"
    >
      <div className="flex flex-col space-y-1.5 mb-5">
        <h3 className="font-semibold leading-none tracking-tight">
          Create Remix
        </h3>
        <p className="text-sm text-muted-foreground">
          Continue this Artcast&apos;s storyline by creating a remix.
        </p>
      </div>
      <div className="space-y-2 mb-5">
        <Label htmlFor="prompt">Prompt</Label>
        <Input
          id="prompt"
          name="prompt"
          type="text"
          placeholder="The character has blue eyes..."
        />
        <p
          id=":r4:-form-item-description"
          className="text-[0.8rem] text-muted-foreground"
        >
          Your additional prompt.
        </p>
      </div>
      <div className="space-y-2 mb-5">
        <Label htmlFor="strength">Strength</Label>
        <Slider
          defaultValue={[0.7]}
          max={1}
          min={0}
          step={0.1}
          className="w-[60%]"
          id="strength"
          name="strength"
        />
        <p
          id=":r4:-form-item-description"
          className="text-[0.8rem] text-muted-foreground"
        >
          The higher the strength, the more different the next image will be.
        </p>
      </div>
      {!wallet ? (
        <div>
          <Button disabled>Create</Button>
          <p className="text-[0.8rem] text-muted-foreground text-yellow-400">
            Please log in to create an Artcast.
          </p>
        </div>
      ) : createdStatus === "finished" ? (
        <div className="flex gap-2 items-center">
          <Button disabled>
            <CheckIcon className="mr-2 h-4 w-4" />
            Created
          </Button>
          <p className="text-[0.8rem] text-muted-foreground">
            Redirecting now...
          </p>
        </div>
      ) : createdStatus === "pending" ? (
        <div>
          <Button disabled>
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </Button>
          <p className="text-[0.8rem] text-muted-foreground">{message}</p>
          <p className="text-[0.8rem] text-muted-foreground">
            This may take up to a minute.
          </p>
        </div>
      ) : (
        <Button type="submit">Create</Button>
      )}
    </form>
  );
}
