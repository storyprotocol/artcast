'use client';
import { useState } from "react";
import { saveArtCast } from "@/lib/actions/saveArtcast";
import { Button } from "@/components/ui/button";
import { ArrowTopRightIcon, CheckIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [castUrl, setCastUrl] = useState('');
  const [createdStatus, setCreatedStatus] = useState('not started');
  const [error, setError] = useState('');

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreatedStatus('pending');
    const formData = new FormData(event.currentTarget);
    const generatedCastId = await saveArtCast(formData);
    const castUrl = 'artcast.ai/cast/' + generatedCastId;
    setCastUrl(castUrl);
    setCreatedStatus('finished');
  }

  async function shareClick() {
    // Add your share logic here
    await navigator.clipboard.writeText(castUrl);
  }

  const handleFileChange = (event: any) => {
    setError('');
    const fileInput = event.target;
    const file = fileInput.files[0];

    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const width = img.width;
        const height = img.height;

        if (
          !((width == 1024 && height == 1024) ||
            (width == 1152 && height == 896) ||
            (width == 1216 && height == 832) ||
            (width == 1344 && height == 768) ||
            (width == 1536 && height == 640) ||
            (width == 640 && height == 1536) ||
            (width == 768 && height == 1344) ||
            (width == 832 && height == 1216) ||
            (width == 896 && height == 1152))
        ) {
          // You can reset the input or show an error message here
          fileInput.value = ''; // Reset the input to clear the selected file
          setError('Please upload a 1024x1024 image.')
        }
      };
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6 p-10 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Create Artcast</h2>
        <p className="text-muted-foreground">Create your own Artcast and share it on Farcaster below.</p>
      </div>
      <div data-orientation="horizontal" role="none" className="shrink-0 bg-border h-[1px] w-full my-6"></div>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" type="text" placeholder="A Green Lizard" />
        <p id=":r4:-form-item-description" className="text-[0.8rem] text-muted-foreground">
          Your farcaster username.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" name="username" type="text" placeholder="jacobtucker" />
        <p id=":r4:-form-item-description" className="text-[0.8rem] text-muted-foreground">
          Your farcaster username.
        </p>
      </div>
      <div className="space-y-2">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="image">Art</Label>
          <Input id="image" name="image" type="file" accept="image/png, image/jpeg" onChange={handleFileChange} />
          <p id=":r4:-form-item-description" className="text-[0.8rem] text-muted-foreground">
            {error ? <span className="text-red-400">{error}</span> : '1024x1024 image.'}
          </p>
        </div>
      </div>

      {createdStatus === 'finished'
        ? <div className="flex gap-2">
          <Button disabled>
            <CheckIcon className="mr-2 h-4 w-4" />Created
          </Button>
          <Button type="button" onClick={shareClick} variant="outline">
            <ArrowTopRightIcon className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
        : createdStatus === 'pending'
          ? <Button disabled>
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </Button>
          : <Button type="submit">Create</Button>
      }
    </form>
  );
}


