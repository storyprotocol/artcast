'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { handleGenerateImage } from "@/lib/functions/handleGenerateImage";
import { storeCast } from "@/lib/supabase/functions/storeCast";
import { useRouter } from 'next/navigation';

export function HomepageForm() {
    const router = useRouter();
    const [createdStatus, setCreatedStatus] = useState('not started');

    async function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setCreatedStatus('pending');
        const formData = new FormData(event.currentTarget);
        let name = formData.get('name') as string;
        let farcaster_id = formData.get('username') as string;
        let prompt = formData.get('prompt') as string;
        let createdArtcastId = await storeCast(name, farcaster_id, null, null, 0, prompt, null) as number;
        await handleGenerateImage(name, [prompt], createdArtcastId, farcaster_id);
        setCreatedStatus('finished');
        router.push(`/cast/${createdArtcastId}`);
    }

    return (
        <form onSubmit={submit} className="space-y-6 p-10 pb-16 max-w-lg mx-auto">
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">Create Artcast</h2>
                <p className="text-muted-foreground">Create your own collaborative AI-generated story, registered on Story Protocol, and share it on Farcaster below.</p>
            </div>
            <div data-orientation="horizontal" role="none" className="shrink-0 bg-border h-[1px] w-full my-6"></div>
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" type="text" placeholder="Shiba" />
                <p id=":r4:-form-item-description" className="text-[0.8rem] text-muted-foreground">
                    The name of your Artcast.
                </p>
            </div>
            <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" type="text" placeholder="dwr.eth" />
                <p id=":r4:-form-item-description" className="text-[0.8rem] text-muted-foreground">
                    Your farcaster username.
                </p>
            </div>
            <div className="space-y-2">
                <Label htmlFor="prompt">Prompt</Label>
                <Input id="prompt" name="prompt" type="text" placeholder="A shiba dog..." />
                <p id=":r4:-form-item-description" className="text-[0.8rem] text-muted-foreground">
                    Your prompt.
                </p>
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