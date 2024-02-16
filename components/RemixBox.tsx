'use client';
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { CheckIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Cast } from "@/lib/types/cast.interface";
import { storeCast } from "@/lib/supabase/functions/storeCast";
import { lockLayer } from "@/lib/supabase/functions/lockLayer";
import { handleGenerateImage } from "@/lib/functions/handleGenerateImage";
import { useRouter } from "next/navigation";

export function RemixBox({ cast }: { cast: Cast }) {
    const router = useRouter();
    const [createdStatus, setCreatedStatus] = useState('not started');

    async function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setCreatedStatus('pending');

        // Create a FormData object
        const formData = new FormData(event.currentTarget);
        let username = formData.get('username') as string;
        let inputPrompt = formData.get('prompt') as string;

        let newBranchNum = cast.branch_num + 1
        //@ts-ignore
        let newCastInfo: Cast = {
            name: cast.name,
            farcaster_id: username,
            image_path: null,
            branch_num: newBranchNum,
            num_derivatives: 0,
            num_total_derivatives: 0,
            parent_id: cast.id,
            prompt_input: inputPrompt,
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
        let pastPrompts: string[] = cast.version_history.map(ele => ele.prompt_input as string).filter(ele => !!ele).concat(inputPrompt);
        await handleGenerateImage(cast.name, pastPrompts, createdArtcastId as number, username);
        if (newCastInfo.branch_num == 10) {
            await lockLayer(newCastInfo.layer_1_cast_id as number);
        }
        setCreatedStatus('finished');
        router.push(`/cast/${createdArtcastId}`);
    }

    return (
        <form onSubmit={submit} className="rounded-xl border bg-card text-card-foreground shadow p-10">
            <div className="flex flex-col space-y-1.5 mb-5">
                <h3 className="font-semibold leading-none tracking-tight">Create Remix</h3>
                <p className="text-sm text-muted-foreground">Continue this Artcast&apos;s storyline by creating a remix.</p>
            </div>
            <div className="space-y-2 mb-5">
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" type="text" placeholder="dwr.eth" />
                <p id=":r4:-form-item-description" className="text-[0.8rem] text-muted-foreground">
                    Your farcaster username.
                </p>
            </div>
            <div className="space-y-2 mb-5">
                <Label htmlFor="prompt">Input Text</Label>
                <Input id="prompt" name="prompt" type="text" placeholder="A shiba dog..." />
            </div>
            {createdStatus === 'finished'
                ? <div className="flex gap-2 items-center">
                    <Button disabled>
                        <CheckIcon className="mr-2 h-4 w-4" />Created
                    </Button>
                    <p className="text-[0.8rem] text-muted-foreground">Redirecting now...</p>
                </div>
                : createdStatus === 'pending'
                    ? <div>
                        <Button disabled>
                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                        </Button>
                        <p className="text-[0.8rem] text-muted-foreground">Creating & registering your Artcast on Story Protocol...</p>
                        <p className="text-[0.8rem] text-muted-foreground">This may take up to a minute.</p>
                    </div>
                    : <Button type="submit">Create</Button>
            }
        </form>
    )
}