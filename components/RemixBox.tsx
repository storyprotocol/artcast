//@ts-nocheck
'use client';
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ArrowTopRightIcon, CheckIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Cast } from "@/lib/types/cast.interface";
import { storeCast } from "@/lib/supabase/functions/storeCast";
import { generateImage } from "@/lib/actions/generateImage";
import { lockLayer } from "@/lib/supabase/functions/lockLayer";

export function RemixBox({ cast }: { cast: Cast }) {
    const [castUrl, setCastUrl] = useState('');
    const [createdStatus, setCreatedStatus] = useState('not started');
    const [copied, setCopied] = useState(false);

    async function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setCreatedStatus('pending');

        // Create a FormData object
        const formData = new FormData(event.currentTarget);
        let username = formData.get('username');
        let inputPrompt = formData.get('prompt');

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
        await generateImage(cast.name, cast.image_path as string, inputPrompt, createdArtcastId as number);
        if (newCastInfo.branch_num == 10) {
            await lockLayer(newCastInfo.layer_1_cast_id as number);
        }
        const castUrl = process.env.NEXT_PUBLIC_BASE_URL + '/cast/' + createdArtcastId;
        setCastUrl(castUrl);
        setCreatedStatus('finished');
    }

    async function shareClick() {
        // Add your share logic here
        await navigator.clipboard.writeText(castUrl);
        setCopied(true);
    }

    return (
        <form onSubmit={submit} className="rounded-xl border bg-card text-card-foreground shadow p-10">
            <div className="flex flex-col space-y-1.5 mb-5">
                <h3 className="font-semibold leading-none tracking-tight">Create Child</h3>
                <p className="text-sm text-muted-foreground">Create a direct child of this Artcast directly from the dashboard.</p>
            </div>
            <div className="space-y-2 mb-5">
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" type="text" placeholder="jacobtucker" />
                <p id=":r4:-form-item-description" className="text-[0.8rem] text-muted-foreground">
                    Your farcaster username.
                </p>
            </div>
            <div className="space-y-2 mb-5">
                <Label htmlFor="prompt">Input Text</Label>
                <Input id="prompt" name="prompt" type="text" placeholder="A blue black and red snake" />
            </div>
            {createdStatus === 'finished'
                ? <div className="flex gap-2 items-center">
                    <Button disabled>
                        <CheckIcon className="mr-2 h-4 w-4" />Created
                    </Button>
                    <Button type="button" onClick={shareClick} variant="outline">
                        <ArrowTopRightIcon className="mr-2 h-4 w-4" />
                        Share
                    </Button>
                    {copied ? <p className="text-[0.8rem] text-muted-foreground">Copied!</p> : null}
                </div>
                : createdStatus === 'pending'
                    ? <Button disabled>
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                    </Button>
                    : <Button type="submit">Create</Button>
            }
        </form>
    )
}