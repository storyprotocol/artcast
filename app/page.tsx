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
  const [copied, setCopied] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreatedStatus('pending');
    const formData = new FormData(event.currentTarget);
    const generatedCastId = await saveArtCast(formData);
    const castUrl = process.env.NEXT_PUBLIC_BASE_URL + '/cast/' + generatedCastId;
    setCastUrl(castUrl);
    setCreatedStatus('finished');
  }

  async function shareClick() {
    // Add your share logic here
    await navigator.clipboard.writeText(castUrl);
    setCopied(true);
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

        if (width / height != 1) {
          // You can reset the input or show an error message here
          fileInput.value = ''; // Reset the input to clear the selected file
          setError('Please upload a square image (preferably 1024x1024).')
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
            {error ? <span className="text-red-400">{error}</span> : 'Preferred image dimensions: 1024x1024.'}
          </p>
        </div>
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
  );
}


