'use client';
import { saveArtCast } from "@/lib/actions/saveArtcast";
import { useState } from "react";

export default function MyForm() {
    const [submitted, setSubmitted] = useState(false);
    const [castUrl, setCastUrl] = useState('');

    async function submit(formData: FormData) {
        const generatedCastId = await saveArtCast(formData)
        const castUrl = 'artcast.ai/cast/' + generatedCastId;
        setCastUrl(castUrl);
        setSubmitted(true);
    }

    return (
        <form action={submit} className="flex flex-col items-center gap-3">
            <label>
                Name:
                <input type="text" name="name" />
            </label>
            <br />
            <label>
                Farcaster ID:
                <input type="text" name="farcaster_id" />
            </label>
            <br />
            <label>
                Image:
                <input type="file" name="image" accept="image/*" />
            </label>
            <br />
            <button type="submit">Submit</button>
            {submitted ? <p>Cast Url: {castUrl}</p> : null}
        </form>
    );
};